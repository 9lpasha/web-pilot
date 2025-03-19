import {createRoot} from 'react-dom/client';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {DiagramNode} from '~shared';
import './index.css';
import {App} from './app';

const a = {} as DiagramNode;

console.log('Hello, world!', a);

const root = createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
  <Router>
    <Routes>
      <Route key='/functions' path='/functions' element={<div />} />
      <Route key='/' path='/' element={<App />} />
    </Routes>
  </Router>,
);
