import {NodeType} from '@/shared/enums';
import {drawPropsRect} from '@/shared/lib';
import {Point} from '@/shared/types';
import {DEFAULT_NODE_SIZE} from '@shared/constants';
import {Scale} from '@shared/globalCanvasState';

import {AnyCanvasNode, isVariableCanvasNode} from '../CanvasNode';
import {ElementType} from '../CanvasReact.types';

interface CreateConnectPoint {
  node: AnyCanvasNode;
}

const {x, y, height, width} = DEFAULT_NODE_SIZE.bottomLeftPos;

export class NodePropsButton {
  private x: number;
  private y: number;
  public node: AnyCanvasNode;
  public elementType = ElementType.NodePropsButton;

  constructor({node}: CreateConnectPoint) {
    this.x = x;
    this.y = y;
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
    if (isVariableCanvasNode(this.node)) return;
    return (
      this.node.type === NodeType.htmlElement &&
      mousePos.x >= this.x * Scale &&
      mousePos.x <= (this.x + width) * Scale &&
      mousePos.y >= this.y * Scale &&
      mousePos.y <= (this.y + height) * Scale
    );
  }

  public draw(ctx: CanvasRenderingContext2D, isHover: boolean) {
    const {bottomLeftPos} = DEFAULT_NODE_SIZE;

    // Рисуем кнопку при наведении
    if (isHover && this.node.type === NodeType.htmlElement) {
      const x = this.node.position.x + bottomLeftPos.x * Scale;
      const y = this.node.position.y + bottomLeftPos.y * Scale;
      const text = isVariableCanvasNode(this.node) ? this.node.value : '';

      drawPropsRect({ctx, x, y, isHovered: this.node.manager.canvasController.hoverItem.current === this, text});
    }
  }
}
