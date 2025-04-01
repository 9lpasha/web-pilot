import {Button, Tree} from 'antd';
import {DataNode, EventDataNode} from 'antd/es/tree';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useStore} from '@/app/store';
import {SIDEBAR_WIDTH} from '@/shared/constants';
import {NodeType} from '@/shared/enums';
import EntryIcon from '@shared/assets/images/entry.png';
import {NodeUI} from '@shared/types';

import {htmlEvents} from './constants';
import {CreateFunctionModal} from './modal';

interface Props {
  htmlNodes: DataNode[];
  onClickHtmlNode: (node: NodeUI) => void;
  onClickNode: (node: NodeUI) => void;
}

export function MainSidebar({htmlNodes, onClickHtmlNode, onClickNode}: Props) {
  const {functions} = useStore();
  const navigate = useNavigate();

  const [showEvents, setShowEvents] = useState(true);
  const [showModal, setShowModal] = useState(false);

  return (
    <aside className='h-screen bg-gray-900 text-white p-4 flex flex-col gap-4' style={{width: SIDEBAR_WIDTH}}>
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
            onClickHtmlNode({id: info.node.key as string, type: NodeType.htmlElement, name: info.node.title as string | undefined});
          }}
        />
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-2 cursor-pointer' onClick={() => setShowEvents(!showEvents)}>
          HTML события {showEvents ? '▲' : '▼'}
        </h3>

        {showEvents && (
          <div className='space-y-1 text-sm'>
            {htmlEvents.map((event) => (
              <div
                key={event}
                className='p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600'
                onClick={() => onClickNode({id: `${new Date().getTime()}`, type: NodeType.event, name: event})}
              >
                {event}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-lg font-semibold'>Функции</h3>
          <Button type='primary' size='small' onClick={() => setShowModal(true)}>
            Добавить
          </Button>
        </div>

        {functions.length > 0 ? (
          <div className='space-y-1 text-sm'>
            {functions.map((func, index) => (
              <div
                key={index}
                className='p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 relative'
                onClick={() =>
                  onClickNode({
                    id: `${new Date().getTime()}`,
                    navigateLink: '/functions/' + func.id,
                    type: NodeType.function,
                    name: func.name,
                  })
                }
              >
                {func.name}
                <img
                  src={EntryIcon}
                  alt='open'
                  className='absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 hover:scale-110'
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/functions/' + func.id);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-400 text-sm'>Функции отсутствуют</p>
        )}

        {showModal && <CreateFunctionModal onClose={() => setShowModal(false)} />}
      </div>
    </aside>
  );
}
