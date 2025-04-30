import {Button} from 'antd';
import {Link, useNavigate} from 'react-router-dom';

import {useStore} from '@/app/store';
import {ComponentFromHTML} from '@/components';
import {SIDEBAR_WIDTH} from '@/shared/constants';
import {HomeFilled, ArrowLeftOutlined} from '@ant-design/icons';

export const ApplicationPage = () => {
  const {htmlContent} = useStore();
  const navigate = useNavigate();

  return (
    <div className='w-screen h-screen overflow-hidden flex relative'>
      <aside className='h-screen bg-gray-900 text-white relative p-4' style={{width: SIDEBAR_WIDTH}}>
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
      </aside>

      <div className='h-screen' style={{width: `calc(100% - ${SIDEBAR_WIDTH}px)`}}>
        <ComponentFromHTML htmlContent={htmlContent} />
      </div>
    </div>
  );
};
