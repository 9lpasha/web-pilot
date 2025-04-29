import {NodeType, VariableType} from '@/shared/enums';

export interface VariableStore {
  value: string | number | boolean | null;
  dataType: VariableType;
  type: NodeType;
  variableType: string;
  id: string;
  name: string;
}
