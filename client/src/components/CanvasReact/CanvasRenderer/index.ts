import {drawConnectArrow, drawGrid} from '@/shared/lib';

import {CanvasManager} from '../CanvasManager';

/** Класс для отрисовки полотна */
export class CanvasRenderer {
  constructor(
    private manager: CanvasManager,
    public ctx: CanvasRenderingContext2D,
    public ctxBack: CanvasRenderingContext2D,
    public ctxTemp: CanvasRenderingContext2D,
    private canvas: HTMLCanvasElement,
  ) {}

  /** Отрисовка всех фигур и стрелок */
  public draw() {
    const {nodesManager, canvasController} = this.manager;

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
    nodesManager.nodes
      .map((n) => n.arrows)
      .flat()
      .forEach((arrow) => {
        if (arrow.from.node !== canvasController.movingNode && arrow.to.node !== canvasController.movingNode) {
          drawConnectArrow(this.ctx, arrow.path, arrow === canvasController.hoverItem.current);
        }
      });
  }

  /** Отрисовка перетаскиваемой ноды */
  public drawMovingNode() {
    const {canvasController} = this.manager;

    if (!canvasController.redrawedCanvasAfterMovingNode) {
      canvasController.redrawedCanvasAfterMovingNode = true;
      this.draw();
    }

    this.ctxTemp.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (canvasController.movingNode) {
      canvasController.movingNode.draw(this.ctxTemp);

      this.manager.nodesManager.nodes.forEach((n) =>
        n.arrows.forEach((a) => {
          if (a.to.node === canvasController.movingNode || a.from.node === canvasController.movingNode) {
            drawConnectArrow(this.ctxTemp, a.path);
          }
        }),
      );
    }
  }
}
