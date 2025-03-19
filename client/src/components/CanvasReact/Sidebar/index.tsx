import {useState} from 'react';
import {NodeType, NodeUI} from '../CanvasReact.types';
import {htmlEvents} from './constants';
import {Link} from 'react-router-dom';
import {SIDEBAR_WIDTH} from '../CanvasReact.constants';

interface Props {
  onClickHtmlNode: (node: NodeUI) => void;
  htmlNodes: NodeUI[];
}

export function Sidebar({htmlNodes, onClickHtmlNode}: Props) {
  const [showEvents, setShowEvents] = useState(false);

  return (
    <aside className='h-screen bg-gray-900 text-white p-4 flex flex-col gap-4' style={{minWidth: SIDEBAR_WIDTH}}>
      <div>
        <h3 className='text-lg font-semibold mb-2'>HTML Nodes</h3>
        <div className='space-y-2'>
          {htmlNodes
            .sort((a, b) => +a.id - +b.id)
            .map((node) => (
              <div key={node.id} className='p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600' onClick={() => onClickHtmlNode(node)}>
                {node.name}
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-2 cursor-pointer' onClick={() => setShowEvents(!showEvents)}>
          HTML Events {showEvents ? '▲' : '▼'}
        </h3>

        {showEvents && (
          <div className='space-y-1 text-sm'>
            {htmlEvents.map((event) => (
              <div
                key={event}
                className='p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600'
                onClick={() => onClickHtmlNode({id: event + new Date(), type: NodeType.event, name: event})}
              >
                {event}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-2 cursor-pointer text-blue-400 hover:underline'>
          <Link to='/functions'>Functions →</Link>
        </h3>
      </div>
    </aside>
  );
}
