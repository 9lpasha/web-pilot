import {useEffect, useState} from 'react';

import {NodeType} from '@/shared/enums';
import {NodeUI} from '@/shared/types';

import {apiFunctions, apiObjects} from '../constants';

export const SidebarBrowserApi = ({onClickNode}: {onClickNode: (node: NodeUI) => void}) => {
  const [showBrowserApi, setShowBrowserApi] = useState<boolean>(() => {
    const value = localStorage.getItem('showBrowserApi');

    return value ? JSON.parse(value) : false;
  });

  useEffect(() => {
    localStorage.setItem('showBrowserApi', JSON.stringify(showBrowserApi));
  }, [showBrowserApi]);

  return (
    <div>
      <h3 className='text-lg font-semibold mb-2 cursor-pointer w-fit' onClick={() => setShowBrowserApi((prev) => !prev)}>
        API браузера {showBrowserApi ? '▲' : '▼'}
      </h3>

      {showBrowserApi && (
        <div className='space-y-1 text-sm mt-2'>
          <h3 className='text-sm font-semibold mb-2 cursor-pointer'>Функции</h3>

          {apiFunctions.map((operator) => (
            <div
              key={operator.name}
              className='p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600'
              onClick={() => onClickNode({id: `${new Date().getTime()}`, type: NodeType.browserApiFunction, name: operator.name})}
            >
              {operator.name} ({operator.description})
            </div>
          ))}

          <h3 className='text-sm font-semibold my-2 cursor-pointer'>Объекты</h3>

          {apiObjects.map((operator) => (
            <div
              key={operator.name}
              className={'p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 ' + operator.className || ''}
              onClick={() => onClickNode({id: `${new Date().getTime()}`, type: NodeType.browserApiObject, name: operator.name})}
            >
              {operator.name} ({operator.description})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
