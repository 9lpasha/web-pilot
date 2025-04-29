import {Point} from '@/shared/types';
import {CanvasWindowOptions, Scale} from '@shared/globalCanvasState';

/** Перерисование стрелки уже созданной */
export const drawConnectArrow = (ctx: CanvasRenderingContext2D, path: Point[], isHover = false) => {
  const arrowHeight = 12 * Scale;
  const startX = (path[0].x - CanvasWindowOptions.min.x) * Scale;
  const startY = (path[0].y - CanvasWindowOptions.min.y) * Scale;
  const endX = (path[path.length - 1].x - CanvasWindowOptions.min.x) * Scale;
  const endY = (path[path.length - 1].y - CanvasWindowOptions.min.y) * Scale;

  // Настройка цвета заливки и обводки
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3 * Scale;

  // Рисуем основную линию стрелки
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  for (const {x, y} of path) {
    ctx.lineTo((x - CanvasWindowOptions.min.x) * Scale, (y - CanvasWindowOptions.min.y) * Scale);
  }
  ctx.stroke();

  // Обводка под основную линию для hover эффекта
  if (isHover) {
    ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
    ctx.lineWidth = 7 * Scale;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for (const {x, y} of path) {
      ctx.lineTo((x - CanvasWindowOptions.min.x) * Scale, (y - CanvasWindowOptions.min.y) * Scale);
    }
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

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3 * Scale;

  // Рисуем наконечник стрелки в виде треугольника
  ctx.beginPath();
  ctx.moveTo(arrowHeadX, arrowHeadY);
  ctx.lineTo(arrowPoint1X, arrowPoint1Y);
  ctx.lineTo(arrowPoint2X, arrowPoint2Y);
  ctx.closePath();
  ctx.fill();
};
