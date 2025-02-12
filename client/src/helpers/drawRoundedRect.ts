import {DEFAULT_NODE_SIZE} from '../components/CanvasReact/CanvasReact.constants';
import {SCALE} from '../components/CanvasReact/CanvasReact.state';

interface RoundedRectParams {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  fillColor?: string;
  strokeColor?: string;
}

/** Отрисовка прямоугольника с закругленными углами */
export const drawRoundedRect = ({
  ctx,
  x,
  y,
  height = DEFAULT_NODE_SIZE.height,
  width = DEFAULT_NODE_SIZE.width,
  radius = DEFAULT_NODE_SIZE.radius,
  fillColor = 'white',
  strokeColor = 'black',
}: RoundedRectParams) => {
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
  ctx.fillStyle = fillColor;
  ctx.fill();

  ctx.lineWidth = 3 * SCALE;
  ctx.strokeStyle = strokeColor;
  ctx.stroke();
};
