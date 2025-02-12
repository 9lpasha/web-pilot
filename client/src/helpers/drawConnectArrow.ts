import {CANVAS_WINDOW_OPTIONS, SCALE} from '@/components/CanvasReact/CanvasReact.state';
import {Point} from '@/types';

/** Перерисование стрелки уже созданной */
export const drawConnectArrow = (ctx: CanvasRenderingContext2D, path: Point[]) => {
  const arrowHeight = 12 * SCALE;
  const startX = (path[0].x - CANVAS_WINDOW_OPTIONS.min.x) * SCALE;
  const startY = (path[0].y - CANVAS_WINDOW_OPTIONS.min.y) * SCALE;
  const endX = (path[path.length - 1].x - CANVAS_WINDOW_OPTIONS.min.x) * SCALE;
  const endY = (path[path.length - 1].y - CANVAS_WINDOW_OPTIONS.min.y) * SCALE;

  // Настройка цвета заливки и обводки
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3 * SCALE;

  // Рисуем основную линию стрелки
  ctx.beginPath();
  ctx.moveTo(startX, startY);

  for (const {x, y} of path) {
    ctx.lineTo((x - CANVAS_WINDOW_OPTIONS.min.x) * SCALE, (y - CANVAS_WINDOW_OPTIONS.min.y) * SCALE);
    ctx.stroke();
  }

  // Вычисляем угол наклона стрелки
  const angle = Math.atan2(path[path.length - 1].y - path[path.length - 2].y, path[path.length - 1].x - path[path.length - 2].x);
  const arrowHeadX = endX + (arrowHeight / 3) * Math.cos(angle);
  const arrowHeadY = endY + (arrowHeight / 3) * Math.sin(angle);

  // Координаты для наконечника стрелки
  const arrowPoint1X = arrowHeadX - arrowHeight * Math.cos(angle - Math.PI / 6);
  const arrowPoint1Y = arrowHeadY - arrowHeight * Math.sin(angle - Math.PI / 6);
  const arrowPoint2X = arrowHeadX - arrowHeight * Math.cos(angle + Math.PI / 6);
  const arrowPoint2Y = arrowHeadY - arrowHeight * Math.sin(angle + Math.PI / 6);

  // Рисуем наконечник стрелки в виде треугольника
  ctx.beginPath();
  ctx.moveTo(arrowHeadX, arrowHeadY);
  ctx.lineTo(arrowPoint1X, arrowPoint1Y);
  ctx.lineTo(arrowPoint2X, arrowPoint2Y);
  ctx.closePath();
  ctx.fill();
};
