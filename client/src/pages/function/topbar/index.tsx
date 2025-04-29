import {Button, Input, Modal, Select} from 'antd';
import {useCallback, useState} from 'react';

import {useStore} from '@/app/store';
import {NodesManager} from '@/components/CanvasReact/NodesManager';
import {NodeType, VariableType} from '@/shared/enums';
import {FunctionStore, NodeUI, VariableStore} from '@/shared/types';
import {PlusOutlined, CodeOutlined, DeleteOutlined} from '@ant-design/icons';

const DATA_TYPES = [
  {value: 'string', label: 'Строка'},
  {value: 'number', label: 'Число'},
  {value: 'boolean', label: 'Логический тип'},
  {value: 'null', label: 'Null'},
] as const;

const VARIABLE_TYPES = [{value: 'const'}, {value: 'let'}, {value: 'var'}] as const;

export const VariablesTopbar = ({func, addNode}: {func: FunctionStore; addNode: NodesManager['addNode'] | undefined}) => {
  const {saveFunctionVariables} = useStore();

  const [showModal, setShowModal] = useState(false);
  const [dataType, setDateType] = useState(VariableType.string);
  const [variableType, setVariableType] = useState('const');
  const [value, setValue] = useState('');
  const [name, setName] = useState('');

  const onSubmitModal = () => {
    if (func.variables.find((v) => v.name === name)) {
      alert('Уже существует переменная с таким именем');
      return;
    }

    saveFunctionVariables(
      [
        ...func.variables,
        {
          id: `${new Date().getTime()}`,
          type: NodeType.variable,
          name,
          variableType,
          dataType,
          value,
        },
      ],
      func.id,
    );
    setShowModal(false);
  };

  const onClickVariable = useCallback(
    (node: NodeUI & {value: string | number | boolean | null; dataType: VariableType; variableType: string}) => {
      addNode?.(node.type, `${new Date().getTime()}`, node.name, {
        value: node.value,
        dataType: node.dataType,
        variableType: node.variableType,
      });
    },
    [addNode],
  );

  const onDeleteVariable = (variable: VariableStore) => {
    saveFunctionVariables(
      func.variables.filter((v) => v.id !== variable.id),
      func.id,
    );
  };

  return (
    <div className='w-[calc(100%-250px)] h-[120px] bg-gray-100 flex items-center px-4 space-x-4 rounded-md shadow-md absolute left-[250px]'>
      <div className='flex flex-col gap-2 items-center'>
        <CodeOutlined className='text-5xl' />
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center justify-center w-11 h-11 border-2 border-dashed border-blue-500 rounded-md text-blue-500 hover:bg-blue-50 transition cursor-pointer'
        >
          <PlusOutlined style={{fontSize: '24px'}} />
        </button>
      </div>

      <div className='flex gap-4 overflow-auto w-[calc(100%-64px)]'>
        {func.variables.map((variable) => (
          <div
            key={variable.id}
            className='flex items-center justify-center shrink-0 w-40 h-24 bg-white rounded-md border shadow-sm text-gray-800 font-semibold relative cursor-pointer hover:bg-blue-50'
            onClick={() => onClickVariable({...variable})}
          >
            {variable.name}

            <div className='absolute left-2 top-2 rounded-sm text-[14px] px-1 py-2 pb-2.5 bg-[#2980b9] text-white leading-0.5'>
              {variable.variableType}: {variable.dataType}
            </div>

            <div className='absolute left-2 bottom-2 rounded-sm text-[14px] px-1 py-2 pb-2.5 bg-[#2980b9] text-white leading-0.5'>
              {variable.value}
            </div>

            <Button
              className='absolute! top-1.5 right-1.5 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full hover:bg-red-600'
              title='Удалить переменную'
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteVariable(variable);
              }}
            />
          </div>
        ))}
      </div>

      {showModal && (
        <Modal open={true} onCancel={() => setShowModal(false)} footer={null} onOk={onSubmitModal}>
          <h3 className='text-xl font-semibold mb-5'>Создание новой переменной</h3>
          <div className='flex flex-col gap-2'>
            <span>Тип переменной</span>
            <Select
              value={variableType}
              onChange={(value) => setVariableType(value)}
              options={VARIABLE_TYPES.map(({value}) => ({value}))}
            />

            <span>Тип данных</span>
            <Select
              value={dataType}
              onChange={(value) => {
                setDateType(value as VariableType);

                if (value === VariableType.null) setValue('null');
                if (value === VariableType.string) setValue('');
                if (value === VariableType.number) setValue('');
                if (value === VariableType.boolean) setValue('true');
              }}
              options={DATA_TYPES.map(({value, label}) => ({label, value}))}
            />

            <span>Название переменной</span>
            <Input value={name} type='text' onChange={(e) => setName(e.target.value)} />

            {dataType !== VariableType.null && <span>Значение переменной</span>}
            {dataType === VariableType.boolean && (
              <Select value={value} onChange={setValue} options={['true', 'false'].map((value) => ({label: value, value}))} />
            )}
            {(dataType === VariableType.string || dataType === VariableType.number) && (
              <Input value={value} type='text' onChange={(e) => setValue(e.target.value)} />
            )}
          </div>

          <div className='flex justify-end gap-2 mt-4'>
            <Button onClick={() => setShowModal(false)}>Отмена</Button>
            <Button type='primary' onClick={onSubmitModal} disabled={!value.trim() || !name.trim()}>
              Создать
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
