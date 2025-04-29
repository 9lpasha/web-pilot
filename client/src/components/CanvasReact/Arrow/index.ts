import {CanvasWindowOptions, Scale} from '@/shared/globalCanvasState';
import {drawConnectArrow} from '@/shared/lib';
import {Point} from '@/shared/types';

import {CanvasNode} from '../CanvasNode';
import {ElementType} from '../CanvasReact.types';
import {ConnectPoint} from '../ConnectPoint';

interface CreateArrow {
  from: ConnectPoint;
  to: ConnectPoint;
  path: Point[];
  node: CanvasNode;
}

export class Arrow {
  public node: CanvasNode;
  public from: ConnectPoint;
  public to: ConnectPoint;
  public path: Point[];
  public elementType = ElementType.Arrow;

  constructor(params: CreateArrow) {
    this.from = params.from;
    this.to = params.to;
    this.path = params.path;
    this.node = params.node;
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawConnectArrow(ctx, this.path);
  }

  isPointInside(mousePos: Point): boolean {
    const maxDistance = 10;

    for (let i = 0; i < this.path.length - 1; i++) {
      const start = {x: (this.path[i].x - CanvasWindowOptions.min.x) * Scale, y: (this.path[i].y - CanvasWindowOptions.min.y) * Scale};
      const end = {
        x: (this.path[i + 1].x - CanvasWindowOptions.min.x) * Scale,
        y: (this.path[i + 1].y - CanvasWindowOptions.min.y) * Scale,
      };

      if (start.x === end.x) {
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);

        const distX = Math.abs(mousePos.x - start.x);
        const isYInRange = mousePos.y >= minY - maxDistance && mousePos.y <= maxY + maxDistance;

        if (distX <= maxDistance && isYInRange) return true;
      } else if (start.y === end.y) {
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);

        const distY = Math.abs(mousePos.y - start.y);
        const isXInRange = mousePos.x >= minX - maxDistance && mousePos.x <= maxX + maxDistance;

        if (distY <= maxDistance && isXInRange) return true;
      }
    }

    return false;
  }
}
