import {Button, Tree} from 'antd';
import {DataNode, EventDataNode} from 'antd/es/tree';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {SIDEBAR_WIDTH} from '@/shared/constants';
import {NodeType} from '@/shared/enums';
import {SidebarFunctions} from '@/widgets/SidebarFunctions';
import {NodeUI} from '@shared/types';

import {htmlEvents} from './constants';

interface Props {
  htmlNodes: DataNode[];
  onClickHtmlNode: (node: NodeUI) => void;
  onClickEvent: (node: NodeUI) => void;
  onClickFunction: (node: NodeUI & {navigateLink: string}) => void;
}

export function MainSidebar({htmlNodes, onClickHtmlNode, onClickEvent, onClickFunction}: Props) {
  const navigate = useNavigate();

  const [showEvents, setShowEvents] = useState<boolean>(() => {
    const value = localStorage.getItem('showEvents');

    return value ? JSON.parse(value) : false;
  });

  useEffect(() => {
    localStorage.setItem('showEvents', JSON.stringify(showEvents));
  }, [showEvents]);

  return (
    <aside className='h-screen bg-gray-900 text-white flex flex-col gap-4 relative' style={{width: SIDEBAR_WIDTH}}>
      <div className='h-[calc(100%-64px)] overflow-auto flex flex-col gap-4 p-4'>
        <div>
          <h3 className='text-lg font-semibold mb-2'>HTML элементы</h3>

          <Tree
            treeData={htmlNodes}
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
              onClickHtmlNode({id: info.node.key as string, type: NodeType.htmlElement, name: info.node.title as string});
            }}
          />
        </div>

        <div>
          <h3 className='text-lg font-semibold cursor-pointer w-fit' onClick={() => setShowEvents(!showEvents)}>
            HTML события {showEvents ? '▲' : '▼'}
          </h3>

          {showEvents && (
            <div className='space-y-1 text-sm mt-2'>
              {htmlEvents.map((event) => (
                <div
                  key={event}
                  className='p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600'
                  onClick={() => onClickEvent({id: `${new Date().getTime()}`, type: NodeType.event, name: event})}
                >
                  {event}
                </div>
              ))}
            </div>
          )}
        </div>

        <SidebarFunctions onClickFunction={onClickFunction} />
      </div>

      <Button type='primary' className='absolute! left-4 bottom-4 w-[calc(100%-32px)]' onClick={() => navigate('/application')}>
        Предпросмотр
      </Button>
    </aside>
  );
}
