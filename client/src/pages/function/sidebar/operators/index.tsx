import {useEffect, useState} from 'react';

import {NodeType} from '@/shared/enums';
import {NodeUI} from '@/shared/types';

import {operators} from '../constants';

export const SidebarOperators = ({onClickNode}: {onClickNode: (node: NodeUI) => void}) => {
  const [showOperators, setShowOperators] = useState<boolean>(() => {
    const value = sessionStorage.getItem('showOperators');

    return value ? JSON.parse(value) : false;
  });

  useEffect(() => {
    sessionStorage.setItem('showOperators', JSON.stringify(showOperators));
  }, [showOperators]);

  return (
    <div>
      <h3 className='text-lg font-semibold cursor-pointer w-fit' onClick={() => setShowOperators((prev) => !prev)}>
        Операторы {showOperators ? '▲' : '▼'}
      </h3>

      {showOperators && (
        <div className='space-y-1 text-sm mt-2'>
          {operators.map((operator) => (
            <div
              key={operator.name}
              className='p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600'
              onClick={() => onClickNode({id: `${new Date().getTime()}`, type: NodeType.operator, name: operator.name})}
            >
              {operator.name} ({operator.description})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
