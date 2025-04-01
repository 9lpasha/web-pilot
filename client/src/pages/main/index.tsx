import {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useStore} from '@/app/store';
import {CanvasManager, CanvasNode} from '@/components';
import {INTERVAL_TIME} from '@/shared/constants';
import {findNodeByKey} from '@/shared/lib';
import {PropsModal} from '@/widgets/PropsModal';
import {NodeUI} from '@shared/types';

import {MainSidebar} from './sidebar';

const dpr = window.devicePixelRatio || 1;

export const MainPage = () => {
  const {htmlNodes, mainCanvasNodes, globalCanvasInfo, saveCanvasNodes, saveGlobalCanvasInfo} = useStore();

  const navigate = useNavigate();

  const [canvasManager, setCanvasManager] = useState<CanvasManager>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBackRef = useRef<HTMLCanvasElement>(null);
  const canvasTempRef = useRef<HTMLCanvasElement>(null);

  const [sidebarNodes, setSidebarNodes] = useState(htmlNodes);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !canvasBackRef.current || !canvasTempRef.current) return;

    const addNode = (node: CanvasNode) => {
      const tempNodes = [...sidebarNodes];
      const obj = findNodeByKey(tempNodes, node.id);
      if (obj) obj.disabled = false;

      setSidebarNodes(tempNodes);
    };

    const manager = new CanvasManager({
      canvas: canvasRef.current,
      canvasBack: canvasBackRef.current,
      canvasTemp: canvasTempRef.current,
      initialNodes: mainCanvasNodes,
      initialGlobalCanvasInfo: globalCanvasInfo?.main,
      reactStore: {
        navigate,
        returnNode: addNode,
        openModal: () => setIsOpenModal(true),
        saveCanvasNodes,
        saveGlobalCanvasInfo,
      },
    });

    setCanvasManager(manager);

    const intervalId = setInterval(manager.sync.bind(manager), INTERVAL_TIME);

    return () => {
      manager.sync();
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSidebarNodes, setCanvasManager]);

  const onClickHtmlNode = useCallback(
    (node: NodeUI) => {
      const tempNodes = [...sidebarNodes];
      const obj = findNodeByKey(tempNodes, node.id);
      if (obj) obj.disabled = true;

      setSidebarNodes(tempNodes);
      canvasManager?.nodesManager.addNode(node.type, node.id, node.name as keyof HTMLElementTagNameMap | undefined);
    },
    [canvasManager?.nodesManager, sidebarNodes],
  );

  const onClickNode = useCallback(
    (node: NodeUI) => {
      canvasManager?.nodesManager.addNode(node.type, node.id, node.name as keyof HTMLElementTagNameMap | undefined, node.navigateLink);
    },
    [canvasManager?.nodesManager],
  );

  return (
    <div style={{width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex'}}>
      <MainSidebar htmlNodes={sidebarNodes} onClickHtmlNode={onClickHtmlNode} onClickNode={onClickNode} />

      <div style={{position: 'relative'}}>
        <canvas
          style={{height: window.screen.height + 'px', width: window.screen.width + 'px', position: 'absolute'}}
          height={window.screen.height * dpr}
          width={window.screen.width * dpr}
          id='canvasBackMain'
          key='canvasBackMain'
          ref={canvasBackRef}
        />
        <canvas
          style={{height: window.screen.height + 'px', width: window.screen.width + 'px', position: 'absolute'}}
          height={window.screen.height * dpr}
          width={window.screen.width * dpr}
          id='canvasMain'
          key='canvasMain'
          ref={canvasRef}
        />
        <canvas
          style={{height: window.screen.height + 'px', width: window.screen.width + 'px', position: 'absolute'}}
          height={window.screen.height * dpr}
          width={window.screen.width * dpr}
          id='canvasTempMain'
          key='canvasTempMain'
          ref={canvasTempRef}
        />
      </div>

      {isOpenModal && <PropsModal close={() => setIsOpenModal(false)} />}
    </div>
  );
};
