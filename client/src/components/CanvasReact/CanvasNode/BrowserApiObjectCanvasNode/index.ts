import {NodeType} from '@/shared/enums';

import {CanvasNode} from '../CanvasNode';
import {CreateCanvasNode} from '../CanvasNode.types';

export class BrowserApiObjectCanvasNode extends CanvasNode {
  public type = NodeType.browserApiObject;

  constructor(params: CreateCanvasNode) {
    super(params);
  }
}
