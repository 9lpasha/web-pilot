import {NodeType} from '@/shared/enums';
import {drawTempConnectArrow} from '@/shared/lib';
import {CanvasNodeStore, Point} from '@/shared/types';
import {CANVAS_QUADRO_SIZE, DEFAULT_NODE_SIZE} from '@shared/constants';
import {CanvasWindowOptions} from '@shared/globalCanvasState';

import {CanvasManager} from '../CanvasManager';
import {CanvasNode} from '../CanvasNode';
import {Arrow, ReactStoreForCanvas} from '../CanvasReact.types';

/** Класс для управления нодами */
export class NodesManager {
  private manager: CanvasManager;
  public nodes: CanvasNode[];
  public reactStore: ReactStoreForCanvas;

  constructor(manager: CanvasManager, nodes: CanvasNodeStore[] = [], reactStore: ReactStoreForCanvas) {
    this.manager = manager;
    this.nodes = nodes.map((n) => new CanvasNode({...n, manager}));
    this.reactStore = reactStore;
  }

  public addNode(type: NodeType, id: string, tagName?: keyof HTMLElementTagNameMap, navigateLink?: string) {
    const {height, width} = DEFAULT_NODE_SIZE;
    // Создание позиции по сетке ближе к центру экрана
    const position = {
      x: Math.round((CanvasWindowOptions.min.x + CanvasWindowOptions.width / 2 - width / 2) / CANVAS_QUADRO_SIZE) * CANVAS_QUADRO_SIZE,
      y: Math.round((CanvasWindowOptions.min.y + CanvasWindowOptions.height / 2 - height / 2) / CANVAS_QUADRO_SIZE) * CANVAS_QUADRO_SIZE,
    };
    const node = new CanvasNode({
      size: {height, width},
      type,
      tagName,
      position,
      manager: this.manager,
      zIndex: this.nodes.length,
      id,
      navigateLink,
    });

    this.nodes.push(node);

    this.manager.canvasRenderer.draw();
  }

  /** Расчет пути временной стрелки */
  private calculatePath(startX: number, startY: number, endX: number, endY: number, arrow: Arrow): Point[] {
    const side = arrow.from.side;
    const nodeParams = {width: arrow.from.node.size.width, height: arrow.from.node.size.height};

    return drawTempConnectArrow({
      ctx: this.manager.canvasRenderer.ctxTemp,
      startX,
      startY,
      endX,
      endY,
      nodeParams,
      side,
      finishSide: arrow.to.side,
      nodeFinishParams: arrow.to.node.size,
    });
  }

  /** Перемещение ноды */
  public moveNode(node: CanvasNode) {
    const {arrowManager, canvasRenderer} = this.manager;

    if (node.connectPoints.top.connected) {
      const arrowsTop = arrowManager.arrows.filter((arrow) => arrow.to === node.connectPoints.top || arrow.from === node.connectPoints.top);

      for (const arrow of arrowsTop) {
        if (arrow.from === node.connectPoints.top) {
          const startX = node.connectPoints.top.position.x;
          const startY = node.connectPoints.top.position.y;
          const endX = arrow.to.position.x;
          const endY = arrow.to.position.y;
          const path = this.calculatePath(startX, startY, endX, endY, arrow);

          arrow.path = path;
        } else if (arrow.to === node.connectPoints.top) {
          const startX = arrow.from.position.x;
          const startY = arrow.from.position.y;
          const endX = node.connectPoints.top.position.x;
          const endY = node.connectPoints.top.position.y;
          const path = this.calculatePath(startX, startY, endX, endY, arrow);

          arrow.path = path;
        }
      }
    }

    if (node.connectPoints.right.connected) {
      const arrowsRight = arrowManager.arrows.filter(
        (arrow) => arrow.to === node.connectPoints.right || arrow.from === node.connectPoints.right,
      );

      for (const arrow of arrowsRight) {
        if (arrow.from === node.connectPoints.right) {
          const startX = node.connectPoints.right.position.x;
          const startY = node.connectPoints.right.position.y;
          const endX = arrow.to.position.x;
          const endY = arrow.to.position.y;
          const path = this.calculatePath(startX, startY, endX, endY, arrow);

          arrow.path = path;
        } else if (arrow.to === node.connectPoints.right) {
          const startX = arrow.from.position.x;
          const startY = arrow.from.position.y;
          const endX = node.connectPoints.right.position.x;
          const endY = node.connectPoints.right.position.y;
          const path = this.calculatePath(startX, startY, endX, endY, arrow);

          arrow.path = path;
        }
      }
    }

    if (node.connectPoints.bottom.connected) {
      const arrowsBottom = arrowManager.arrows.filter(
        (arrow) => arrow.to === node.connectPoints.bottom || arrow.from === node.connectPoints.bottom,
      );

      for (const arrow of arrowsBottom) {
        if (arrow.from === node.connectPoints.bottom) {
          const startX = node.connectPoints.bottom.position.x;
          const startY = node.connectPoints.bottom.position.y;
          const endX = arrow.to.position.x;
          const endY = arrow.to.position.y;
          const path = this.calculatePath(startX, startY, endX, endY, arrow);

          arrow.path = path;
        } else if (arrow.to === node.connectPoints.bottom) {
          const startX = arrow.from.position.x;
          const startY = arrow.from.position.y;
          const endX = node.connectPoints.bottom.position.x;
          const endY = node.connectPoints.bottom.position.y;
          const path = this.calculatePath(startX, startY, endX, endY, arrow);

          arrow.path = path;
        }
      }
    }

    if (node.connectPoints.left.connected) {
      const arrowsLeft = arrowManager.arrows.filter(
        (arrow) => arrow.to === node.connectPoints.left || arrow.from === node.connectPoints.left,
      );

      for (const arrow of arrowsLeft) {
        if (arrow.from === node.connectPoints.left) {
          const startX = node.connectPoints.left.position.x;
          const startY = node.connectPoints.left.position.y;
          const endX = arrow.to.position.x;
          const endY = arrow.to.position.y;
          const path = this.calculatePath(startX, startY, endX, endY, arrow);

          arrow.path = path;
        } else if (arrow.to === node.connectPoints.left) {
          const startX = arrow.from.position.x;
          const startY = arrow.from.position.y;
          const endX = node.connectPoints.left.position.x;
          const endY = node.connectPoints.left.position.y;
          const path = this.calculatePath(startX, startY, endX, endY, arrow);

          arrow.path = path;
        }
      }
    }

    canvasRenderer.drawMovingNode();
  }

  /** Удаление ноды с полотна */
  public deleteNode(node: CanvasNode) {
    this.manager.nodesManager.nodes = this.manager.nodesManager.nodes.filter((el) => el !== node);
  }
}
