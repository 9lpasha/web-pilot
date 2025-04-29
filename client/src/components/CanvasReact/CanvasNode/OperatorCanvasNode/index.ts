import {NodeType} from '@/shared/enums';

import {CanvasNode} from '../CanvasNode';
import {CreateCanvasNode} from '../CanvasNode.types';

export class OperatorCanvasNode extends CanvasNode {
  public type = NodeType.operator;

  constructor(params: CreateCanvasNode) {
    super(params);
  }
}
