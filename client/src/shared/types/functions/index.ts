import {CanvasNodeStore} from '../store';

export interface FunctionNode {
  id: string;
  name: string;
  nodes: CanvasNodeStore[];
}
