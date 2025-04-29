import {NodeType} from '@/shared/enums';

import {CanvasNode} from '../CanvasNode';
import {CreateCanvasNode} from '../CanvasNode.types';

export class BrowserApiFunctionCanvasNode extends CanvasNode {
  public type = NodeType.browserApiFunction;

  constructor(params: CreateCanvasNode) {
    super(params);
  }
}
