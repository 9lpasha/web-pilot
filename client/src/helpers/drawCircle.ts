interface CircleParams {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  fillColor: string;
  strokeColor: string;
}

/** Рисование круга */
export const drawCircle = ({ctx, x, y, radius, fillColor, strokeColor}: CircleParams) => {
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
};
