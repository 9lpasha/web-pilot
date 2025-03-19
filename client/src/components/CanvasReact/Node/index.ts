import {drawCircle, drawHoverArrows, drawRoundedRect, drawText} from '@/helpers';
import {Point, Sizes} from '@/types';
import {CanvasManager} from '../CanvasManager';
import {ConnectPoint} from '../ConnectPoint';
import {POINT_COLORS, DEFAULT_NODE_SIZE} from '../CanvasReact.constants';
import {CANVAS_WINDOW_OPTIONS, SCALE} from '../CanvasReact.state';
import {ElementType, NodeType} from '../CanvasReact.types';
import {drawRedCross} from '@/helpers/drawRedCross';
import {Cross} from '../Cross';

interface CreateNode {
  position: Point;
  width: number;
  height: number;
  type: NodeType;
  tagName?: keyof HTMLElementTagNameMap;
  manager: CanvasManager;
  zIndex: number;
  id: string;
}

/** Элемент Canvas */
export class Node {
  private manager: CanvasManager;

  private _size: Sizes;
  private _position: Point;
  public tagName?: keyof HTMLElementTagNameMap;
  public type: NodeType;
  public elementType = ElementType.Node;
  public connectPoints: {top: ConnectPoint; bottom: ConnectPoint; left: ConnectPoint; right: ConnectPoint};
  public cross: Cross;
  public zIndex: number;
  public id: string;

  constructor(params: CreateNode) {
    this._position = params.position;
    this._size = {width: params.width, height: params.height};
    this.type = params.type;
    this.tagName = params.tagName;
    this.manager = params.manager;
    this.zIndex = params.zIndex;
    this.id = params.id;

    this.connectPoints = {
      top: new ConnectPoint({side: 'top', x: DEFAULT_NODE_SIZE.topCircle.x, y: DEFAULT_NODE_SIZE.topCircle.y, node: this}),
      bottom: new ConnectPoint({side: 'bottom', x: DEFAULT_NODE_SIZE.lowerCircle.x, y: DEFAULT_NODE_SIZE.lowerCircle.y, node: this}),
      left: new ConnectPoint({side: 'left', x: DEFAULT_NODE_SIZE.leftCircle.x, y: DEFAULT_NODE_SIZE.leftCircle.y, node: this}),
      right: new ConnectPoint({side: 'right', x: DEFAULT_NODE_SIZE.rightCircle.x, y: DEFAULT_NODE_SIZE.rightCircle.y, node: this}),
    };
    this.cross = new Cross({node: this});
  }

  get position(): Point {
    return {
      x: (this._position.x - CANVAS_WINDOW_OPTIONS.min.x) * SCALE,
      y: (this._position.y - CANVAS_WINDOW_OPTIONS.min.y) * SCALE,
    };
  }

  set position({x, y}: Point) {
    this._position = {
      x: CANVAS_WINDOW_OPTIONS.min.x + x / SCALE,
      y: CANVAS_WINDOW_OPTIONS.min.y + y / SCALE,
    };
  }

  get size(): Sizes {
    return {width: this._size.width * SCALE, height: this._size.height * SCALE};
  }

  // Метод для отрисовки фигуры на canvas
  // Функция для рисования прямоугольника с закругленными углами
  public draw(ctx: CanvasRenderingContext2D) {
    const {canvasController, arrowManager} = this.manager;
    const {lowerCircle, topCircle, leftCircle, rightCircle, topRightPos, text} = DEFAULT_NODE_SIZE;

    const x = this.position.x;
    const y = this.position.y;
    const width = DEFAULT_NODE_SIZE.width * SCALE;
    const height = DEFAULT_NODE_SIZE.height * SCALE;
    const radius = DEFAULT_NODE_SIZE.radius * SCALE;

    const isHover =
      canvasController.hoverItem.current === this ||
      Object.values(this.connectPoints).find((point) => point === canvasController.hoverItem.current) ||
      canvasController.hoverItem.current === this.cross;

    // Рисуем основной прямоугольник с закругленными углами
    drawRoundedRect({ctx, x, y, width, height, radius});

    // Рисуем крест при наведении
    if (isHover) {
      const x = this.position.x + topRightPos.x * SCALE;
      const y = this.position.y + topRightPos.y * SCALE;
      const radius = topRightPos.radius * SCALE;

      drawRedCross({ctx, x, y, radius, isHovered: canvasController.hoverItem.current === this.cross});
    }

    // Рисуем красные круги наверху и внизу
    if (
      canvasController.hoverItem.current === this.connectPoints.top ||
      arrowManager.startArrowPoint === this.connectPoints.top ||
      arrowManager.finishArrowPoint === this.connectPoints.top ||
      this.connectPoints.top.connected
    ) {
      const x = this.position.x + topCircle.x * SCALE;
      const y = this.position.y + topCircle.y * SCALE;
      const radius = topCircle.radius * SCALE;

      drawCircle({ctx, x, y, radius, fillColor: POINT_COLORS.FILL_RED_ALPHA, strokeColor: POINT_COLORS.STROKE_RED_ALPHA});
    }

    if (
      canvasController.hoverItem.current === this.connectPoints.bottom ||
      arrowManager.startArrowPoint === this.connectPoints.bottom ||
      arrowManager.finishArrowPoint === this.connectPoints.bottom ||
      this.connectPoints.bottom.connected
    ) {
      const x = this.position.x + lowerCircle.x * SCALE;
      const y = this.position.y + lowerCircle.y * SCALE;
      const radius = lowerCircle.radius * SCALE;

      drawCircle({ctx, x, y, radius, fillColor: POINT_COLORS.FILL_RED_ALPHA, strokeColor: POINT_COLORS.STROKE_RED_ALPHA});
    }

    // Рисуем зеленые круги по бокам
    if (
      canvasController.hoverItem.current === this.connectPoints.left ||
      arrowManager.startArrowPoint === this.connectPoints.left ||
      arrowManager.finishArrowPoint === this.connectPoints.left ||
      this.connectPoints.left.connected
    ) {
      const x = this.position.x + leftCircle.x * SCALE;
      const y = this.position.y + leftCircle.y * SCALE;
      const radius = leftCircle.radius * SCALE;

      drawCircle({ctx, x, y, radius, fillColor: POINT_COLORS.FILL_GREEN_ALPHA, strokeColor: POINT_COLORS.STROKE_GREEN_ALPHA});
    }

    if (
      canvasController.hoverItem.current === this.connectPoints.right ||
      arrowManager.startArrowPoint === this.connectPoints.right ||
      arrowManager.finishArrowPoint === this.connectPoints.right ||
      this.connectPoints.right.connected
    ) {
      const x = this.position.x + rightCircle.x * SCALE;
      const y = this.position.y + rightCircle.y * SCALE;
      const radius = rightCircle.radius * SCALE;

      drawCircle({ctx, x, y, radius, fillColor: POINT_COLORS.FILL_GREEN_ALPHA, strokeColor: POINT_COLORS.STROKE_GREEN_ALPHA});
    }

    // Добавляем текст tagName в центр
    {
      const x = this.position.x + text.x * SCALE;
      const y = this.position.y + text.y * SCALE;
      const textNode = this.tagName;

      drawText({ctx, x, y, fillColor: 'black', font: 24 * SCALE, textAlign: 'center', text: textNode || ''});
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

  public destroy() {
    this.manager.nodesManager.deleteNode(this);
    this.manager.arrowManager.deleteArrowsOfNode(this);
  }
}
