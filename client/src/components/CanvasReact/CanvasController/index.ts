import {Modal} from 'antd';

import {SIDEBAR_WIDTH, CANVAS_QUADRO_SIZE} from '@/shared/constants';
import {isValidLink} from '@/shared/lib';
import {
  CanvasHtmlOptions,
  CanvasWindowOptions,
  Scale,
  setCanvasHtmlOptions,
  setCanvasWindowOptions,
  setScale,
} from '@shared/globalCanvasState';

import {Arrow} from '../Arrow';
import {CanvasManager} from '../CanvasManager';
import {CanvasNode, isFunctionCanvasNode} from '../CanvasNode';
import {ActionsState, ElementType, ReactStoreForCanvas, WithPrevState} from '../CanvasReact.types';
import {ConnectPoint} from '../ConnectPoint';
import {Cross} from '../Cross';
import {FunctionLink} from '../FunctionLink';
import {NodePropsButton} from '../NodePropsButton';

type HoverItemType = CanvasNode | ConnectPoint | Cross | NodePropsButton | FunctionLink | Arrow;

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
  public hoverItem: WithPrevState<HoverItemType> = {prev: null, current: null};
  /** Перетаскиваемая нода */
  public movingNode: null | CanvasNode = null;

  constructor(private manager: CanvasManager) {}

  private setHover(item: HoverItemType | null) {
    this.hoverItem = {prev: this.hoverItem.current, current: item};
  }

  private resetHover() {
    this.hoverItem = {prev: this.hoverItem.current, current: null};
  }

  /** Перемещение фоновой сетки и всех нод */
  private moveCanvas(x: number, y: number) {
    CanvasWindowOptions.min.x += x / Scale;
    CanvasWindowOptions.min.y += y / Scale;
    CanvasWindowOptions.max.x += x / Scale;
    CanvasWindowOptions.max.y += y / Scale;

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
          this.movingNode = hovered as CanvasNode;
          this.state = ActionsState.movingNode;

          this.currentMovingNodePosition = 'position' in hovered ? {...hovered.position} : {x: 0, y: 0};
        } else if (hovered.elementType === ElementType.ConnectPoint) {
          this.manager.arrowManager.startArrowPoint = hovered as ConnectPoint;
          this.state = ActionsState.creatingArrow;
        }
      }
    }
  }

  public handleMouseMove(e: MouseEvent): void {
    const {nodesManager, canvasRenderer, arrowManager, canvasController} = this.manager;

    switch (this.state) {
      case ActionsState.movingCanvas: {
        this.moveCanvas(-e.movementX, -e.movementY);

        break;
      }

      case ActionsState.movingNode: {
        const node = this.movingNode;
        const {x: curX, y: curY} = this.currentMovingNodePosition;
        const {x: minX, y: minY} = CanvasWindowOptions.min;

        if (!node) return;

        this.currentMovingNodePosition = {x: curX + e.movementX, y: curY + e.movementY};

        // Перевод в абсолютные координаты, округление и далее перевод обратно в координаты канваса
        node.position = {
          x: (Math.round((minX + curX / Scale) / CANVAS_QUADRO_SIZE) * CANVAS_QUADRO_SIZE - minX) * Scale,
          y: (Math.round((minY + curY / Scale) / CANVAS_QUADRO_SIZE) * CANVAS_QUADRO_SIZE - minY) * Scale,
        };

        nodesManager.moveNode(node);

        if (canvasController.hoverItem) this.resetHover();

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
          const cross = node.checkInsideCross(mousePos);
          const propsButton = node.checkInsidePropsButton(mousePos);
          const functionLink = isFunctionCanvasNode(node) ? node.checkInsideFunctionLink(mousePos) : undefined;
          const arrow = node.checkInsideArrow(mousePos);

          if (point) {
            this.setHover(point);
          } else if (!point) {
            this.setHover(node);
          }

          if (cross) {
            this.setHover(cross);
          } else if (propsButton) {
            this.setHover(propsButton);
          } else if (functionLink) {
            this.setHover(functionLink);
          } else if (arrow) {
            this.setHover(arrow);
          }
        } else {
          const mousePos = {
            x: e.offsetX,
            y: e.offsetY,
          };
          const arrow = nodesManager.nodes.reduce(
            (acc, node) => {
              const arrow = node.checkInsideArrow(mousePos);

              if (arrow) {
                this.setHover(arrow);
                acc = arrow;
              }

              return acc;
            },
            null as Arrow | null,
          );

          if (!arrow) this.resetHover();
        }

        if (this.hoverItem.prev !== this.hoverItem.current) canvasRenderer.draw();

        break;
      }

      case ActionsState.creatingArrow: {
        if (!arrowManager.startArrowPoint) return;

        arrowManager.drawTempArrow(e, arrowManager.startArrowPoint);

        if (canvasController.hoverItem) this.resetHover();

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
      if (isValidLink(arrowManager.tempArrow.from.node, arrowManager.tempArrow.to.node))
        arrowManager.tempArrow.from.node.addArrow(arrowManager.tempArrow);
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

  public handleClick(e: MouseEvent, reactStore: ReactStoreForCanvas): void {
    const hovered = this.hoverItem.current;

    if (hovered?.elementType === ElementType.Cross && 'node' in hovered) {
      hovered.node.destroy();

      this.state = ActionsState.default;
      this.manager.canvasRenderer.draw();
    } else if (hovered?.elementType === ElementType.NodePropsButton && 'node' in hovered) {
      reactStore.openModal?.();

      this.state = ActionsState.default;
      this.resetHover();
      this.manager.canvasRenderer.draw();
    } else if (hovered?.elementType === ElementType.FunctionLink && 'node' in hovered) {
      if (isFunctionCanvasNode(hovered.node)) hovered?.node.navigate(e);
    } else if (hovered?.elementType === ElementType.Arrow && 'node' in hovered) {
      Modal.confirm({
        title: 'Подтверждение',
        content: 'Удалить стрелку?',
        onOk() {
          hovered.node.deleteArrow(hovered as Arrow);
        },
      });
    }
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
        const newWidth = CanvasWindowOptions.width * multiplier;
        const newHeight = CanvasWindowOptions.height * multiplier;
        const min = {
          x: CanvasWindowOptions.min.x + (1 - multiplier) * CanvasWindowOptions.width * (e.offsetX / CanvasHtmlOptions.width),
          y: CanvasWindowOptions.min.y + (1 - multiplier) * CanvasWindowOptions.height * (e.offsetY / CanvasHtmlOptions.height),
        };

        // проверка на граничные значения
        const isNiceNewScale = Scale * (1 / multiplier) >= 0.05 && Scale * (1 / multiplier) <= 10;
        if (isNiceNewScale) {
          setCanvasWindowOptions({
            width: newWidth,
            height: newHeight,
            min,
            max: {x: min.x + newWidth, y: min.y + newHeight},
          });
          setScale(1 / multiplier);
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
    const {height: htmlHeight, width: htmlWidth} = CanvasHtmlOptions;
    const {height: windowHeight, width: windowWidth} = CanvasWindowOptions;

    const canvasInnerW = width === htmlWidth ? windowWidth : (windowWidth * width) / htmlWidth;
    const canvasInnerH = width === htmlHeight ? windowHeight : (windowHeight * height) / htmlHeight;

    setCanvasWindowOptions({
      width: canvasInnerW,
      height: canvasInnerH,
      min: CanvasWindowOptions.min,
      max: {x: CanvasWindowOptions.min.x + canvasInnerW, y: CanvasWindowOptions.min.y + canvasInnerH},
    });
    setCanvasHtmlOptions({width, height});
  }
}
