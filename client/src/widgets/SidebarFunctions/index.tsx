import {Button} from 'antd';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useStore} from '@/app/store';
import {NodeType} from '@/shared/enums';
import {NodeUI} from '@/shared/types';
import EntryIcon from '@shared/assets/images/entry.png';

import {CreateFunctionModal} from './modal';

export const SidebarFunctions = ({onClickFunction}: {onClickFunction: (node: NodeUI & {navigateLink: string}) => void}) => {
  const {functions} = useStore();
  const functionsArray = [...Object.values(functions)];

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showFunctions, setShowFunctions] = useState<boolean>(() => {
    const value = sessionStorage.getItem('showFunctions');

    return value ? JSON.parse(value) : false;
  });

  useEffect(() => {
    sessionStorage.setItem('showFunctions', JSON.stringify(showFunctions));
  }, [showFunctions]);

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold cursor-pointer' onClick={() => setShowFunctions((prev) => !prev)}>
          Функции {showFunctions ? '▲' : '▼'}
        </h3>
        <Button type='primary' size='small' onClick={() => setShowModal(true)}>
          Добавить
        </Button>
      </div>

      {showFunctions &&
        (functionsArray.length > 0 ? (
          <div className='space-y-1 text-sm mt-2'>
            {functionsArray.map((func, index) => (
              <div
                key={index}
                className='p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 relative'
                onClick={() =>
                  onClickFunction({
                    id: `${new Date().getTime()}`,
                    navigateLink: '/function/' + func.id,
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
                    navigate('/function/' + func.id);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-400 text-sm mt-2'>Функции отсутствуют</p>
        ))}

      {showModal && <CreateFunctionModal onClose={() => setShowModal(false)} />}
    </div>
  );
};
