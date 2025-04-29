import {NodeType} from '@/shared/enums';

import {CanvasNode} from '../CanvasNode';
import {CreateCanvasNode} from '../CanvasNode.types';

export class HtmlCanvasNode extends CanvasNode {
  public type = NodeType.htmlElement;
  public tagName: keyof HTMLElementTagNameMap;

  constructor(params: CreateCanvasNode & {tagName: keyof HTMLElementTagNameMap}) {
    super(params);

    this.tagName = params.tagName;
  }
}
