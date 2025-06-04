import {Spin} from 'antd';
import {FC, useState} from 'react';
import {Route, BrowserRouter as Router, Routes, useParams} from 'react-router-dom';

import {ApplicationPage, FunctionPage, MainPage, WelcomePage} from '@/pages';
import {useLoadImages} from '@/shared/hooks';

const PageWrapperWithKey = ({Component}: {Component: FC}) => {
  const {id} = useParams();
  return <Component key={id} />;
};

export const App = () => {
  const [isReadyForRendering, setIsReadyForRendering] = useState(false);

  useLoadImages(setIsReadyForRendering);

  return isReadyForRendering ? (
    <>
      <Router basename='/web-pilot/'>
        <Routes>
          <Route key='/function' path='/function/:id' element={<PageWrapperWithKey Component={FunctionPage} />} />
          <Route key='/main' path='/main' element={<MainPage />} />
          <Route key='/' path='/' element={<WelcomePage />} />
          <Route key='/application' path='/application' element={<ApplicationPage />} />
        </Routes>
      </Router>
    </>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <Spin size='large' />
    </div>
  );
};
