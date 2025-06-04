// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: типизировать

import {CanvasNodeStore, VariableStore} from '../types';
import {buildDirectionalLinks} from './buildDirectionalLinks';
import {NodeType} from '../enums';
import {getStringFromNode} from './getStringFromNode';

type ConnectedSides = {
  node: CanvasNodeStore;
  top: ConnectedSides[];
  bottom: ConnectedSides[];
  left: ConnectedSides[];
  right: ConnectedSides[];
};

const stepFunctionStack = (functionStack: number[], result: string) => {
  if (!functionStack.length) return result;

  if (functionStack[functionStack.length - 1] === 0) {
    functionStack.length = functionStack.length - 1;
    result += ') ';
  } else {
    functionStack[functionStack.length - 1] -= 1;
  }

  return result;
};

export const generateJs = (variables: VariableStore[], nodes: CanvasNodeStore[], functionsStore: Record<string, FunctionStore>) => {
  const links = buildDirectionalLinks(nodes);
  const first = Object.values(links).find((l) => !l.left.length && !l.top.length)!;
  const functionStack: number[] = [];
  let current: ConnectedSides | null = first;
  let result = '';
  const functions: Record<string, string> = {};

  nodes
    .filter((n) => n.type === NodeType.function)
    .forEach((n) => {
      if (functions[n.id]) return;

      functions[n.id] = n.name;

      const funcId = n?.navigateLink?.match(/\d+/g)?.[0] || '';

      result += `function ${n.name}() {
  ${generateJs(functionsStore[funcId].variables, functionsStore[funcId].nodes, functionsStore)}
}
`;
    });

  variables.forEach((v) => {
    result += `${v.variableType || ''} ${v.name} = ${(v.value || '').toString()};
`;
  });

  while (current) {
    // ОБРАБОТКА IF
    if (current && current.node.type === NodeType.operator && current.node.name === 'if') {
      const nodeIf: ConnectedSides | null = current;
      let condition = '';
      let blockMain = '';
      let blockElse = '';

      current = current.right[0];
      while (current) {
        condition += getStringFromNode(current.node, functionStack);
        condition = stepFunctionStack(functionStack, condition);
        if (current.right.length) current = current.right[0];
        else current = null;
      }

      const bottoms = nodeIf.bottom.sort((a, b) => a.node.position.y - b.node.position.y);
      current = bottoms[0];
      while (current) {
        blockMain += getStringFromNode(current.node, functionStack);
        blockMain = stepFunctionStack(functionStack, blockMain);
        if (current.right.length) current = current.right[0];
        else current = null;
      }

      current = bottoms[1];
      while (current) {
        blockElse += getStringFromNode(current.node, functionStack);
        blockElse = stepFunctionStack(functionStack, blockElse);
        if (current.right.length) current = current.right[0];
        else current = null;
      }

      current = bottoms[2];
      result += `
if (${condition}) {
  ${blockMain};
} else {
  ${blockElse};
}

      `;
      continue;
    }

    // ОБРАБОТКА WHILE
    if (current && current.node.type === NodeType.operator && current.node.name === 'while') {
      const nodeWhile: ConnectedSides | null = current;
      let condition = '';
      let blockMain = '';

      current = current.right[0];
      while (current) {
        condition += getStringFromNode(current.node, functionStack);
        condition = stepFunctionStack(functionStack, condition);
        if (current.right.length) current = current.right[0];
        else current = null;
      }

      const bottoms = nodeWhile.bottom.sort((a, b) => a.node.position.y - b.node.position.y);
      current = bottoms[0];
      while (current) {
        blockMain += getStringFromNode(current.node, functionStack);
        blockMain = stepFunctionStack(functionStack, blockMain);
        if (current.right.length) current = current.right[0];
        else current = null;
      }

      current = bottoms[1];
      result += `
while (${condition}) {
  ${blockMain}
}

      `;
      continue;
    }

    // ОБРАБОТКА FOR
    if (current && current.node.type === NodeType.operator && current.node.name === 'for') {
      const nodeFor: ConnectedSides | null = current;
      let condition1 = '';
      let condition2 = '';
      let condition3 = '';
      let blockMain = '';
      const rights = nodeFor?.right.sort((a, b) => a.node.position.y - b.node.position.y);

      current = rights[0];
      while (current) {
        condition1 += getStringFromNode(current.node, functionStack);
        condition1 = stepFunctionStack(functionStack, condition1);
        if (current.right.length) current = current.right[0];
        else current = null;
      }
      current = rights[1];
      while (current) {
        condition2 += getStringFromNode(current.node, functionStack);
        condition2 = stepFunctionStack(functionStack, condition2);
        if (current.right.length) current = current.right[0];
        else current = null;
      }
      current = rights[2];
      while (current) {
        condition3 += getStringFromNode(current.node, functionStack);
        condition3 = stepFunctionStack(functionStack, condition3);
        if (current.right.length) current = current.right[0];
        else current = null;
      }

      const bottoms = nodeFor.bottom.sort((a, b) => a.node.position.y - b.node.position.y);
      current = bottoms[0];
      while (current) {
        blockMain += getStringFromNode(current.node, functionStack);
        blockMain = stepFunctionStack(functionStack, blockMain);
        if (current.right.length) current = current.right[0];
        else current = null;
      }

      current = bottoms[1];
      result += `
for (${condition1}; ${condition2}; ${condition3}) {
  ${blockMain}
}

      `;
      continue;
    }

    result += getStringFromNode(current.node, functionStack);
    result = stepFunctionStack(functionStack, result);
    if (current.right.length) current = current.right[0];
    else current = null;
  }

  return result;
};
