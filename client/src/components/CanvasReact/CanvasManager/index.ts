import {SIDEBAR_WIDTH} from '@/shared/constants';
import {CanvasNodeStore, GlobalCanvasInfo} from '@/shared/types';
import {DEFAULT_CANVAS_SIZE} from '@shared/constants';
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

import {ArrowManager} from '../ArrowManager';
import {CanvasController} from '../CanvasController';
import {ReactStoreForCanvas} from '../CanvasReact.types';
import {CanvasRenderer} from '../CanvasRenderer';
import {NodesManager} from '../NodesManager';

interface CreateCanvasManager {
  canvas: HTMLCanvasElement;
  canvasBack: HTMLCanvasElement;
  canvasTemp: HTMLCanvasElement;
  initialNodes: CanvasNodeStore[];
  reactStore: ReactStoreForCanvas;
  initialGlobalCanvasInfo: GlobalCanvasInfo | undefined;
}

/** Главный класс полотна */
export class CanvasManager {
  public canvas: HTMLCanvasElement;
  /** управляет работой со стрелками */
  public arrowManager: ArrowManager;
  /** управляет работой со нодами */
  public nodesManager: NodesManager;
  /** рисует базовую часть полотна */
  public canvasRenderer: CanvasRenderer;
  /** управляет пользовательскими действиями */
  public canvasController: CanvasController;
  /** управляет пользовательскими действиями */
  public reactStore: ReactStoreForCanvas;

  constructor({canvas, canvasBack, canvasTemp, initialNodes, initialGlobalCanvasInfo, reactStore}: CreateCanvasManager) {
    const ctx = canvas.getContext('2d')!;
    const ctxBack = canvasBack.getContext('2d')!;
    const ctxTemp = canvasTemp.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    ctx.scale(dpr, dpr);
    ctxBack.scale(dpr, dpr);
    ctxTemp.scale(dpr, dpr);

    this.canvas = canvas;
    this.reactStore = reactStore;
    this.canvasRenderer = new CanvasRenderer(this, ctx, ctxBack, ctxTemp, canvas);

    this.nodesManager = new NodesManager(this, initialNodes, reactStore);

    this.canvasController = new CanvasController(this);

    this.arrowManager = new ArrowManager(this);

    const canvasInnerW = window.innerWidth - SIDEBAR_WIDTH;
    const canvasInnerH = window.innerHeight;
    const ratio = canvasInnerW / canvasInnerH;

    if (initialGlobalCanvasInfo) {
      setFullCanvasSize(initialGlobalCanvasInfo.FullCanvasSize);
      setScale((1 / Scale) * initialGlobalCanvasInfo.Scale);
      setCanvasWindowOptions(initialGlobalCanvasInfo.CanvasWindowOptions);
      setCanvasHtmlOptions(initialGlobalCanvasInfo.CanvasHtmlOptions);
    } else {
      setFullCanvasSize(DEFAULT_CANVAS_SIZE);
      setScale(1 / Scale);

      let min = this.nodesManager.nodes?.[0]?.realPosition || {x: DEFAULT_CANVAS_SIZE.width / 2, y: DEFAULT_CANVAS_SIZE.height / 2};
      let max = this.nodesManager.nodes?.[0]?.realPosition || {x: DEFAULT_CANVAS_SIZE.width / 2, y: DEFAULT_CANVAS_SIZE.height / 2};

      this.nodesManager.nodes.forEach((node) => {
        if (node.realPosition.x < min.x || node.realPosition.y < min.y) min = node.realPosition;
        if (node.realPosition.x > max.x || node.realPosition.y > max.y) max = node.realPosition;
      });

      const min2 = {x: min.x - ratio * 500, y: min.y - 500};
      const max2 = {x: max.x + ratio * 500, y: max.y + 500};
      const widthDist = max2.x - min2.x;
      const heightDist = max2.y - min2.y;

      setCanvasWindowOptions({
        width: canvasInnerW,
        height: canvasInnerH,
        min: {x: min2.x + widthDist / 2 - canvasInnerW / 2, y: min2.y + heightDist / 2 - canvasInnerH / 2},
        max: {x: min2.x + widthDist / 2 + canvasInnerW / 2, y: min2.y + heightDist / 2 + canvasInnerH / 2},
      });
      setCanvasHtmlOptions({width: canvasInnerW, height: canvasInnerH});
    }

    this.canvasRenderer.draw();

    if (canvasTemp) {
      canvasTemp.onmousedown = (e) => {
        this.canvasController.handleMouseDown(e);
      };

      canvasTemp.onmousemove = (e) => {
        this.canvasController.handleMouseMove(e);
      };

      canvasTemp.onmouseup = () => {
        this.canvasController.handleMouseUp();
      };

      canvasTemp.onmouseleave = () => {
        this.canvasController.handleMouseLeave();
      };

      canvasTemp.onwheel = (e) => {
        this.canvasController.handleWheel(e);
      };

      canvasTemp.onclick = (e) => {
        this.canvasController.handleClick(e, reactStore);
      };

      window.onresize = () => {
        this.canvasController.handleResize();
      };

      window.onbeforeunload = this.sync.bind(this);
    }
  }

  sync() {
    this.reactStore.saveCanvasNodes(
      this.nodesManager.nodes.map((el) => {
        const {tagName, zIndex, type, realPosition, id, elementType, realSize, navigateLink} = el;

        return {tagName, zIndex, type, position: realPosition, id, elementType, size: realSize, navigateLink};
      }),
    );

    this.reactStore.saveGlobalCanvasInfo({
      CanvasHtmlOptions,
      CanvasWindowOptions,
      FullCanvasSize,
      Scale,
    });
  }
}
