import {NodeType} from '../enums';
import {CanvasNodeStore} from '../types';

export const getStringFromNode = (node: CanvasNodeStore, functionStack: number[]) => {
  if (node.type === NodeType.function) {
    return node.name + '(); ';
  } else if (node.type === NodeType.browserApiFunction) {
    functionStack.push(node.args || 0);
    return node.name + '(';
  } else return node.name + ' ';
};
