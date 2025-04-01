import {NodeType} from '@/shared/enums';
import {drawHoverArrows, drawRoundedRect, drawText} from '@/shared/lib';
import {Point, Sizes} from '@/shared/types';
import {DEFAULT_NODE_SIZE} from '@shared/constants';
import {
  CanvasHtmlOptions,
  CanvasWindowOptions,
  FullCanvasSize,
  Scale,
  setCanvasHtmlOptions,
  setCanvasWindowOptions,
  setFullCanvasSize,
  setScale,
} from '@shared/globalCanvasState';

import {CanvasManager} from '../CanvasManager';
import {ElementType} from '../CanvasReact.types';
import {ConnectPoint} from '../ConnectPoint';
import {Cross} from '../Cross';
import {FunctionLink} from '../FunctionLink';
import {NodePropsButton} from '../NodePropsButton';

interface CreateNode {
  position: Point;
  size: Sizes;
  type: NodeType;
  tagName?: keyof HTMLElementTagNameMap;
  manager: CanvasManager;
  zIndex: number;
  id: string;
  navigateLink?: string;
}

/** Элемент Canvas */
export class CanvasNode {
  private _size: Sizes;
  private _position: Point;

  public manager: CanvasManager;
  public connectPoints: {top: ConnectPoint; bottom: ConnectPoint; left: ConnectPoint; right: ConnectPoint};
  public cross: Cross;
  public propsButton: NodePropsButton;
  public functionLink: FunctionLink;

  public elementType = ElementType.Node;
  public tagName?: keyof HTMLElementTagNameMap;
  public type: NodeType;
  public zIndex: number;
  public id: string;
  public navigateLink?: string;

  constructor(params: CreateNode) {
    this._position = params.position;
    this._size = params.size;
    this.type = params.type;
    this.tagName = params.tagName;
    this.manager = params.manager;
    this.zIndex = params.zIndex;
    this.id = params.id;
    this.navigateLink = params.navigateLink;

    this.connectPoints = {
      top: new ConnectPoint({side: 'top', x: DEFAULT_NODE_SIZE.topCircle.x, y: DEFAULT_NODE_SIZE.topCircle.y, node: this}),
      bottom: new ConnectPoint({side: 'bottom', x: DEFAULT_NODE_SIZE.lowerCircle.x, y: DEFAULT_NODE_SIZE.lowerCircle.y, node: this}),
      left: new ConnectPoint({side: 'left', x: DEFAULT_NODE_SIZE.leftCircle.x, y: DEFAULT_NODE_SIZE.leftCircle.y, node: this}),
      right: new ConnectPoint({side: 'right', x: DEFAULT_NODE_SIZE.rightCircle.x, y: DEFAULT_NODE_SIZE.rightCircle.y, node: this}),
    };
    this.cross = new Cross({node: this});
    this.propsButton = new NodePropsButton({node: this});
    this.functionLink = new FunctionLink({node: this});
  }

  get position(): Point {
    return {
      x: (this._position.x - CanvasWindowOptions.min.x) * Scale,
      y: (this._position.y - CanvasWindowOptions.min.y) * Scale,
    };
  }

  get realPosition(): Point {
    return this._position;
  }

  set position({x, y}: Point) {
    this._position = {
      x: CanvasWindowOptions.min.x + x / Scale,
      y: CanvasWindowOptions.min.y + y / Scale,
    };
  }

  get size(): Sizes {
    return {width: this._size.width * Scale, height: this._size.height * Scale};
  }

  get realSize(): Sizes {
    return this._size;
  }

  // Метод для отрисовки фигуры на canvas
  // Функция для рисования прямоугольника с закругленными углами
  public draw(ctx: CanvasRenderingContext2D) {
    const {canvasController} = this.manager;
    const {text} = DEFAULT_NODE_SIZE;

    const x = this.position.x;
    const y = this.position.y;
    const width = DEFAULT_NODE_SIZE.width * Scale;
    const height = DEFAULT_NODE_SIZE.height * Scale;
    const radius = DEFAULT_NODE_SIZE.radius * Scale;

    const isHover =
      canvasController.hoverItem.current === this ||
      !!Object.values(this.connectPoints).find((point) => point === canvasController.hoverItem.current) ||
      (!!canvasController.hoverItem.current &&
        'node' in canvasController.hoverItem.current &&
        canvasController.hoverItem.current.node === this);

    // Рисуем основной прямоугольник с закругленными углами
    drawRoundedRect({ctx, x, y, width, height, radius});

    // Рисуем крестик
    this.cross.draw(ctx, isHover);

    // Рисуем кнопку Свойств
    this.propsButton.draw(ctx, isHover);

    // Рисуем красные круги наверху и внизу
    this.connectPoints.top.draw(ctx);
    this.connectPoints.bottom.draw(ctx);

    // Рисуем зеленые круги по бокам
    this.connectPoints.left.draw(ctx);
    this.connectPoints.right.draw(ctx);

    // Добавляем текст tagName в центр
    {
      const x = this.position.x + text.x * Scale;
      const y = this.position.y + text.y * Scale;
      const textNode = this.tagName;

      drawText({ctx, x, y, fillColor: 'black', font: 24 * Scale, textAlign: 'center', text: textNode || ''});
    }

    this.functionLink.draw(ctx, isHover);

    // Обозначаем hover эффект
    if (isHover) {
      drawHoverArrows({ctx, height, width, x, y});
    }
  }

  /** Проверка, попала ли мышь на фигуру */
  public isPointInside(mousePos: Point): boolean {
    return (
      mousePos.x >= this.position.x &&
      mousePos.x <= this.position.x + this.size.width &&
      mousePos.y >= this.position.y &&
      mousePos.y <= this.position.y + this.size.height
    );
  }

  /** Проверка, попала ли мышь на точку перетаскивания и возвращаем её */
  public checkInsideConnectPoints(mousePos: Point) {
    for (const point of Object.values(this.connectPoints)) {
      if (point.isPointInside(mousePos)) return point;
    }

    return undefined;
  }

  /** Проверка, попала ли мышь на крестик */
  public checkInsideCross(mousePos: Point) {
    if (this.cross.isPointInside(mousePos)) return this.cross;

    return undefined;
  }

  /** Проверка, попала ли мышь на крестик */
  public checkInsidePropsButton(mousePos: Point) {
    if (this.propsButton.isPointInside(mousePos)) return this.propsButton;

    return undefined;
  }

  /** Проверка, попала ли мышь на ссылка функции */
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

        this.manager.reactStore.navigate(this.navigateLink || '');
      }
    }, 1);
  }

  public destroy() {
    this.manager.nodesManager.deleteNode(this);
    this.manager.arrowManager.deleteArrowsOfNode(this);

    if (this.type === NodeType.htmlElement) this.manager.nodesManager.reactStore.returnNode(this);
  }
}
