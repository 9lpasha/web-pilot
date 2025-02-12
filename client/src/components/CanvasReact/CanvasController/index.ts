import {CanvasManager} from '../CanvasManager';
import {CANVAS_QUADRO_SIZE} from '../CanvasReact.constants';
import {
  CANVAS_HTML_OPTIONS,
  CANVAS_WINDOW_OPTIONS,
  SCALE,
  setCanvasHtmlOptions,
  setCanvasWindowOptions,
  updateScale,
} from '../CanvasReact.state';
import {ActionsState, ElementType, WithPrevState} from '../CanvasReact.types';
import {Node} from '../Node';
import {ConnectPoint} from '../Node/ConnectPoint';

export class CanvasController {
  /** Состояние канваса */
  private state: ActionsState = ActionsState.default;
  /** Состояние для оптимизации скейлинга */
  private stopUserEventFlag = false;
  /** Вспомогательное состояние для скейлинга */
  private accumulatedScale = 0;
  /** Текущая позиция перетаскиваемой ноды */
  private currentMovingNodePosition = {x: 0, y: 0};
  /** Флаг для перерисовки фоновой сетки */
  public isChangedSizePosition = true;
  /** Состояние для оптимизации перетаскивания ноды */
  public redrawedCanvasAfterMovingNode = false;
  /** Нода или точка перетаскивания в состоянии hover */
  public hoverItem: WithPrevState<ConnectPoint | Node> = {prev: null, current: null};
  /** Перетаскиваемая нода */
  public movingNode: undefined | Node;

  constructor(private manager: CanvasManager) {}

  private setHover(item: Node | ConnectPoint | null) {
    this.hoverItem = {prev: this.hoverItem.current, current: item};
  }

  private resetHover() {
    this.hoverItem = {prev: this.hoverItem.current, current: null};
  }

  /** Перемещение фоновой сетки и всех нод */
  private moveCanvas(x: number, y: number) {
    CANVAS_WINDOW_OPTIONS.min.x += x / SCALE;
    CANVAS_WINDOW_OPTIONS.min.y += y / SCALE;
    CANVAS_WINDOW_OPTIONS.max.x += x / SCALE;
    CANVAS_WINDOW_OPTIONS.max.y += y / SCALE;

    this.isChangedSizePosition = true;

    this.manager.canvasRenderer.draw();
  }

  public handleMouseDown(e: MouseEvent) {
    if (e.button === 1) {
      this.state = ActionsState.movingCanvas;
      this.resetHover();
    } else if (e.button === 0) {
      const hovered = this.hoverItem.current;

      if (hovered) {
        if (hovered.elementType === ElementType.Node) {
          this.movingNode = hovered as Node;
          this.state = ActionsState.movingNode;
          this.resetHover();

          this.currentMovingNodePosition = {...hovered.position};
        } else {
          this.manager.arrowManager.startArrowPoint = hovered as ConnectPoint;
          this.state = ActionsState.creatingArrow;
          this.resetHover();
        }
      }
    }
  }

  public handleMouseMove(e: MouseEvent): void {
    const {nodesManager, canvasRenderer, arrowManager} = this.manager;

    if (this.state === ActionsState.movingCanvas) {
      this.moveCanvas(-e.movementX, -e.movementY);
    } else if (this.state === ActionsState.movingNode) {
      const node = this.movingNode;

      if (!node) return;

      this.currentMovingNodePosition = {
        x: this.currentMovingNodePosition.x + e.movementX,
        y: this.currentMovingNodePosition.y + e.movementY,
      };

      // Перевод в абсолютные координаты, округление и далее перевод обратно в координаты канваса
      node.position = {
        x:
          (Math.round((CANVAS_WINDOW_OPTIONS.min.x + this.currentMovingNodePosition.x / SCALE) / CANVAS_QUADRO_SIZE) * CANVAS_QUADRO_SIZE -
            CANVAS_WINDOW_OPTIONS.min.x) *
          SCALE,
        y:
          (Math.round((CANVAS_WINDOW_OPTIONS.min.y + this.currentMovingNodePosition.y / SCALE) / CANVAS_QUADRO_SIZE) * CANVAS_QUADRO_SIZE -
            CANVAS_WINDOW_OPTIONS.min.y) *
          SCALE,
      };

      nodesManager.moveNode(node);
    } else if (this.state === ActionsState.default) {
      // Выбор фигуры, на которой находится курсор, и если их несколько, то самая верхняя
      const nodes = nodesManager.nodes.filter((fig) => fig.isPointInside({x: e.offsetX, y: e.offsetY}));
      const node = nodes.sort((a, b) => b.zIndex - a.zIndex)?.[0];

      if (node) {
        const mousePos = {
          x: e.offsetX - node.position.x,
          y: e.offsetY - node.position.y,
        };

        const point = node.checkInsideConnectPoints(mousePos);

        if (point) {
          this.setHover(point);
        } else if (!point) {
          this.setHover(node);
        }
      } else {
        this.resetHover();
      }

      if (this.hoverItem.prev !== this.hoverItem.current) canvasRenderer.draw();
    } else if (this.state === ActionsState.creatingArrow) {
      const point = arrowManager.startArrowPoint;

      if (!point) return;

      arrowManager.drawTempArrow(e, point);
    }
  }

  public handleMouseUp(): void {
    const {canvasRenderer, arrowManager} = this.manager;

    this.state = ActionsState.default;

    if (arrowManager.startArrowPoint && arrowManager.finishArrowPoint && arrowManager.tempArrow) {
      arrowManager.addArrow(arrowManager.tempArrow);
      arrowManager.tempArrow = undefined;
    }

    if (this.movingNode) {
      this.redrawedCanvasAfterMovingNode = false;
    }

    this.movingNode = undefined;
    arrowManager.startArrowPoint = undefined;
    arrowManager.finishArrowPoint = undefined;
    canvasRenderer.draw();
  }

  public handleMouseLeave(): void {
    // this.state = ActionsState.default;
    this.movingNode = undefined;
  }

  /** Обработка колёсика и тачпада (тут проблемное место) */
  public handleWheel(e: WheelEvent) {
    // Масштабирование
    if (e.ctrlKey) {
      e.preventDefault();

      if (!this.stopUserEventFlag) {
        this.stopUserEventFlag = true;
        const handleTimeout = () => (this.stopUserEventFlag = false);
        setTimeout(handleTimeout, 10);

        const absDelta = Math.abs(e.deltaY);
        let calcDelta = absDelta <= 1 ? 1 : absDelta < 15 ? 15 : 30;

        if (calcDelta === 1) {
          this.accumulatedScale += 1;

          if (this.accumulatedScale < 5) return;

          calcDelta = 5;
        }

        const calcChange = calcDelta / 300;
        const numerator = e.deltaY > 0 ? Math.abs(calcChange) : 0;
        const denomerator = e.deltaY < 0 ? Math.abs(calcChange) : 0;
        const multiplier = (1 + numerator) / (1 + denomerator);
        const newWidth = CANVAS_WINDOW_OPTIONS.width * multiplier;
        const newHeight = CANVAS_WINDOW_OPTIONS.height * multiplier;
        const min = {
          x: CANVAS_WINDOW_OPTIONS.min.x + (1 - multiplier) * CANVAS_WINDOW_OPTIONS.width * (e.offsetX / CANVAS_HTML_OPTIONS.width),
          y: CANVAS_WINDOW_OPTIONS.min.y + (1 - multiplier) * CANVAS_WINDOW_OPTIONS.height * (e.offsetY / CANVAS_HTML_OPTIONS.height),
        };

        // проверка на граничные значения
        const isNiceNewScale = SCALE * (1 / multiplier) >= 0.05 && SCALE * (1 / multiplier) <= 10;
        if (isNiceNewScale) {
          setCanvasWindowOptions({
            width: newWidth,
            height: newHeight,
            min,
            max: {x: min.x + newWidth, y: min.y + newHeight},
          });
          updateScale(1 / multiplier);
          this.manager.canvasRenderer.draw();
        } else {
          const newFixScale = SCALE * (1 / multiplier) < 0.05 ? 0.05 : 10;
          updateScale(newFixScale / SCALE);

          if (SCALE !== 0.05 && SCALE !== 10) this.manager.canvasRenderer.draw();
        }
      }
    } else {
      // TODO
      // для перемещения фона на тачпаде, но тогда на мышке при скроле двигается фон (надо посмотреть как убрать скролл на мышке)
      // this.moveCanvas(e.deltaX, e.deltaY);
    }

    this.isChangedSizePosition = true;
  }

  public handleResize() {
    const width = window.innerWidth - 150;
    const height = window.innerHeight;

    const canvasInnerW =
      width === CANVAS_HTML_OPTIONS.width ? CANVAS_WINDOW_OPTIONS.width : (CANVAS_WINDOW_OPTIONS.width * width) / CANVAS_HTML_OPTIONS.width;
    const canvasInnerH =
      width === CANVAS_HTML_OPTIONS.height
        ? CANVAS_WINDOW_OPTIONS.height
        : (CANVAS_WINDOW_OPTIONS.height * height) / CANVAS_HTML_OPTIONS.height;

    setCanvasWindowOptions({
      width: canvasInnerW,
      height: canvasInnerH,
      min: CANVAS_WINDOW_OPTIONS.min,
      max: {x: CANVAS_WINDOW_OPTIONS.min.x + canvasInnerW, y: CANVAS_WINDOW_OPTIONS.min.y + canvasInnerH},
    });
    setCanvasHtmlOptions({width, height});
  }
}
