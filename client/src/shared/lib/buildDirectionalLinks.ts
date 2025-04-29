import {CanvasNodeStore} from '../types';

type ConnectedSides = {
  node: CanvasNodeStore;
  top: ConnectedSides[];
  bottom: ConnectedSides[];
  left: ConnectedSides[];
  right: ConnectedSides[];
};

export function buildDirectionalLinks(nodes: CanvasNodeStore[]): Record<string, ConnectedSides> {
  const map: Record<string, ConnectedSides> = {};

  // Инициализируем каждую ноду с пустыми массивами направлений
  for (const node of nodes) {
    map[node.id] = {
      node,
      top: [],
      bottom: [],
      left: [],
      right: [],
    };
  }

  // Пройтись по стрелкам и распределить по направлениям
  for (const node of Object.values(map)) {
    for (const arrow of node.node.arrows) {
      const fromNode = map[arrow.from.nodeId];
      const toNode = map[arrow.to.nodeId];

      const fromEntry = map[fromNode.node.id];
      const toEntry = map[toNode.node.id];

      if (fromEntry && toEntry) {
        fromEntry[arrow.from.side].push(toNode);
        toEntry[arrow.to.side].push(fromNode);
      }
    }
  }

  return map;
}
