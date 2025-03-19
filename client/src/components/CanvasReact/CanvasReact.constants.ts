import {Sizes} from '@/types';
import {NodeType, NodeUI} from './CanvasReact.types';

export const DEFAULT_CANVAS_SIZE: Sizes = {height: 9000, width: 16000};
export const SIDEBAR_WIDTH = 250;

export const DEFAULT_NODE_SIZE = {
  width: 300,
  height: 150,
  radius: 20,
  lineWidth: 3,
  topCircle: {
    x: 150,
    y: 25,
    radius: 15,
  },
  leftCircle: {
    x: 25,
    y: 75,
    radius: 15,
  },
  rightCircle: {
    x: 275,
    y: 75,
    radius: 15,
  },
  lowerCircle: {
    x: 150,
    y: 125,
    radius: 15,
  },
  topRightPos: {
    x: 275,
    y: 25,
    radius: 15,
  },
  text: {
    x: 150,
    y: 80,
  },
};

/** Радиус точки перетаскивания в ноде */
export const CONNECT_POINT_RADIUS = 15;
/** Длина стороны квадрата фоновой сетки */
export const CANVAS_QUADRO_SIZE = 25;

export enum POINT_COLORS {
  FILL_RED_ALPHA = 'rgba(255, 171, 171, 0.5)',
  FILL_GREEN_ALPHA = 'rgba(100, 240, 100, 0.3)',
  STROKE_RED_ALPHA = 'rgba(255, 0, 0, 0.3)',
  STROKE_GREEN_ALPHA = 'rgba(0, 255, 0, 0.3)',
}

export const fakeNodes: NodeUI[] = [
  {id: '1', type: NodeType.htmlElement, name: 'div'},
  {id: '2', type: NodeType.htmlElement, name: 'button'},
];
