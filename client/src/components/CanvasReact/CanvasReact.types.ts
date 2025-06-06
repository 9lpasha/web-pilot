import {AppStore} from '@/app/store/types';

import {CanvasNode} from './CanvasNode';

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
  Arrow,
}

export type WithPrevState<T> = {
  prev: T | null;
  current: T | null;
};

export interface ReactStoreForCanvas {
  navigate?: (route: string) => void;
  returnNode?: (node: CanvasNode) => void;
  openModal?: () => void;
  saveCanvasNodes: AppStore['saveCanvasNodes'];
  saveGlobalCanvasInfo: AppStore['saveGlobalCanvasInfo'];
}
