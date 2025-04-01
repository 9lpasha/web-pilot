import {drawCircle, getConnectPointSize} from '@/shared/lib';
import {Point, ConnectSide} from '@/shared/types';
import {CONNECT_POINT_RADIUS, POINT_COLORS} from '@shared/constants';
import {Scale} from '@shared/globalCanvasState';

import {CanvasNode} from '../CanvasNode';
import {ElementType} from '../CanvasReact.types';

interface CreateConnectPoint {
  side: ConnectSide;
  x: number;
  y: number;
  radius?: number;
  node: CanvasNode;
  connected?: boolean;
}

export class ConnectPoint {
  private x: number;
  private y: number;
  private radius: number;
  public side: ConnectSide;
  public node: CanvasNode;
  public connected;
  public elementType = ElementType.ConnectPoint;

  constructor({side, x, y, node, radius = CONNECT_POINT_RADIUS, connected = false}: CreateConnectPoint) {
    this.side = side;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.node = node;
    this.connected = connected;
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

  public draw(ctx: CanvasRenderingContext2D) {
    const size = getConnectPointSize(this.side);
    const fillColor = this.side === 'bottom' || this.side === 'top' ? POINT_COLORS.FILL_RED_ALPHA : POINT_COLORS.FILL_GREEN_ALPHA;
    const strokeColor = this.side === 'bottom' || this.side === 'top' ? POINT_COLORS.STROKE_RED_ALPHA : POINT_COLORS.STROKE_GREEN_ALPHA;

    if (
      this.node.manager.canvasController.hoverItem.current === this ||
      this.node.manager.arrowManager.startArrowPoint === this ||
      this.node.manager.arrowManager.finishArrowPoint === this ||
      this.connected
    ) {
      const x = this.node.position.x + size.x * Scale;
      const y = this.node.position.y + size.y * Scale;
      const radius = size.radius * Scale;

      drawCircle({ctx, x, y, radius, fillColor, strokeColor});
    }
  }
}
