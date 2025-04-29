import {NodeType, VariableType} from '@/shared/enums';

import {Point, Sizes} from '../../common';
import {CanvasArrowStore} from '../arrow';

export type CanvasNodeStore = {
  position: Point;
  size: Sizes;
  type: NodeType;
  zIndex: number;
  id: string;
  arrows: CanvasArrowStore[];
  name: string;
} & CanvasNodeStoreOptionalFields;

export interface CanvasNodeStoreOptionalFields {
  /** для HTML ноды */
  tagName?: keyof HTMLElementTagNameMap;
  /** для Function ноды */
  navigateLink?: string;
  /** для Variable ноды */
  dataType?: VariableType;
  /** для Variable ноды */
  value?: string | number | boolean | null;
  /** для Variable ноды */
  variableType?: string;
}
