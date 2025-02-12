interface TextParams {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  fillColor: string;
  font: number;
  textAlign: CanvasTextAlign;
  text: string;
}

/** Рисование текста */
export const drawText = ({ctx, x, y, fillColor, font, textAlign, text}: TextParams) => {
  ctx.font = font + 'px Arial';
  ctx.fillStyle = fillColor;
  ctx.textAlign = textAlign;
  ctx.fillText(text, x, y);
};
