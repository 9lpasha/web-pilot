import {DEFAULT_NODE_SIZE} from '@/shared/constants';
import {NodeType, VariableType} from '@/shared/enums';
import {Scale} from '@/shared/globalCanvasState';
import {drawHoverArrows, drawNodeType, drawPropsRect, drawRoundedRect, drawText} from '@/shared/lib';

import {ElementType} from '../../CanvasReact.types';
import {CanvasNode} from '../CanvasNode';
import {getNodeType, getNodeTypeColor, isVariableCanvasNode} from '../CanvasNode.helpers';
import {CreateCanvasNode} from '../CanvasNode.types';

export class VariableCanvasNode extends CanvasNode {
  public type = NodeType.variable;
  public value: string | number | boolean | null;
  public dataType: VariableType;
  public variableType: string;

  constructor(params: CreateCanvasNode & {value: string | number | boolean | null; dataType: VariableType; variableType: string}) {
    super(params);

    this.value = params.value;
    this.dataType = params.dataType;
    this.variableType = params.variableType;
  }

  override draw(ctx: CanvasRenderingContext2D) {
    const {canvasController} = this.manager;
    const {text, topLeftPos, bottomLeftPos} = DEFAULT_NODE_SIZE;

    const x = this.position.x;
    const y = this.position.y;
    const width = DEFAULT_NODE_SIZE.width * Scale;
    const height = DEFAULT_NODE_SIZE.height * Scale;
    const radius = DEFAULT_NODE_SIZE.radius * Scale;

    const isHover =
      canvasController.hoverItem.current === this ||
      (!!canvasController.hoverItem.current &&
        'node' in canvasController.hoverItem.current &&
        canvasController.hoverItem.current.node === this &&
        canvasController.hoverItem.current.elementType !== ElementType.Arrow);

    // Рисуем основной прямоугольник с закругленными углами
    drawRoundedRect({ctx, x, y, width, height, radius});

    // Рисуем крестик
    this.cross.draw(ctx, isHover);

    this.propsButton.draw(ctx, true);

    // Рисуем красные круги наверху и внизу
    this.connectPoints.top.draw(ctx);
    this.connectPoints.bottom.draw(ctx);

    // Рисуем зеленые круги по бокам
    this.connectPoints.left.draw(ctx);
    this.connectPoints.right.draw(ctx);

    // Добавляем текст type
    {
      const x = this.position.x + topLeftPos.x * Scale;
      const y = this.position.y + topLeftPos.y * Scale;
      const text = getNodeType(this.type);
      const color = getNodeTypeColor(this.type);

      drawNodeType({ctx, x, y, color, text});
    }

    {
      const x = this.position.x + bottomLeftPos.x * Scale;
      const y = this.position.y + bottomLeftPos.y * Scale;
      const text = isVariableCanvasNode(this) ? this.value : '';

      if (this.variableType === 'const') drawPropsRect({ctx, x, y, isHovered: false, text});
    }

    // Добавляем текст tagName в центр
    {
      const x = this.position.x + text.x * Scale;
      const y = this.position.y + text.y * Scale;
      const textNode = this.name;

      drawText({ctx, x, y, fillColor: 'black', font: 24 * Scale, textAlign: 'center', text: textNode || ''});
    }

    // Обозначаем hover эффект
    if (isHover) {
      drawHoverArrows({ctx, height, width, x, y});
    }
  }
}
