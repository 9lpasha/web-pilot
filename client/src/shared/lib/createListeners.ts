import {CanvasNodeStore, FunctionStore} from '../types';
import {buildDirectionalLinks} from './buildDirectionalLinks';
import {generateJs} from './generateJs';

type ConnectedSides = {
  node: CanvasNodeStore;
  top: ConnectedSides[];
  bottom: ConnectedSides[];
  left: ConnectedSides[];
  right: ConnectedSides[];
};

export const createListeners = (nodes: CanvasNodeStore[], functionsStore: Record<string, FunctionStore>, shadowRoot: ShadowRoot) => {
  const links = buildDirectionalLinks(nodes);
  const first = Object.values(links)
    .filter((l) => !l.left.length && !l.top.length)
    .sort((a, b) => a.node.position.y - b.node.position.y)[0]!;
  let current: ConnectedSides | null = first;

  const node = shadowRoot.getElementById(current.node.id);
  current = current.right[0];

  const eventName = current.node.name.toLocaleLowerCase();
  current = current.right[0] || current.bottom[0];

  const functionNode = current.node;
  const func = functionsStore[functionNode?.navigateLink?.match(/\d+/g)?.[0] || ''];

  if (node)
    node![eventName as 'onclick'] = () => {
      eval(generateJs(func.variables, func.nodes, functionsStore));
    };
};
