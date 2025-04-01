import {drawRedCross} from '@/shared/lib';
import {Point} from '@/shared/types';
import {DEFAULT_NODE_SIZE} from '@shared/constants';
import {Scale} from '@shared/globalCanvasState';

import {CanvasNode} from '../CanvasNode';
import {ElementType} from '../CanvasReact.types';

interface CreateConnectPoint {
  node: CanvasNode;
}

const {radius, x, y} = DEFAULT_NODE_SIZE.topRightPos;

export class Cross {
  private x: number;
  private y: number;
  private radius: number;
  public node: CanvasNode;
  public elementType = ElementType.Cross;

  constructor({node}: CreateConnectPoint) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.node = node;
  }

  get position() {
    return {
      x: this.node.position.x + this.x * Scale,
      y: this.node.position.y + this.y * Scale,
    };
  }

  /** Проверка, попала ли мышь на точку */
  public isPointInside(mousePos: Point) {
    // Вычисление квадратов расстояний
    const distanceSquared = (mousePos.x - this.x * Scale) ** 2 + (mousePos.y - this.y * Scale) ** 2;
    const radiusSquared = (this.radius * Scale) ** 2;

    return distanceSquared <= radiusSquared;
  }

  public draw(ctx: CanvasRenderingContext2D, isHover: boolean) {
    const {topRightPos} = DEFAULT_NODE_SIZE;

    // Рисуем крест при наведении
    if (isHover) {
      const x = this.node.position.x + topRightPos.x * Scale;
      const y = this.node.position.y + topRightPos.y * Scale;
      const radius = topRightPos.radius * Scale;

      drawRedCross({ctx, x, y, radius, isHovered: this.node.manager.canvasController.hoverItem.current === this});
    }
  }
}
