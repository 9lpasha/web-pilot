import {NodeType} from '@/shared/enums';

export interface NodeUI {
  id: string;
  navigateLink?: string;
  type: NodeType;
  name?: string;
}
