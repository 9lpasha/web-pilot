import {NodeType} from '@/shared/enums';

import {Point, Sizes} from '../../common';

export interface CanvasNodeStore {
  position: Point;
  size: Sizes;
  type: NodeType;
  tagName?: keyof HTMLElementTagNameMap;
  zIndex: number;
  id: string;
}
