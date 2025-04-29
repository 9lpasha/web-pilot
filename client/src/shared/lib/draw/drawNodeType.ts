import {DEFAULT_NODE_SIZE} from '@/shared/constants';
import {Scale} from '@/shared/globalCanvasState';

interface Props {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  height?: number;
  radius?: number;
  text: string | string[];
  color: string;
}

const {topLeftPos} = DEFAULT_NODE_SIZE;

function HexToRgb(hex: string): string {
  // Убираем #, если есть
  hex = hex.replace(/^#/, '');

  // Разбиваем на RGB компоненты
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Преобразуем обратно в HEX
  return `rgba(${r},${g},${b}, 0.8)`;
}

const getMaxString = (text: string[]) => {
  const maxAndIndex = text.reduce((acc, curr, index) => (curr.length > acc[0] ? [curr.length, index] : acc), [0, 0]);
  return text[maxAndIndex[1]];
};

export function drawNodeType({ctx, height = topLeftPos.height * Scale, radius = 4 * Scale, x, y, text, color}: Props) {
  ctx.font = 18 * Scale + 'px Arial';

  const rectHeight = Array.isArray(text) ? height + height * 0.7 * (text.length - 1) : height;
  const padding = 5 * Scale;
  const textMetrics = ctx.measureText(Array.isArray(text) ? getMaxString(text) : text);
  const textWidth = textMetrics.width;
  const rectWidth = textWidth + padding * 2;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + rectWidth - radius, y);
  ctx.quadraticCurveTo(x + rectWidth, y, x + rectWidth, y + radius);
  ctx.lineTo(x + rectWidth, y + rectHeight - radius);
  ctx.quadraticCurveTo(x + rectWidth, y + rectHeight, x + rectWidth - radius, y + rectHeight);
  ctx.lineTo(x + radius, y + rectHeight);
  ctx.quadraticCurveTo(x, y + rectHeight, x, y + rectHeight - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = HexToRgb(color); // Цвет заливки
  ctx.fill();
  ctx.strokeStyle = color; // Цвет обводки
  ctx.lineWidth = 2 * Scale;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff'; // Белый цвет текста
  if (Array.isArray(text)) {
    text.forEach((t, i) => ctx.fillText(t, x + rectWidth / 2, y + 16 * (i + 1) * Scale));
  } else {
    ctx.fillText(text, x + rectWidth / 2, y + 16 * Scale);
  }
}
