import {Scale} from '@/shared/globalCanvasState';

interface Props {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  isHovered: boolean;
}

export function drawPropsRect({ctx, height = 25 * Scale, radius = 4 * Scale, width = 100 * Scale, x, y, isHovered}: Props) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = isHovered ? '#5faee3' : '#3498db'; // Цвет заливки
  ctx.fill();
  ctx.strokeStyle = '#2980b9'; // Цвет обводки
  ctx.lineWidth = 2 * Scale;
  ctx.stroke();

  // Надпись "Свойства"
  ctx.fillStyle = '#fff'; // Белый цвет текста
  ctx.font = 20 * Scale + 'px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Свойства', x + width / 2, y + 18 * Scale);
}
