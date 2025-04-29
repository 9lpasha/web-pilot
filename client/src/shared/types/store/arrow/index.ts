import {ConnectSide, Point} from '../../common';

interface ArrowPointStore {
  side: ConnectSide;
  nodeId: string;
}

export interface CanvasArrowStore {
  from: ArrowPointStore;
  to: ArrowPointStore;
  path: Point[];
}
