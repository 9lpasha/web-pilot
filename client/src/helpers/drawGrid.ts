import {CANVAS_QUADRO_SIZE} from '@/components/CanvasReact/CanvasReact.constants';
import {CANVAS_WINDOW_OPTIONS, SCALE} from '@/components/CanvasReact/CanvasReact.state';

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
  const quadroSize = sizes.reduce((acc, curr) => (curr[0] > SCALE ? curr[1] : acc), CANVAS_QUADRO_SIZE);

  const left = (Math.ceil(CANVAS_WINDOW_OPTIONS.min.x / quadroSize) * quadroSize - CANVAS_WINDOW_OPTIONS.min.x) * SCALE;
  const top = (Math.ceil(CANVAS_WINDOW_OPTIONS.min.y / quadroSize) * quadroSize - CANVAS_WINDOW_OPTIONS.min.y) * SCALE;

  // Рисуем вертикальные линии
  for (let x = left; x <= width; x += quadroSize * SCALE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Рисуем горизонтальные линии
  for (let y = top; y <= height; y += quadroSize * SCALE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};
