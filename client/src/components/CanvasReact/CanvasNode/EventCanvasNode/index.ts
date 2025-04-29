import {NodeType} from '@/shared/enums';

import {CanvasNode} from '../CanvasNode';
import {CreateCanvasNode} from '../CanvasNode.types';

export class EventCanvasNode extends CanvasNode {
  public type = NodeType.event;

  constructor(params: CreateCanvasNode) {
    super(params);
  }
}
