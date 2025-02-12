import {drawConnectArrow, drawGrid} from '@/helpers';
import {CanvasManager} from '../CanvasManager';

/** Класс для отрисовки полотна */
export class CanvasRenderer {
  constructor(
    private manager: CanvasManager,
    private ctx: CanvasRenderingContext2D,
    private ctxBack: CanvasRenderingContext2D,
    private canvas: HTMLCanvasElement,
    public ctxTemp: CanvasRenderingContext2D,
  ) {}

  /** Отрисовка всех фигур и стрелок */
  public draw() {
    const {nodesManager, canvasController, arrowManager} = this.manager;

    // Очищаем canvas перед отрисовкой
    if (canvasController.isChangedSizePosition) {
      this.ctxBack.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctxTemp.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Отрисовка сетки
    if (canvasController.isChangedSizePosition) {
      drawGrid(this.ctxBack, this.canvas.width, this.canvas.height);
      canvasController.isChangedSizePosition = false;
    }

    // Отрисовка всех фигур
    nodesManager.nodes.forEach((node) => {
      if (node !== canvasController.movingNode) node.draw(this.ctx);
    });

    // Отрисовка стрелок
    arrowManager.arrows.forEach((arrow) => {
      if (arrow.from.node !== canvasController.movingNode && arrow.to.node !== canvasController.movingNode)
        drawConnectArrow(this.ctx, arrow.path);
    });
  }

  /** Отрисовка перетаскиваемой ноды */
  public drawMovingNode() {
    const {canvasController, arrowManager} = this.manager;

    if (!canvasController.redrawedCanvasAfterMovingNode) {
      canvasController.redrawedCanvasAfterMovingNode = true;
      this.draw();
    }

    this.ctxTemp.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (canvasController.movingNode) {
      canvasController.movingNode.draw(this.ctxTemp);

      const arrows = arrowManager.arrows.filter(
        (arrow) => arrow.from.node === canvasController.movingNode || arrow.to.node === canvasController.movingNode,
      );

      arrows.forEach((arrow) => {
        drawConnectArrow(this.ctxTemp, arrow.path);
      });
    }
  }
}
