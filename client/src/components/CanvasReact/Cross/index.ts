import {Point} from '@/types';
import {DEFAULT_NODE_SIZE} from '../CanvasReact.constants';
import {SCALE} from '../CanvasReact.state';
import {ElementType} from '../CanvasReact.types';
import {Node} from '../Node';

interface CreateConnectPoint {
  node: Node;
}

const {radius, x, y} = DEFAULT_NODE_SIZE.topRightPos;

export class Cross {
  private x: number;
  private y: number;
  private radius: number;
  public node: Node;
  public elementType = ElementType.Cross;

  constructor({node}: CreateConnectPoint) {
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

  /** Проверка, попала ли мышь на точку */
  public isPointInside(mousePos: Point) {
    // Вычисление квадратов расстояний
    const distanceSquared = (mousePos.x - this.x * SCALE) ** 2 + (mousePos.y - this.y * SCALE) ** 2;
    const radiusSquared = (this.radius * SCALE) ** 2;

    return distanceSquared <= radiusSquared;
  }
}
