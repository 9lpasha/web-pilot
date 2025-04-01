import {CANVAS_QUADRO_SIZE} from '@shared/constants';
import {CanvasWindowOptions, Scale} from '@shared/globalCanvasState';

/** Рисование фоновой сетки */
export const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.lineWidth = 0.1;

  // Если scale слишком мал, то увеличиваем размер квадратов фоновой сетки
  const sizes = [
    [0.5, CANVAS_QUADRO_SIZE * 2],
    [0.2, CANVAS_QUADRO_SIZE * 5],
    [0.1, CANVAS_QUADRO_SIZE * 10],
    [0.05, CANVAS_QUADRO_SIZE * 20],
  ];
  const quadroSize = sizes.reduce((acc, curr) => (curr[0] > Scale ? curr[1] : acc), CANVAS_QUADRO_SIZE);

  const left = (Math.ceil(CanvasWindowOptions.min.x / quadroSize) * quadroSize - CanvasWindowOptions.min.x) * Scale;
  const top = (Math.ceil(CanvasWindowOptions.min.y / quadroSize) * quadroSize - CanvasWindowOptions.min.y) * Scale;

  // Рисуем вертикальные линии
  for (let x = left; x <= width; x += quadroSize * Scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Рисуем горизонтальные линии
  for (let y = top; y <= height; y += quadroSize * Scale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};
