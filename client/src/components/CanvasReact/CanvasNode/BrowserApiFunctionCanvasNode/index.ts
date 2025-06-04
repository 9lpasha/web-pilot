import {NodeType} from '@/shared/enums';

import {CanvasNode} from '../CanvasNode';
import {CreateCanvasNode} from '../CanvasNode.types';

export class BrowserApiFunctionCanvasNode extends CanvasNode {
  public type = NodeType.browserApiFunction;
  public args: number;

  constructor(params: CreateCanvasNode & {args: number}) {
    super(params);

    this.args = params.args;
  }
}
