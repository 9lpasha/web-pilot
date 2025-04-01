import {Upload, message, Card} from 'antd';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useStore} from '@/app/store';
import {InboxOutlined} from '@ant-design/icons';

const {Dragger} = Upload;

export const WelcomePage = () => {
  const {createHtmlNodes, resetStore} = useStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'text/html') {
      message.error('Можно загружать только HTML-файлы!');
      return false;
    }
    message.success(`Файл ${file.name} загружен!`);
    setLoading(true);

    resetStore();

    await createHtmlNodes(file);

    navigate('/main');
    return false;
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white'>
      <Card className='w-full max-w-md text-center shadow-lg rounded-2xl'>
        <h1 className='text-2xl font-bold text-gray-900'>Привет!</h1>
        <p className='mt-2 text-gray-600'>Загрузите HTML-файл, чтобы начать работу</p>

        <Dragger beforeUpload={handleFileUpload} showUploadList={false} className='mt-5! block rounded-lg p-6 bg-gray-50'>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined className='text-3xl text-indigo-500' />
          </p>
          <p className='text-gray-700'>Кликните или перетащите файл сюда</p>
        </Dragger>

        {loading && <p className='mt-4 text-gray-500'>Загружаем, подождите...</p>}
      </Card>
    </div>
  );
};
