import {CONNECT_POINT_RADIUS} from '../../CanvasReact.constants';
import {Node} from '..';
import {SCALE} from '../../CanvasReact.state';
import {ConnectSide, ElementType, Point} from '../../CanvasReact.types';

interface CreateConnectPoint {
  side: ConnectSide;
  x: number;
  y: number;
  radius?: number;
  node: Node;
}

export class ConnectPoint {
  private x: number;
  private y: number;
  private radius: number;
  public side: ConnectSide;
  public node: Node;
  public elementType = ElementType.ConnectPoint;
  public connected = false;

  constructor({side, x, y, radius = CONNECT_POINT_RADIUS, node}: CreateConnectPoint) {
    this.side = side;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.node = node;
  }

  get position() {
    return {
      x: this.node.position.x + this.x * SCALE,
      y: this.node.position.y + this.y * SCALE,
    };
  }

  // Проверяем, попала ли мышь на точку
  public isPointInside(mousePos: Point) {
    // Вычисление квадратов расстояний
    const distanceSquared = (mousePos.x - this.x * SCALE) ** 2 + (mousePos.y - this.y * SCALE) ** 2;
    const radiusSquared = (this.radius * SCALE) ** 2;

    // Возвращаем true, если расстояние до точки меньше или равно радиусу
    return distanceSquared <= radiusSquared;
  }
}
