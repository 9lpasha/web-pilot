import {NodeType, VariableType} from '@/shared/enums';
import {drawTempConnectArrow} from '@/shared/lib';
import {CanvasNodeStore, CanvasNodeStoreOptionalFields, Point} from '@/shared/types';
import {CANVAS_QUADRO_SIZE, DEFAULT_NODE_SIZE} from '@shared/constants';
import {CanvasWindowOptions} from '@shared/globalCanvasState';

import {Arrow} from '../Arrow';
import {CanvasManager} from '../CanvasManager';
import {CanvasNode, FunctionCanvasNode, VariableCanvasNode} from '../CanvasNode';
import {BrowserApiFunctionCanvasNode} from '../CanvasNode/BrowserApiFunctionCanvasNode';
import {BrowserApiObjectCanvasNode} from '../CanvasNode/BrowserApiObjectCanvasNode';
import {AnyCanvasNode} from '../CanvasNode/CanvasNode.types';
import {EventCanvasNode} from '../CanvasNode/EventCanvasNode';
import {HtmlCanvasNode} from '../CanvasNode/HtmlCanvasNode';
import {ObjectCanvasNode} from '../CanvasNode/ObjectCanvasNode';
import {OperatorCanvasNode} from '../CanvasNode/OperatorCanvasNode';
import {ReactStoreForCanvas} from '../CanvasReact.types';

/** Класс для управления нодами */
export class NodesManager {
  private manager: CanvasManager;
  public nodes: AnyCanvasNode[];
  public reactStore: ReactStoreForCanvas;

  constructor(manager: CanvasManager, nodes: CanvasNodeStore[] = [], reactStore: ReactStoreForCanvas) {
    this.manager = manager;
    this.nodes = nodes.map((n) => {
      if (n.type === NodeType.htmlElement) return new HtmlCanvasNode({...n, manager, tagName: n.tagName as keyof HTMLElementTagNameMap});
      if (n.type === NodeType.event) return new EventCanvasNode({...n, manager});
      if (n.type === NodeType.function) return new FunctionCanvasNode({...n, manager, navigateLink: n.navigateLink || ''});
      if (n.type === NodeType.browserApiFunction) return new BrowserApiFunctionCanvasNode({...n, manager, args: n.args || 0});
      if (n.type === NodeType.object) return new ObjectCanvasNode({...n, manager});
      if (n.type === NodeType.browserApiObject) return new BrowserApiObjectCanvasNode({...n, manager});
      if (n.type === NodeType.operator) return new OperatorCanvasNode({...n, manager});
      if (n.type === NodeType.variable)
        return new VariableCanvasNode({
          ...n,
          manager,
          value: n.value || null,
          dataType: n.dataType || VariableType.null,
          variableType: n.variableType || '',
        });

      return new EventCanvasNode({...n, manager});
    });
    this.reactStore = reactStore;
  }

  public addNode(type: NodeType, id: string, name: string, options?: CanvasNodeStoreOptionalFields) {
    const {height, width} = DEFAULT_NODE_SIZE;
    // Создание позиции по сетке ближе к центру экрана
    const position = {
      x: Math.round((CanvasWindowOptions.min.x + CanvasWindowOptions.width / 2 - width / 2) / CANVAS_QUADRO_SIZE) * CANVAS_QUADRO_SIZE,
      y: Math.round((CanvasWindowOptions.min.y + CanvasWindowOptions.height / 2 - height / 2) / CANVAS_QUADRO_SIZE) * CANVAS_QUADRO_SIZE,
    };

    const mainFields = {size: {height, width}, type, position, manager: this.manager, zIndex: this.nodes.length, id, name};

    let node: AnyCanvasNode;
    switch (type) {
      case NodeType.browserApiFunction:
        node = new BrowserApiFunctionCanvasNode({...mainFields, args: options?.args || 0});
        break;
      case NodeType.browserApiObject:
        node = new BrowserApiObjectCanvasNode(mainFields);
        break;
      case NodeType.event:
        node = new EventCanvasNode(mainFields);
        break;
      case NodeType.function:
        node = new FunctionCanvasNode({...mainFields, navigateLink: options?.navigateLink || ''});
        break;
      case NodeType.htmlElement:
        node = new HtmlCanvasNode({...mainFields, tagName: options?.tagName as keyof HTMLElementTagNameMap});
        break;
      case NodeType.object:
        node = new ObjectCanvasNode(mainFields);
        break;
      case NodeType.operator:
        node = new OperatorCanvasNode(mainFields);
        break;
      case NodeType.variable:
        node = new VariableCanvasNode({
          ...mainFields,
          value: options?.value || null,
          dataType: options?.dataType || VariableType.null,
          variableType: options?.variableType || '',
        });
        break;
    }

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
    const {nodesManager, canvasController} = this.manager;
    if (node.connectPoints.top.connected) {
      const arrowsTop = nodesManager.nodes.reduce((acc, cur) => {
        cur.arrows.forEach((a) => {
          if (
            (a.to.node === canvasController.movingNode || a.from.node === canvasController.movingNode) &&
            (a.from === node.connectPoints.top || a.to === node.connectPoints.top)
          )
            acc.push(a);
        });
        return acc;
      }, [] as Arrow[]);

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
      const arrowsRight = nodesManager.nodes.reduce((acc, cur) => {
        cur.arrows.forEach((a) => {
          if (
            (a.to.node === canvasController.movingNode || a.from.node === canvasController.movingNode) &&
            (a.from === node.connectPoints.right || a.to === node.connectPoints.right)
          )
            acc.push(a);
        });
        return acc;
      }, [] as Arrow[]);

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
      const arrowsBottom = nodesManager.nodes.reduce((acc, cur) => {
        cur.arrows.forEach((a) => {
          if (
            (a.to.node === canvasController.movingNode || a.from.node === canvasController.movingNode) &&
            (a.from === node.connectPoints.bottom || a.to === node.connectPoints.bottom)
          )
            acc.push(a);
        });
        return acc;
      }, [] as Arrow[]);

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
      const arrowsLeft = nodesManager.nodes.reduce((acc, cur) => {
        cur.arrows.forEach((a) => {
          if (
            (a.to.node === canvasController.movingNode || a.from.node === canvasController.movingNode) &&
            (a.from === node.connectPoints.left || a.to === node.connectPoints.left)
          )
            acc.push(a);
        });
        return acc;
      }, [] as Arrow[]);

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

    this.manager.canvasRenderer.drawMovingNode();
  }

  /** Удаление ноды с полотна */
  public deleteNode(node: CanvasNode) {
    this.manager.nodesManager.nodes = this.manager.nodesManager.nodes.filter((el) => el !== node);
  }
}
