import {Button} from 'antd';
import {useCallback} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {NodesManager} from '@/components/CanvasReact/NodesManager';
import {SIDEBAR_WIDTH} from '@/shared/constants';
import {generateJs} from '@/shared/lib';
import {SidebarFunctions} from '@/widgets/SidebarFunctions';
import {HomeFilled, ArrowLeftOutlined} from '@ant-design/icons';
import {FunctionStore, NodeUI} from '@shared/types';

import {SidebarBrowserApi} from './browserApi';
import {HtmlNodes} from './htmlNodes';
import {SidebarOperators} from './operators';

interface Props {
  addNode: NodesManager['addNode'] | undefined;
  func: FunctionStore;
}

export function FunctionsSidebar({func, addNode}: Props) {
  const navigate = useNavigate();

  const onClickNode = useCallback((node: NodeUI) => addNode?.(node.type, node.id, node.name), [addNode]);
  const onClickHtmlNode = useCallback(
    (node: NodeUI) => addNode?.(node.type, node.id, node.name, {tagName: node.name as keyof HTMLElementTagNameMap}),
    [addNode],
  );
  const onClickFunction = useCallback(
    (node: NodeUI & {navigateLink: string}) => {
      addNode?.(node.type, node.id, node.name, {navigateLink: node.navigateLink});
    },
    [addNode],
  );

  return (
    <aside className='h-screen bg-gray-900 text-white relative' style={{width: SIDEBAR_WIDTH}}>
      <div className='h-[calc(100%-64px)] overflow-auto flex flex-col gap-4 p-4'>
        <div className='flex gap-4'>
          <Link to='/main'>
            <Button type='primary' icon={<HomeFilled />} className='text-lg flex items-center text-white w-full shrink-0' />
          </Link>

          <Button
            type='primary'
            icon={<ArrowLeftOutlined />}
            className='text-lg flex items-center text-white w-full'
            onClick={() => navigate(-1)}
          >
            Назад
          </Button>
        </div>

        <div>
          <h1 className='text-3xl font-semibold'>Функция</h1>
          <h3 className='text-xl font-normal mb-2'>{func.name}</h3>
        </div>

        <HtmlNodes onClickNode={onClickHtmlNode} />
        <SidebarFunctions onClickFunction={onClickFunction} />

        <SidebarOperators onClickNode={onClickNode} />
        <SidebarBrowserApi onClickNode={onClickNode} />
      </div>

      <Button
        type='primary'
        className='absolute! left-4 bottom-4 w-[calc(100%-32px)]'
        onClick={() => console.log(generateJs(func.variables, func.nodes))}
      >
        Генерация кода
      </Button>
    </aside>
  );
}
