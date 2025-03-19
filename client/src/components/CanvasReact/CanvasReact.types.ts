import {Point} from '@/types';
import {ConnectPoint} from './ConnectPoint';

export enum ActionsState {
  default,
  creatingArrow,
  movingNode,
  movingCanvas,
  scaling,
}

export enum NodeType {
  htmlElement = 'htmlElement',
  style = 'styles',
  event = 'event',
  variable = 'variable',
  function = 'function',
}

export enum ElementType {
  Node,
  ConnectPoint,
  Cross,
}

export interface Arrow {
  from: ConnectPoint;
  to: ConnectPoint;
  path: Point[];
}

export type WithPrevState<T> = {
  prev: T | null;
  current: T | null;
};

export interface NodeUI {
  id: string;
  type: NodeType;
  name?: string;
}
