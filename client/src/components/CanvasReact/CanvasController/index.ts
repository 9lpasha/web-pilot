import {CanvasManager} from '../CanvasManager';
import {CANVAS_QUADRO_SIZE, SIDEBAR_WIDTH} from '../CanvasReact.constants';
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
import {ConnectPoint} from '../ConnectPoint';

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
  public movingNode: null | Node = null;

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

    switch (this.state) {
      case ActionsState.movingCanvas: {
        this.moveCanvas(-e.movementX, -e.movementY);

        break;
      }

      case ActionsState.movingNode: {
        const node = this.movingNode;
        const {x: curX, y: curY} = this.currentMovingNodePosition;
        const {x: minX, y: minY} = CANVAS_WINDOW_OPTIONS.min;

        if (!node) return;

        this.currentMovingNodePosition = {x: curX + e.movementX, y: curY + e.movementY};

        // Перевод в абсолютные координаты, округление и далее перевод обратно в координаты канваса
        node.position = {
          x: (Math.round((minX + curX / SCALE) / CANVAS_QUADRO_SIZE) * CANVAS_QUADRO_SIZE - minX) * SCALE,
          y: (Math.round((minY + curY / SCALE) / CANVAS_QUADRO_SIZE) * CANVAS_QUADRO_SIZE - minY) * SCALE,
        };

        nodesManager.moveNode(node);

        break;
      }

      case ActionsState.default: {
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

        break;
      }

      case ActionsState.creatingArrow: {
        if (!arrowManager.startArrowPoint) return;

        arrowManager.drawTempArrow(e, arrowManager.startArrowPoint);

        break;
      }
      default: {
        break;
      }
    }
  }

  public handleMouseUp(): void {
    const {canvasRenderer, arrowManager} = this.manager;

    this.state = ActionsState.default;

    if (arrowManager.startArrowPoint && arrowManager.finishArrowPoint && arrowManager.tempArrow) {
      arrowManager.addArrow(arrowManager.tempArrow);
      arrowManager.tempArrow = null;
    }

    if (this.movingNode) {
      this.redrawedCanvasAfterMovingNode = false;
    }

    this.movingNode = null;
    arrowManager.startArrowPoint = null;
    arrowManager.finishArrowPoint = null;
    canvasRenderer.draw();
  }

  public handleMouseLeave(): void {
    // this.state = ActionsState.default;
    this.movingNode = null;
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
          // TODO тут баг (после скейлинга у граничных значений начинается некорректный скейлинг)
          // const newFixScale = SCALE * (1 / multiplier) < 0.05 ? 0.05 : 10;
          // console.log(newFixScale, SCALE);
          // updateScale(newFixScale / SCALE);
          // if (SCALE !== 0.05 && SCALE !== 10) this.manager.canvasRenderer.draw();
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
    const width = window.innerWidth - SIDEBAR_WIDTH;
    const height = window.innerHeight;
    const {height: htmlHeight, width: htmlWidth} = CANVAS_HTML_OPTIONS;
    const {height: windowHeight, width: windowWidth} = CANVAS_WINDOW_OPTIONS;

    const canvasInnerW = width === htmlWidth ? windowWidth : (windowWidth * width) / htmlWidth;
    const canvasInnerH = width === htmlHeight ? windowHeight : (windowHeight * height) / htmlHeight;

    setCanvasWindowOptions({
      width: canvasInnerW,
      height: canvasInnerH,
      min: CANVAS_WINDOW_OPTIONS.min,
      max: {x: CANVAS_WINDOW_OPTIONS.min.x + canvasInnerW, y: CANVAS_WINDOW_OPTIONS.min.y + canvasInnerH},
    });
    setCanvasHtmlOptions({width, height});
  }
}
