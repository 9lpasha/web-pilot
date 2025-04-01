import {DataNode} from 'antd/es/tree';

export const findNodeByKey = (data: DataNode[], targetKey: string): DataNode | null => {
  for (const node of data) {
    if (node.key === targetKey) {
      return node;
    }
    if (node.children?.length) {
      const found = findNodeByKey(node.children, targetKey);
      if (found) return found;
    }
  }
  return null;
};
