import React, { useCallback, useState } from 'react';
import { Button } from 'react-bootstrap';
import ReactFlow, { Background, BackgroundVariant, Panel, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  { id: '3', position: { x: 0, y: 200 }, data: { label: '3' } },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' }
];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [variant, setVariant] = useState<BackgroundVariant>(BackgroundVariant.Cross);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection:any) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="#ccc" variant={BackgroundVariant.Cross} />
        <Panel position='top-left' className='d-flex gap-1'>
          <Button  variant="outline-success" onClick={() => setVariant(BackgroundVariant.Dots)}>dots</Button>
          <Button  variant="outline-success" onClick={() => setVariant(BackgroundVariant.Lines)}>lines</Button>
          <Button  variant="outline-success" onClick={() => setVariant(BackgroundVariant.Cross)}>cross</Button>
        </Panel>
        </ReactFlow>
    </div>
  );
}