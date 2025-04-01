import {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {useStore} from '@/app/store';
import {CanvasManager, CanvasNode} from '@/components';
import {INTERVAL_TIME} from '@/shared/constants';
import {PropsModal} from '@/widgets/PropsModal';
import {FunctionNode, GlobalCanvasInfo, NodeUI} from '@shared/types';

import {FunctionsSidebar} from './sidebar';

const dpr = window.devicePixelRatio || 1;

export const FunctionPage = () => {
  const {id} = useParams<{id: string}>();

  const {functions, globalCanvasInfo, saveFunctionNodes, saveGlobalCanvasInfoForFunction} = useStore();
  const func = functions.find((f) => f.id === id) as FunctionNode;

  const navigate = useNavigate();

  const [canvasManager, setCanvasManager] = useState<CanvasManager>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBackRef = useRef<HTMLCanvasElement>(null);
  const canvasTempRef = useRef<HTMLCanvasElement>(null);

  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !canvasBackRef.current || !canvasTempRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const addNode = (_: CanvasNode) => {};

    const manager = new CanvasManager({
      canvas: canvasRef.current,
      canvasBack: canvasBackRef.current,
      canvasTemp: canvasTempRef.current,
      initialNodes: func?.nodes,
      initialGlobalCanvasInfo: globalCanvasInfo?.functions?.[id as string],
      reactStore: {
        navigate,
        returnNode: addNode,
        openModal: () => setIsOpenModal(true),
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

  const onClickHtmlNode = useCallback(
    (node: NodeUI) => {
      canvasManager?.nodesManager.addNode(node.type, node.id, node.name as keyof HTMLElementTagNameMap | undefined);
    },
    [canvasManager?.nodesManager],
  );

  return (
    <div style={{width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex'}}>
      <FunctionsSidebar onClickHtmlNode={onClickHtmlNode} />

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

      {isOpenModal && <PropsModal close={() => setIsOpenModal(false)} />}
    </div>
  );
};
