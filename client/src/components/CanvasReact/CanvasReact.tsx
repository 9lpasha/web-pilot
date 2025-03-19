import {useCallback, useEffect, useRef, useState} from 'react';
import {CanvasManager} from './CanvasManager';
import {fakeNodes} from './CanvasReact.constants';
import {Sidebar} from './Sidebar';
import {NodeUI} from './CanvasReact.types';
import {Node} from './Node';

export const CanvasReact = () => {
  const [canvasManager, setCanvasManager] = useState<CanvasManager>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBackRef = useRef<HTMLCanvasElement>(null);
  const canvasTempRef = useRef<HTMLCanvasElement>(null);

  const [sidebarNodes, setSidebarNodes] = useState(fakeNodes);

  useEffect(() => {
    if (!canvasRef.current || !canvasBackRef.current || !canvasTempRef.current) return;

    const addNode = (node: Node) => {
      setSidebarNodes((prev) => [...prev, {id: node.id, type: node.type, name: node.tagName}]);
    };

    const manager = new CanvasManager({
      canvas: canvasRef.current,
      canvasBack: canvasBackRef.current,
      canvasTemp: canvasTempRef.current,
      returnNode: addNode,
    });

    setCanvasManager(manager);
  }, [setSidebarNodes, setCanvasManager]);

  const onClickHtmlNode = useCallback(
    (node: NodeUI) => {
      canvasManager?.nodesManager.addNode(node.type, node.id, node.name as keyof HTMLElementTagNameMap | undefined);
      setSidebarNodes(sidebarNodes.filter((el) => node.id !== el.id));
    },
    [canvasManager?.nodesManager, sidebarNodes],
  );

  return (
    <div style={{width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex'}}>
      <Sidebar htmlNodes={sidebarNodes} onClickHtmlNode={onClickHtmlNode} />

      <div style={{position: 'relative'}}>
        <canvas
          style={{height: window.screen.height + 'px', width: window.screen.width + 'px', position: 'absolute'}}
          height={window.screen.height}
          width={window.screen.width}
          id='canvasBack'
          ref={canvasBackRef}
        />
        <canvas
          style={{height: window.screen.height + 'px', width: window.screen.width + 'px', position: 'absolute'}}
          height={window.screen.height}
          width={window.screen.width}
          id='canvas'
          ref={canvasRef}
        />
        <canvas
          style={{height: window.screen.height + 'px', width: window.screen.width + 'px', position: 'absolute'}}
          height={window.screen.height}
          width={window.screen.width}
          id='canvasTemp'
          ref={canvasTempRef}
        />
      </div>
    </div>
  );
};
