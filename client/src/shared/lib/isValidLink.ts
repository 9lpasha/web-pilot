import {AnyCanvasNode} from '@/components/CanvasReact/CanvasNode';

import {NodeType} from '../enums';

export const isValidLink = (from: AnyCanvasNode, to: AnyCanvasNode) => {
  if (to.type === NodeType.htmlElement) return false;
  if (from.type !== NodeType.htmlElement && to.type === NodeType.event) return false;
  if (from.type === NodeType.htmlElement && to.type === NodeType.function) return false;

  if (to.arrows.find((a) => a.to.node === from)) return false;

  // TODO
  // if (to.arrows.length || from.arrows.length) return false;

  return true;
};
