import {NodeType} from '@/shared/enums';

import {CanvasNode} from '../CanvasNode';
import {CreateCanvasNode} from '../CanvasNode.types';

export class ObjectCanvasNode extends CanvasNode {
  public type = NodeType.object;

  constructor(params: CreateCanvasNode) {
    super(params);
  }
}
