import {AppStore} from '@/app/store/types';
import {Point} from '@/shared/types';

import {CanvasNode} from './CanvasNode';
import {ConnectPoint} from './ConnectPoint';

export enum ActionsState {
  default,
  creatingArrow,
  movingNode,
  movingCanvas,
  scaling,
}

export enum ElementType {
  Node,
  ConnectPoint,
  Cross,
  NodePropsButton,
  FunctionLink,
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

export interface ReactStoreForCanvas {
  navigate: (route: string) => void;
  returnNode: (node: CanvasNode) => void;
  openModal: () => void;
  saveCanvasNodes: AppStore['saveCanvasNodes'];
  saveGlobalCanvasInfo: AppStore['saveGlobalCanvasInfo'];
}
