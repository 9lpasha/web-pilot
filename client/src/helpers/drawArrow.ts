interface ArrowParams {
  ctx: CanvasRenderingContext2D;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  arrowHeight: number;
  arrowWidth: number;
  color?: string;
}

/** Рисование стрелки */
export const drawArrow = ({ctx, startX, startY, endX, endY, arrowWidth, arrowHeight, color = 'black'}: ArrowParams) => {
  // Настройка цвета заливки и обводки
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = arrowWidth;

  // Рисуем основную линию стрелки
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Вычисляем угол наклона стрелки
  const angle = Math.atan2(endY - startY, endX - startX);
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

interface HoverArrowsParams {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Рисование 4 стрелок при наведении */
export const drawHoverArrows = ({ctx, x, y, width, height}: HoverArrowsParams) => {
  const arrowWidth = 3;
  const arrowHeight = 12;
  const color = 'lightblue';

  const arrows = [
    {startX: x + width / 2, startY: y, endX: x + width / 2, endY: y - 20}, // Вверх
    {startX: x + width, startY: y + height / 2, endX: x + width + 20, endY: y + height / 2}, // Вправо
    {startX: x + width / 2, startY: y + height, endX: x + width / 2, endY: y + height + 20}, // Вниз
    {startX: x, startY: y + height / 2, endX: x - 20, endY: y + height / 2}, // Влево
  ];

  arrows.forEach(({startX, startY, endX, endY}) => {
    drawArrow({ctx, startX, startY, endX, endY, arrowWidth, arrowHeight, color});
  });
};
