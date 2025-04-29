import {CanvasNodeStore} from '..';
import {VariableStore} from '../variable';

export interface FunctionStore {
  id: string;
  name: string;
  nodes: CanvasNodeStore[];
  variables: VariableStore[];
}
