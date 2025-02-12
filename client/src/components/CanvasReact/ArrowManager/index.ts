import {CanvasManager} from '../CanvasManager';
import {Arrow, Point} from '../CanvasReact.types';
import {drawTempConnectArrow} from '../../../helpers';
import {ConnectPoint} from '../Node/ConnectPoint';

/** Класс для соединения фигур стрелками */
export class ArrowManager {
  public arrows: Arrow[] = [];
  /** Создаваемая стрелка */
  public tempArrow: undefined | Arrow;
  /** Стартовая точка, из которой перетаскиваем ноду */
  public startArrowPoint: undefined | ConnectPoint;
  /** Финишная точка, из которой перетаскиваем ноду */
  public finishArrowPoint: undefined | ConnectPoint;

  constructor(private manager: CanvasManager) {}

  // Добавление стрелки между двумя фигурами
  public addArrow({from, to, path}: {from: ConnectPoint; to: ConnectPoint; path: Point[]}) {
    this.arrows.push({from, to, path});
    from.connected = true;
    to.connected = true;
  }

  // Рисование временной стрелки (во время перетягивания)
  public drawTempArrow(e: MouseEvent, point: ConnectPoint) {
    const {nodesManager, canvasRenderer} = this.manager;
    const startX = point.position.x;
    const startY = point.position.y;

    const node = point.node;
    const nodeParams = {
      width: node.size.width,
      height: node.size.height,
    };

    canvasRenderer.draw();

    let path: Point[] = [];

    {
      const nodes = nodesManager.nodes.filter((fig) => fig.isPointInside({x: e.offsetX, y: e.offsetY}));
      const node = nodes.sort((a, b) => b.zIndex - a.zIndex)?.[0];

      if (node) {
        const mousePos = {
          x: e.offsetX - node.position.x,
          y: e.offsetY - node.position.y,
        };

        const point = node.checkInsideConnectPoints(mousePos);

        if (point && point.node !== this.startArrowPoint?.node) {
          this.finishArrowPoint = point;
          path = drawTempConnectArrow({
            ctx: canvasRenderer.ctxTemp,
            startX,
            startY,
            endX: point.position.x,
            endY: point.position.y,
            nodeParams,
            side: (this.startArrowPoint as ConnectPoint).side,
            finishSide: point.side,
            nodeFinishParams: {width: point.node.size.width, height: point.node.size.height},
          });
        } else {
          this.finishArrowPoint = undefined;
          path = drawTempConnectArrow({
            ctx: canvasRenderer.ctxTemp,
            startX,
            startY,
            endX: e.offsetX,
            endY: e.offsetY,
            nodeParams,
            side: (this.startArrowPoint as ConnectPoint).side,
          });
        }
      } else {
        this.finishArrowPoint = undefined;
        path = drawTempConnectArrow({
          ctx: canvasRenderer.ctxTemp,
          startX,
          startY,
          endX: e.offsetX,
          endY: e.offsetY,
          nodeParams,
          side: (this.startArrowPoint as ConnectPoint).side,
        });
      }
    }

    if (this.startArrowPoint && this.finishArrowPoint) this.tempArrow = {from: this.startArrowPoint, to: this.finishArrowPoint, path};
  }
}
