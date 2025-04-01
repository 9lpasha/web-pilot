import {Spin} from 'antd';
import {useState} from 'react';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';

import {CanvasPlayground} from '@/components';
import {FunctionPage, MainPage, WelcomePage} from '@/pages';
import {useLoadImages} from '@/shared/hooks';

export const App = () => {
  const [isReadyForRendering, setIsReadyForRendering] = useState(false);

  useLoadImages(setIsReadyForRendering);

  return isReadyForRendering ? (
    <>
      <Router>
        <Routes>
          <Route key='/functions' path='/functions/:id' element={<FunctionPage />} />
          <Route key='/main' path='/main' element={<MainPage />} />
          <Route key='/playground' path='/playground' element={<CanvasPlayground />} />
          <Route key='/' path='/' element={<WelcomePage />} />
        </Routes>
      </Router>
    </>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <Spin size='large' />
    </div>
  );
};
