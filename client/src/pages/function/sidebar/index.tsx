import {Button} from 'antd';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {SIDEBAR_WIDTH} from '@/shared/constants';
import {NodeType} from '@/shared/enums';
import {ArrowLeftOutlined} from '@ant-design/icons';
import {NodeUI} from '@shared/types';

import {operators} from './constants';

interface Props {
  onClickHtmlNode: (node: NodeUI) => void;
}

export function FunctionsSidebar({onClickHtmlNode}: Props) {
  const [showEvents, setShowEvents] = useState(true);
  const navigate = useNavigate();

  return (
    <aside className='h-screen bg-gray-900 text-white p-4 flex flex-col gap-4' style={{width: SIDEBAR_WIDTH}}>
      <Button type='primary' icon={<ArrowLeftOutlined />} className='text-lg flex items-center text-white' onClick={() => navigate(-1)}>
        Назад
      </Button>

      <div>
        <h3 className='text-lg font-semibold mb-2 cursor-pointer' onClick={() => setShowEvents(!showEvents)}>
          Операторы {showEvents ? '▲' : '▼'}
        </h3>

        {showEvents && (
          <div className='space-y-1 text-sm'>
            {operators.map((operator) => (
              <div
                key={operator.name}
                className='p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600'
                onClick={() => onClickHtmlNode({id: `${new Date().getTime()}`, type: NodeType.event, name: operator.name})}
              >
                {operator.name} ({operator.description})
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
