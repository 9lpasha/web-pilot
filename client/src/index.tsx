// index.tsx - entry point

import {createRoot} from 'react-dom/client';
import {DiagramNode} from '~shared';
import './index.css';
import {App} from './app';

const a = {} as DiagramNode;

console.log('Hello, world!', a);

const root = createRoot(document.getElementById('root') as HTMLDivElement);
root.render(<App />);
