import {DEFAULT_NODE_SIZE} from '@/shared/constants';
import {Scale} from '@/shared/globalCanvasState';

interface Props {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  height?: number;
  radius?: number;
  isHovered: boolean;
  text?: string | number | boolean | null;
}

const {topLeftPos} = DEFAULT_NODE_SIZE;

export function drawPropsRect({ctx, height = topLeftPos.height * Scale, radius = 4 * Scale, x, y, isHovered, text}: Props) {
  ctx.font = 20 * Scale + 'px Arial';

  const padding = 5 * Scale;
  const textMetrics = ctx.measureText((text || 'Свойства')?.toString());
  const textWidth = textMetrics.width;
  const rectWidth = textWidth + padding * 2;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + rectWidth - radius, y);
  ctx.quadraticCurveTo(x + rectWidth, y, x + rectWidth, y + radius);
  ctx.lineTo(x + rectWidth, y + height - radius);
  ctx.quadraticCurveTo(x + rectWidth, y + height, x + rectWidth - radius, y + height);
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

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff'; // Белый цвет текста
  ctx.fillText((text || 'Свойства')?.toString(), x + rectWidth / 2, y + 18 * Scale);
}
