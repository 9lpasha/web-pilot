import {drawTempConnectArrow} from '@/helpers';
import {CanvasManager} from '../CanvasManager';
import {CANVAS_QUADRO_SIZE, DEFAULT_NODE_SIZE} from '../CanvasReact.constants';
import {CANVAS_WINDOW_OPTIONS} from '../CanvasReact.state';
import {NodeType} from '../CanvasReact.types';
import {Node} from '../Node';

/** Класс для управления нодами */
export class NodesManager {
  constructor(
    private manager: CanvasManager,
    public nodes: Node[] = [],
  ) {}

  public addNode(type: NodeType, tagName?: keyof HTMLElementTagNameMap) {
    // Создание позиции по сетке ближе к центру экрана
    const position = {
      x:
        Math.round((CANVAS_WINDOW_OPTIONS.min.x + CANVAS_WINDOW_OPTIONS.width / 2 - DEFAULT_NODE_SIZE.width / 2) / CANVAS_QUADRO_SIZE) *
        CANVAS_QUADRO_SIZE,
      y:
        Math.round((CANVAS_WINDOW_OPTIONS.min.y + CANVAS_WINDOW_OPTIONS.height / 2 - DEFAULT_NODE_SIZE.height / 2) / CANVAS_QUADRO_SIZE) *
        CANVAS_QUADRO_SIZE,
    };
    const node = new Node({
      height: DEFAULT_NODE_SIZE.height,
      width: DEFAULT_NODE_SIZE.width,
      type,
      tagName,
      position,
      manager: this.manager,
      zIndex: this.nodes.length,
    });

    this.nodes.push(node);

    this.manager.canvasRenderer.draw();
  }

  /** Перемещение ноды */
  public moveNode(node: Node) {
    const {arrowManager, canvasRenderer} = this.manager;

    if (node.connectPoints.top.connected) {
      const arrowsTop = arrowManager.arrows.filter((arrow) => arrow.to === node.connectPoints.top || arrow.from === node.connectPoints.top);

      for (const arrow of arrowsTop) {
        const side = arrow.from.side;
        const nodeParams = {width: arrow.from.node.size.width, height: arrow.from.node.size.height};

        if (arrow.from === node.connectPoints.top) {
          const startX = node.connectPoints.top.position.x;
          const startY = node.connectPoints.top.position.y;
          const endX = arrow.to.position.x;
          const endY = arrow.to.position.y;

          const path = drawTempConnectArrow({
            ctx: canvasRenderer.ctxTemp,
            startX,
            startY,
            endX,
            endY,
            side,
            nodeParams,
            finishSide: arrow.to.side,
            nodeFinishParams: arrow.to.node.size,
          });
          arrow.path = path;
        } else if (arrow.to === node.connectPoints.top) {
          const startX = arrow.from.position.x;
          const startY = arrow.from.position.y;
          const endX = node.connectPoints.top.position.x;
          const endY = node.connectPoints.top.position.y;
          const path = drawTempConnectArrow({
            ctx: canvasRenderer.ctxTemp,
            startX,
            startY,
            endX,
            endY,
            side,
            nodeParams,
            finishSide: arrow.to.side,
            nodeFinishParams: arrow.to.node.size,
          });
          arrow.path = path;
        }
      }
    }

    if (node.connectPoints.right.connected) {
      const arrowsRight = arrowManager.arrows.filter(
        (arrow) => arrow.to === node.connectPoints.right || arrow.from === node.connectPoints.right,
      );

      for (const arrow of arrowsRight) {
        const side = arrow.from.side;
        const nodeParams = {width: arrow.from.node.size.width, height: arrow.from.node.size.height};

        if (arrow.from === node.connectPoints.right) {
          const startX = node.connectPoints.right.position.x;
          const startY = node.connectPoints.right.position.y;
          const endX = arrow.to.position.x;
          const endY = arrow.to.position.y;

          const path = drawTempConnectArrow({
            ctx: canvasRenderer.ctxTemp,
            startX,
            startY,
            endX,
            endY,
            side,
            nodeParams,
            finishSide: arrow.to.side,
            nodeFinishParams: arrow.to.node.size,
          });
          arrow.path = path;
        } else if (arrow.to === node.connectPoints.right) {
          const startX = arrow.from.position.x;
          const startY = arrow.from.position.y;
          const endX = node.connectPoints.right.position.x;
          const endY = node.connectPoints.right.position.y;
          const path = drawTempConnectArrow({
            ctx: canvasRenderer.ctxTemp,
            startX,
            startY,
            endX,
            endY,
            side,
            nodeParams,
            finishSide: arrow.to.side,
            nodeFinishParams: arrow.to.node.size,
          });
          arrow.path = path;
        }
      }
    }

    if (node.connectPoints.bottom.connected) {
      const arrowsBottom = arrowManager.arrows.filter(
        (arrow) => arrow.to === node.connectPoints.bottom || arrow.from === node.connectPoints.bottom,
      );

      for (const arrow of arrowsBottom) {
        const side = arrow.from.side;
        const nodeParams = {width: arrow.from.node.size.width, height: arrow.from.node.size.height};

        if (arrow.from === node.connectPoints.bottom) {
          const startX = node.connectPoints.bottom.position.x;
          const startY = node.connectPoints.bottom.position.y;
          const endX = arrow.to.position.x;
          const endY = arrow.to.position.y;

          const path = drawTempConnectArrow({
            ctx: canvasRenderer.ctxTemp,
            startX,
            startY,
            endX,
            endY,
            side,
            nodeParams,
            finishSide: arrow.to.side,
            nodeFinishParams: arrow.to.node.size,
          });
          arrow.path = path;
        } else if (arrow.to === node.connectPoints.bottom) {
          const startX = arrow.from.position.x;
          const startY = arrow.from.position.y;
          const endX = node.connectPoints.bottom.position.x;
          const endY = node.connectPoints.bottom.position.y;
          const path = drawTempConnectArrow({
            ctx: canvasRenderer.ctxTemp,
            startX,
            startY,
            endX,
            endY,
            side,
            nodeParams,
            finishSide: arrow.to.side,
            nodeFinishParams: arrow.to.node.size,
          });
          arrow.path = path;
        }
      }
    }

    if (node.connectPoints.left.connected) {
      const arrowsLeft = arrowManager.arrows.filter(
        (arrow) => arrow.to === node.connectPoints.left || arrow.from === node.connectPoints.left,
      );

      for (const arrow of arrowsLeft) {
        const side = arrow.from.side;
        const nodeParams = {width: arrow.from.node.size.width, height: arrow.from.node.size.height};

        if (arrow.from === node.connectPoints.left) {
          const startX = node.connectPoints.left.position.x;
          const startY = node.connectPoints.left.position.y;
          const endX = arrow.to.position.x;
          const endY = arrow.to.position.y;

          const path = drawTempConnectArrow({
            ctx: canvasRenderer.ctxTemp,
            startX,
            startY,
            endX,
            endY,
            side,
            nodeParams,
            finishSide: arrow.to.side,
            nodeFinishParams: arrow.to.node.size,
          });
          arrow.path = path;
        } else if (arrow.to === node.connectPoints.left) {
          const startX = arrow.from.position.x;
          const startY = arrow.from.position.y;
          const endX = node.connectPoints.left.position.x;
          const endY = node.connectPoints.left.position.y;
          const path = drawTempConnectArrow({
            ctx: canvasRenderer.ctxTemp,
            startX,
            startY,
            endX,
            endY,
            side,
            nodeParams,
            finishSide: arrow.to.side,
            nodeFinishParams: arrow.to.node.size,
          });
          arrow.path = path;
        }
      }
    }

    canvasRenderer.drawMovingNode();
  }
}
