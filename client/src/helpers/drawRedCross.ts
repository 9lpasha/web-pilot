interface CrossParams {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  isHovered: boolean;
}

export function drawRedCross({ctx, x, y, radius, isHovered}: CrossParams) {
  // Рисуем красный круг
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = isHovered ? 'orange' : 'red';
  ctx.fill();
  ctx.closePath();

  // Настройки для крестика
  ctx.strokeStyle = 'white';
  ctx.lineWidth = radius * 0.2;
  const crossSize = radius * 0.6;

  // Рисуем крестик
  ctx.beginPath();
  ctx.moveTo(x - crossSize, y - crossSize);
  ctx.lineTo(x + crossSize, y + crossSize);
  ctx.moveTo(x + crossSize, y - crossSize);
  ctx.lineTo(x - crossSize, y + crossSize);
  ctx.stroke();
  ctx.closePath();
}
