import {ArrowManager} from '../ArrowManager';
import {CanvasController} from '../CanvasController';
import {DEFAULT_CANVAS_SIZE} from '../CanvasReact.constants';
import {SCALE, setCanvasHtmlOptions, setCanvasWindowOptions, setFullCanvasSize, updateScale} from '../CanvasReact.state';
import {CanvasRenderer} from '../CanvasRenderer';
import {NodesManager} from '../NodesManager';

/** Главный класс полотна */
export class CanvasManager {
  /** управляет работой со стрелками */
  public arrowManager: ArrowManager;
  /** управляет работой со нодами */
  public nodesManager: NodesManager;
  /** рисует */
  public canvasRenderer: CanvasRenderer;
  /** управляет пользовательскими действиями */
  public canvasController: CanvasController;

  constructor(canvas: HTMLCanvasElement, canvasBack: HTMLCanvasElement, canvasTemp: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!;
    const ctxBack = canvasBack.getContext('2d')!;
    const ctxTemp = canvasTemp.getContext('2d')!;
    this.canvasRenderer = new CanvasRenderer(this, ctx, ctxBack, canvas, ctxTemp);

    this.nodesManager = new NodesManager(this, []);

    this.canvasController = new CanvasController(this);

    this.arrowManager = new ArrowManager(this);

    const canvasInnerW = window.innerWidth - 150;
    const canvasInnerH = window.innerHeight;
    const ratio = canvasInnerW / canvasInnerH;

    setFullCanvasSize(DEFAULT_CANVAS_SIZE);
    updateScale(1 / SCALE);

    let min = this.nodesManager.nodes?.[0]?.position || {x: DEFAULT_CANVAS_SIZE.width / 2, y: DEFAULT_CANVAS_SIZE.height / 2};
    let max = this.nodesManager.nodes?.[0]?.position || {x: DEFAULT_CANVAS_SIZE.width / 2, y: DEFAULT_CANVAS_SIZE.height / 2};

    this.nodesManager.nodes.forEach((node) => {
      if (node.position.x < min.x || node.position.y < min.y) min = node.position;
      if (node.position.x > max.x || node.position.y > max.y) max = node.position;
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

      window.onresize = () => {
        this.canvasController.handleResize();
      };
    }
  }
}
