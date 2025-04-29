import {DEFAULT_NODE_SIZE} from '@/shared/constants';
import {NodeType} from '@/shared/enums';
import {
  CanvasHtmlOptions,
  CanvasWindowOptions,
  FullCanvasSize,
  Scale,
  setCanvasHtmlOptions,
  setCanvasWindowOptions,
  setFullCanvasSize,
  setScale,
} from '@/shared/globalCanvasState';
import {drawHoverArrows, drawNodeType, drawRoundedRect, drawText} from '@/shared/lib';
import {Point} from '@/shared/types';

import {ElementType} from '../../CanvasReact.types';
import {FunctionLink} from '../../FunctionLink';
import {CanvasNode} from '../CanvasNode';
import {getNodeType, getNodeTypeColor} from '../CanvasNode.helpers';
import {CreateCanvasNode} from '../CanvasNode.types';

export class FunctionCanvasNode extends CanvasNode {
  public type = NodeType.function;
  public navigateLink?: string;
  public functionLink: FunctionLink;

  constructor(params: CreateCanvasNode & {navigateLink: string}) {
    super(params);

    this.functionLink = new FunctionLink({node: this});
    this.navigateLink = params.navigateLink;
  }

  override draw(ctx: CanvasRenderingContext2D) {
    const {canvasController} = this.manager;
    const {text, topLeftPos} = DEFAULT_NODE_SIZE;

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

    // Добавляем текст tagName в центр
    {
      const x = this.position.x + text.x * Scale;
      const y = this.position.y + text.y * Scale;
      const textNode = this.name;

      drawText({ctx, x, y, fillColor: 'black', font: 24 * Scale, textAlign: 'center', text: textNode || ''});
    }

    this.functionLink.draw(ctx, isHover);

    // Обозначаем hover эффект
    if (isHover) {
      drawHoverArrows({ctx, height, width, x, y});
    }
  }

  /** Проверка, попала ли мышь на ссылку функции */
  public checkInsideFunctionLink(mousePos: Point) {
    if (this.functionLink.isPointInside(mousePos)) return this.functionLink;

    return undefined;
  }

  public navigate(e: MouseEvent) {
    const tempOptions = {
      FullCanvasSize,
      CanvasHtmlOptions,
      CanvasWindowOptions,
      Scale,
    };

    if (location.pathname === this.navigateLink) return;

    const zoomInterval = setInterval(() => {
      this.manager.canvasController.handleWheel({
        ...e,
        ctrlKey: true,
        deltaY: -35,
        offsetX: this.position.x + this.size.width / 2,
        offsetY: this.position.y + this.size.height / 2,
        preventDefault: () => {},
      } as WheelEvent);

      if (Scale > 1.5) {
        this.manager.canvasRenderer.ctx.globalAlpha -= 0.02;
        this.manager.canvasRenderer.ctxBack.globalAlpha -= 0.02;
        this.manager.canvasRenderer.ctxTemp.globalAlpha -= 0.02;
      }

      if (Scale >= 9) {
        clearInterval(zoomInterval);
        setFullCanvasSize(tempOptions.FullCanvasSize);
        setCanvasHtmlOptions(tempOptions.CanvasHtmlOptions);
        setCanvasWindowOptions(tempOptions.CanvasWindowOptions);
        setScale((1 / Scale) * tempOptions.Scale);

        this.manager.reactStore.navigate?.(this.navigateLink || '');
      }
    }, 1);
  }
}
