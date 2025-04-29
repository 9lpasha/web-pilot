import {NodeType} from '@/shared/enums';
import {Point, Sizes} from '@/shared/types';

import {CanvasManager} from '../CanvasManager';
import {BrowserApiFunctionCanvasNode} from './BrowserApiFunctionCanvasNode';
import {BrowserApiObjectCanvasNode} from './BrowserApiObjectCanvasNode';
import {EventCanvasNode} from './EventCanvasNode';
import {FunctionCanvasNode} from './FunctionCanvasNode';
import {HtmlCanvasNode} from './HtmlCanvasNode';
import {ObjectCanvasNode} from './ObjectCanvasNode';
import {OperatorCanvasNode} from './OperatorCanvasNode';
import {VariableCanvasNode} from './VariableCanvasNode';

export type AnyCanvasNode =
  | HtmlCanvasNode
  | FunctionCanvasNode
  | VariableCanvasNode
  | EventCanvasNode
  | ObjectCanvasNode
  | OperatorCanvasNode
  | BrowserApiFunctionCanvasNode
  | BrowserApiObjectCanvasNode;

export type AnyFunctionCanvasNode =
  | VariableCanvasNode
  | OperatorCanvasNode
  | BrowserApiFunctionCanvasNode
  | BrowserApiObjectCanvasNode
  | FunctionCanvasNode;

export interface CreateCanvasNode {
  position: Point;
  size: Sizes;
  manager: CanvasManager;
  zIndex: number;
  id: string;
  name: string;
  type: NodeType;
}
