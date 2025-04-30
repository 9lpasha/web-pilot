// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: типизировать

import {CanvasNodeStore, VariableStore} from '../types';
import {buildDirectionalLinks} from './buildDirectionalLinks';
import {NodeType} from '../enums';

type ConnectedSides = {
  node: CanvasNodeStore;
  top: ConnectedSides[];
  bottom: ConnectedSides[];
  left: ConnectedSides[];
  right: ConnectedSides[];
};

type ASTNode =
  | {type: 'Literal'; value: number | string | boolean | null}
  | {type: 'Identifier'; name: string}
  | {type: 'BinaryExpression'; operator: string; left: ASTNode; right: ASTNode}
  | {type: 'VariableDeclaration'; name: string; value: ASTNode}
  | {type: 'ReturnStatement'; value: ASTNode}
  | {type: 'CallExpression'; callee: string; arguments: ASTNode[]};

function buildAST(nodes: Partial<CanvasNodeStore>[]): ASTNode {
  let i = 0;

  function next(): Partial<CanvasNodeStore> | undefined {
    return nodes[i++];
  }

  function peek(): Partial<CanvasNodeStore> | undefined {
    return nodes[i];
  }

  function parseExpression(): ASTNode {
    const node = next();
    if (!node) throw new Error('Unexpected end of input');

    // Variable declaration: let x = 5
    if (node.name === 'let' || node.name === 'const') {
      const kind = node.name; // "let" | "const"
      const idNode = next();
      const eqNode = next();
      if (!idNode || !eqNode || eqNode.name !== '=') {
        throw new Error(`Invalid ${kind} declaration`);
      }

      return {
        type: 'VariableDeclaration',
        kind,
        declarations: [
          {
            type: 'VariableDeclarator',
            id: {type: 'Identifier', name: idNode.name},
            init: parseExpression(),
          },
        ],
      };
    }

    // Assignment: x = 5
    if (node.type === 'variable' || node.type === 'function' || node.type === 'object') {
      const nextNode = peek();
      if (nextNode?.name === '=') {
        next(); // consume '='
        return {
          type: 'AssignmentExpression',
          operator: '=',
          left: {type: 'Identifier', name: node.name},
          right: parseExpression(),
        };
      }

      if (nextNode?.name === 'call') {
        next(); // consume 'call'
        return {
          type: 'CallExpression',
          callee: {type: 'Identifier', name: node.name},
          arguments: [parseExpression()], // simplistic: assumes single arg
        };
      }

      return {type: 'Identifier', name: node.name};
    }

    // Binary operators
    if (node.type === 'operator') {
      if (['+', '-', '==', '&&', '||'].includes(node.name)) {
        return {
          type: 'BinaryExpression',
          operator: node.name,
          left: parseExpression(),
          right: parseExpression(),
        };
      }

      if (node.name === 'return') {
        return {
          type: 'ReturnStatement',
          argument: parseExpression(),
        };
      }

      if (node.name === 'break' || node.name === 'continue') {
        return {
          type: `${node.name[0].toUpperCase()}${node.name.slice(1)}Statement`,
        };
      }

      if (node.name === 'if') {
        return {
          type: 'IfStatement',
          test: parseExpression(),
          consequent: parseExpression(),
          alternate: peek()?.name === 'else' ? (next(), parseExpression()) : null,
        };
      }

      if (node.name === 'while') {
        return {
          type: 'WhileStatement',
          test: parseExpression(),
          body: parseExpression(),
        };
      }

      if (node.name === 'for') {
        return {
          type: 'ForStatement',
          init: parseExpression(),
          test: parseExpression(),
          update: parseExpression(),
          body: parseExpression(),
        };
      }

      if (node.name === 'function') {
        const funcName = next();
        const body = parseExpression();
        return {
          type: 'FunctionDeclaration',
          id: {type: 'Identifier', name: funcName?.name},
          params: [],
          body: {
            type: 'BlockStatement',
            body: [body],
          },
        };
      }
    }

    throw new Error(`Unhandled node: ${JSON.stringify(node)}`);
  }

  const body: ASTNode[] = [];

  while (i < nodes.length) {
    body.push(parseExpression());
  }

  return {
    type: 'Program',
    body,
  };
}

export const generateJs = (variables: VariableStore[], nodes: CanvasNodeStore[]) => {
  const links = buildDirectionalLinks(nodes);
  const first = Object.values(links).find((l) => !l.left.length && !l.top.length)!;
  let current: ConnectedSides | null = first;
  let baseCurrent: ConnectedSides | null = first;
  const tokens = [] as Partial<CanvasNodeStore>[];

  variables.forEach((v) => {
    tokens.push({name: v.variableType || '', type: NodeType.operator, id: v.id + '-1'});
    tokens.push({name: v.name, type: NodeType.variable, id: v.id + '-2'});
    tokens.push({name: '=', type: NodeType.operator, id: v.id + '-3'});
    tokens.push({name: (v.value || '').toString(), type: NodeType.variable, id: v.id + '-4'});
  });

  while (current) {
    tokens.push(current.node);

    if (current.right.length) current = current.right[0];
    else if (baseCurrent.bottom.length) {
      current = baseCurrent.bottom[0];
      baseCurrent = baseCurrent.bottom[0];
    } else current = null;
  }

  const userAst = buildAST(tokens);

  return userAst;
};
