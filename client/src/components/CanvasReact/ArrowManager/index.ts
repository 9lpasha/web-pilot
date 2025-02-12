import {drawTempConnectArrow} from '@/helpers';
import {Sizes, Point} from '@/types';
import {Arrow} from '../CanvasReact.types';
import {ConnectPoint} from '../ConnectPoint';
import {CanvasManager} from '../CanvasManager';

/** Класс для соединения фигур стрелками */
export class ArrowManager {
  public arrows: Arrow[] = [];
  /** Создаваемая стрелка */
  public tempArrow: null | Arrow = null;
  /** Стартовая точка, из которой перетаскиваем ноду */
  public startArrowPoint: null | ConnectPoint = null;
  /** Финишная точка, из которой перетаскиваем ноду */
  public finishArrowPoint: null | ConnectPoint = null;

  constructor(private manager: CanvasManager) {}

  /** Добавление стрелки между двумя фигурами */
  public addArrow({from, to, path}: {from: ConnectPoint; to: ConnectPoint; path: Point[]}) {
    this.arrows.push({from, to, path});
    from.connected = true;
    to.connected = true;
  }

  /** Расчет пути временной стрелки */
  private calculatePath(startX: number, startY: number, endX: number, endY: number, nodeParams: Sizes, point?: ConnectPoint): Point[] {
    const optional = point
      ? {
          finishSide: point.side,
          nodeFinishParams: {width: point.node.size.width, height: point.node.size.height},
        }
      : undefined;

    return drawTempConnectArrow({
      ctx: this.manager.canvasRenderer.ctxTemp,
      startX,
      startY,
      endX,
      endY,
      nodeParams,
      side: (this.startArrowPoint as ConnectPoint).side,
      ...optional,
    });
  }

  /** Рисование временной стрелки (во время перетягивания) */
  public drawTempArrow(e: MouseEvent, point: ConnectPoint) {
    const {x: startX, y: startY} = point.position;
    const {height, width} = point.node.size;
    const nodeParams = {height, width};

    this.manager.canvasRenderer.draw();

    let path: Point[] = [];

    const node = this.manager.nodesManager.nodes
      .filter((n) => n.isPointInside({x: e.offsetX, y: e.offsetY}))
      .sort((a, b) => b.zIndex - a.zIndex)?.[0];

    if (node) {
      const mousePos = {
        x: e.offsetX - node.position.x,
        y: e.offsetY - node.position.y,
      };

      const point = node.checkInsideConnectPoints(mousePos);

      if (point && point.node !== this.startArrowPoint?.node) {
        this.finishArrowPoint = point;
        path = this.calculatePath(startX, startY, point.position.x, point.position.y, nodeParams, point);
      } else {
        this.finishArrowPoint = null;
        path = this.calculatePath(startX, startY, e.offsetX, e.offsetY, nodeParams);
      }
    } else {
      this.finishArrowPoint = null;
      path = this.calculatePath(startX, startY, e.offsetX, e.offsetY, nodeParams);
    }

    if (this.startArrowPoint && this.finishArrowPoint) {
      this.tempArrow = {from: this.startArrowPoint, to: this.finishArrowPoint, path};
    }
  }
}
