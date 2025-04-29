import {NodeType} from '@/shared/enums';
import {drawHoverArrows, drawNodeType, drawRoundedRect, drawText} from '@/shared/lib';
import {Point, Sizes} from '@/shared/types';
import {DEFAULT_NODE_SIZE} from '@shared/constants';
import {CanvasWindowOptions, Scale} from '@shared/globalCanvasState';

import {Arrow} from '../Arrow';
import {CanvasManager} from '../CanvasManager';
import {ElementType} from '../CanvasReact.types';
import {ConnectPoint} from '../ConnectPoint';
import {Cross} from '../Cross';
import {NodePropsButton} from '../NodePropsButton';
import {getNodeType, getNodeTypeColor, getTextNode, isHtmlCanvasNode, toAnyCanvasNode} from './CanvasNode.helpers';
import {CreateCanvasNode} from './CanvasNode.types';

/** Элемент Canvas */
export class CanvasNode {
  private _size: Sizes;
  private _position: Point;

  public manager: CanvasManager;
  public connectPoints: {top: ConnectPoint; bottom: ConnectPoint; left: ConnectPoint; right: ConnectPoint};
  public cross: Cross;
  public propsButton: NodePropsButton;
  public arrows: Arrow[];

  public elementType = ElementType.Node;
  public name: string;
  public id: string;
  public zIndex: number;
  public type: NodeType;

  constructor(params: CreateCanvasNode) {
    this._position = params.position;
    this._size = params.size;
    this.manager = params.manager;
    this.zIndex = params.zIndex;
    this.id = params.id;
    this.name = params.name;
    this.type = params.type;

    this.connectPoints = {
      top: new ConnectPoint({side: 'top', x: DEFAULT_NODE_SIZE.topCircle.x, y: DEFAULT_NODE_SIZE.topCircle.y, node: this}),
      bottom: new ConnectPoint({side: 'bottom', x: DEFAULT_NODE_SIZE.lowerCircle.x, y: DEFAULT_NODE_SIZE.lowerCircle.y, node: this}),
      left: new ConnectPoint({side: 'left', x: DEFAULT_NODE_SIZE.leftCircle.x, y: DEFAULT_NODE_SIZE.leftCircle.y, node: this}),
      right: new ConnectPoint({side: 'right', x: DEFAULT_NODE_SIZE.rightCircle.x, y: DEFAULT_NODE_SIZE.rightCircle.y, node: this}),
    };
    this.cross = new Cross({node: this});
    this.propsButton = new NodePropsButton({node: toAnyCanvasNode(this)});
    this.arrows = [];
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

    // Рисуем кнопку Свойств
    this.propsButton.draw(ctx, isHover);

    // Рисуем красные круги наверху и внизу
    this.connectPoints.top.draw(ctx);
    this.connectPoints.bottom.draw(ctx);

    // Рисуем зеленые круги по бокам
    this.connectPoints.left.draw(ctx);
    this.connectPoints.right.draw(ctx);

    // Добавляем текст name или tagName в центр
    {
      const x = this.position.x + text.x * Scale;
      const y = this.position.y + text.y * Scale;
      const textNode = getTextNode(this);

      drawText({ctx, x, y, fillColor: 'black', font: 24 * Scale, textAlign: 'center', text: textNode || ''});
    }

    // Добавляем текст type
    {
      const x = this.position.x + topLeftPos.x * Scale;
      const y = this.position.y + topLeftPos.y * Scale;
      const text = getNodeType(this.type);
      const color = getNodeTypeColor(this.type);

      drawNodeType({ctx, x, y, color, text});
    }

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

  /** Проверка, попала ли мышь на стрелку */
  public checkInsideArrow(mousePos: Point) {
    for (let i = 0; i < this.arrows.length; i++) {
      if (this.arrows[i].isPointInside(mousePos)) return this.arrows[i];
    }

    return undefined;
  }

  /** Добавление стрелки между двумя фигурами */
  public addArrow({from, to, path}: {from: ConnectPoint; to: ConnectPoint; path: Point[]}) {
    const arrow = new Arrow({from, to, path, node: this});

    from.connected = true;
    to.connected = true;
    this.arrows.push(arrow);
  }

  /** Добавление стрелки между двумя фигурами */
  public deleteArrow(arrow: Arrow) {
    this.arrows = this.arrows.filter((a) => {
      const forDelete = a === arrow;

      if (forDelete) {
        a.from.connected = false;
        a.to.connected = false;
      }

      return !forDelete;
    });

    this.manager.canvasRenderer.draw();
  }

  public deleteArrowsOfNode() {
    this.arrows.forEach((el) => {
      el.from.connected = false;
      el.to.connected = false;
    });

    /** Проверка всех стрелок других нод, отсоединение их от this ноды */
    this.manager.nodesManager.nodes.forEach((n) => {
      n.arrows = n.arrows.reduce((acc, cur) => {
        if (cur.to === this.connectPoints[cur.to.side]) {
          cur.from.connected = false;
        } else {
          acc.push(cur);
        }

        return acc;
      }, [] as Arrow[]);
    });
  }

  public destroy() {
    this.manager.nodesManager.deleteNode(this);
    this.deleteArrowsOfNode();

    if (isHtmlCanvasNode(this)) this.manager.nodesManager.reactStore.returnNode?.(this);
  }
}
