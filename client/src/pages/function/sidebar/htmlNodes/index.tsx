import {Tree} from 'antd';
import {DataNode, EventDataNode} from 'antd/es/tree';
import {useMemo} from 'react';

import {useStore} from '@/app/store';
import {NodeType} from '@/shared/enums';
import {NodeUI} from '@/shared/types';

export const HtmlNodes = ({onClickNode}: {onClickNode: (node: NodeUI) => void}) => {
  const {htmlNodes} = useStore();
  const nodes = useMemo(() => htmlNodes.map((n) => ({...n, disabled: false})), [htmlNodes]);

  return (
    <div>
      <h3 className='text-lg font-semibold w-fit mb-2'>HTML элементы</h3>

      <Tree
        treeData={nodes}
        onSelect={(
          _,
          info: {
            event: 'select';
            selected: boolean;
            node: EventDataNode<DataNode>;
            selectedNodes: DataNode[];
            nativeEvent: MouseEvent;
          },
        ) => {
          onClickNode({id: `${new Date().getTime()}`, type: NodeType.htmlElement, name: info.node.title as string});
        }}
      />
    </div>
  );
};
