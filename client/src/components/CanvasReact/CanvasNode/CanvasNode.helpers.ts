import {NodeType} from '@/shared/enums';

import {BrowserApiFunctionCanvasNode} from './BrowserApiFunctionCanvasNode';
import {CanvasNode} from './CanvasNode';
import {AnyCanvasNode} from './CanvasNode.types';
import {FunctionCanvasNode} from './FunctionCanvasNode';
import {HtmlCanvasNode} from './HtmlCanvasNode';
import {VariableCanvasNode} from './VariableCanvasNode';

export const isFunctionCanvasNode = (node: CanvasNode): node is FunctionCanvasNode => {
  return 'navigateLink' in node;
};

export const isBrowserApiFunctionCanvasNode = (node: CanvasNode): node is BrowserApiFunctionCanvasNode => {
  return 'args' in node;
};

export const isVariableCanvasNode = (node: CanvasNode): node is VariableCanvasNode => {
  return 'dataType' in node;
};

export const isHtmlCanvasNode = (node: CanvasNode): node is HtmlCanvasNode => {
  return 'tagName' in node;
};

export const getTextNode = (node: CanvasNode) => {
  if (isHtmlCanvasNode(node)) return node.tagName;

  return node.name;
};

export const toAnyCanvasNode = (node: CanvasNode): AnyCanvasNode => {
  return node as AnyCanvasNode;
};

export const getNodeType = (type: NodeType) => {
  switch (type) {
    case NodeType.browserApiFunction:
      return ['Browser', 'Function'];

    case NodeType.browserApiObject:
      return ['Browser', 'Object'];

    case NodeType.event:
      return 'Event';

    case NodeType.function:
      return 'Function';

    case NodeType.htmlElement:
      return 'Html';

    case NodeType.object:
      return 'Object';

    case NodeType.operator:
      return 'Operator';

    case NodeType.variable:
      return 'Variable';
  }
};

export const getNodeTypeColor = (type: NodeType) => {
  switch (type) {
    case NodeType.browserApiFunction:
      return '#C0C0C0';

    case NodeType.browserApiObject:
      return '#808080';

    case NodeType.event:
      return '#000000';

    case NodeType.function:
      return '#FF5500';

    case NodeType.htmlElement:
      return '#45818e';

    case NodeType.object:
      return '#008000';

    case NodeType.operator:
      return '#009922';

    case NodeType.variable:
      return '#2980b9';
  }
};
