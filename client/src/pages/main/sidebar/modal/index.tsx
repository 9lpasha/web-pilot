import {Modal, Input, Button} from 'antd';
import {useState} from 'react';

import {useStore} from '@/app/store';

export function CreateFunctionModal({onClose}: {onClose: () => void}) {
  const [functionName, setFunctionName] = useState('');
  const {createFunction} = useStore();

  const handleSubmit = () => {
    if (functionName.trim()) {
      const id = `${new Date().getTime()}`;

      createFunction({id, name: functionName, nodes: []});
      onClose();
    }
  };

  return (
    <Modal open={true} onCancel={onClose} footer={null} title='Создать функцию'>
      <div className='flex flex-col gap-4'>
        <Input placeholder='Введите название функции' value={functionName} onChange={(e) => setFunctionName(e.target.value)} />

        <div className='flex justify-end gap-2'>
          <Button onClick={onClose}>Отмена</Button>
          <Button type='primary' onClick={handleSubmit} disabled={!functionName.trim()}>
            Создать
          </Button>
        </div>
      </div>
    </Modal>
  );
}
