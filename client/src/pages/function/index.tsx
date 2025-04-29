import {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {useStore} from '@/app/store';
import {CanvasManager} from '@/components';
import {INTERVAL_TIME} from '@/shared/constants';
import {GlobalCanvasInfo} from '@shared/types';

import {FunctionsSidebar} from './sidebar';
import {VariablesTopbar} from './topbar';

const dpr = window.devicePixelRatio || 1;

export const FunctionPage = () => {
  const {id} = useParams<{id: string}>();

  const {functions, globalCanvasInfo, saveFunctionNodes, saveGlobalCanvasInfoForFunction} = useStore();
  const func = functions[id as string];

  const [canvasManager, setCanvasManager] = useState<CanvasManager>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBackRef = useRef<HTMLCanvasElement>(null);
  const canvasTempRef = useRef<HTMLCanvasElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasRef.current || !canvasBackRef.current || !canvasTempRef.current) return;

    const manager = new CanvasManager({
      canvas: canvasRef.current,
      canvasBack: canvasBackRef.current,
      canvasTemp: canvasTempRef.current,
      initialNodes: func.nodes,
      initialGlobalCanvasInfo: globalCanvasInfo?.functions?.[id as string],
      reactStore: {
        navigate,
        saveCanvasNodes: (nodes) => saveFunctionNodes(nodes, id as string),
        saveGlobalCanvasInfo: (info: GlobalCanvasInfo | undefined) => saveGlobalCanvasInfoForFunction(info, id as string),
      },
    });

    setCanvasManager(manager);

    const intervalId = setInterval(manager.sync.bind(manager), INTERVAL_TIME);

    return () => {
      manager.sync();
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCanvasManager]);

  return (
    <div className='w-screen h-screen overflow-hidden flex relative'>
      <FunctionsSidebar func={func} addNode={canvasManager?.nodesManager.addNode.bind(canvasManager?.nodesManager)} />

      <div style={{position: 'relative'}}>
        <canvas
          style={{height: window.screen.height + 'px', width: window.screen.width + 'px', position: 'absolute'}}
          height={window.screen.height * dpr}
          width={window.screen.width * dpr}
          id='canvasBackFunc'
          key='canvasBackFunc'
          ref={canvasBackRef}
        />
        <canvas
          style={{height: window.screen.height + 'px', width: window.screen.width + 'px', position: 'absolute'}}
          height={window.screen.height * dpr}
          width={window.screen.width * dpr}
          id='canvasFunc'
          key='canvasFunc'
          ref={canvasRef}
        />
        <canvas
          style={{height: window.screen.height + 'px', width: window.screen.width + 'px', position: 'absolute'}}
          height={window.screen.height * dpr}
          width={window.screen.width * dpr}
          id='canvasTempFunc'
          key='canvasTempFunc'
          ref={canvasTempRef}
        />
      </div>

      <VariablesTopbar func={func} addNode={canvasManager?.nodesManager.addNode.bind(canvasManager?.nodesManager)} />
    </div>
  );
};
