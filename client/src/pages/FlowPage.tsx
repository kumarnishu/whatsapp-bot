import React, { useState, useCallback } from "react";
import { Background, BackgroundVariant, Connection, Controls, MiniMap, Node, Panel, ReactFlow, addEdge, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import { MenuNode, DefaultNode, OutputNode, StartNode } from "../components/nodes/NodeTypes"


const nodeTypes = { MenuNode, DefaultNode, StartNode, OutputNode }

const initialNodes: Node[] = [
  {
    id: 'start',
    position: { x: 0, y: 10 },
    data: { id: 'start',label:"Triggers" },
    type: 'StartNode'
  },
  {
    id: '2',
    position: { x: 0, y: 50 },
    data: { id: 2 },
  },
  {
    id: '3',
    position: { x: 0, y: 100 },
    data: {},
  },
  {
    id: '4',
    position: { x: 0, y: 150 },
    data: {},
  },
  {
    id: '5',
    position: { x: 0, y: 200 },
    data: { id: 2 },
  },
  {
    id: '6',
    position: { x: 0, y: 250 },
    data: {},
    type: "DefaultNode"
  },
  {
    id: '7',
    position: { x: 0, y: 300 },
    data: {},
    type:"OutputNode"
  }
];

export default function FlowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [node, setNode] = useState<Node>()

  // add new child
  function addNewNode() {
    console.log(node)
  }
  function handleSelectNode(event: React.MouseEvent, node: Node) {
    setNode(node)
    console.log(node)
  }
  //handle nodes
  const onConnect = useCallback((params: Connection) => setEdges((eds) => {
    let srcNode = nodes.find(node => node.id === params.source)
    let targetNode = nodes.find(node => node.id === params.target)

    if (srcNode && targetNode) {
      if (srcNode.type === "StartNode") {
        setNodes((nodes) => nodes.map((node) => {
          if (node.id === targetNode?.id) {
            node.type = "MenuNode"
            node.parentNode = srcNode?.id
          }
          return node
        }))
      }


      if (srcNode.type === "MenuNode") {
        let length = nodes.filter((node) => { return node.parentNode === srcNode?.id }).length
        setNodes((nodes) => nodes.map((node) => {
          if (node.id === targetNode?.id) {
            node.type = "DefaultNode"
            node.parentNode = srcNode?.id
            node.data = {
              ...node.data,
              index: length ? length + 1 : 1
            }
          }
          return node
        }))
      }

      if (srcNode.type === "DefaultNode" && targetNode.type === "DefaultNode") {
        setNodes((nodes) => nodes.map((node) => {
          if (node.id === targetNode?.id) {
            node.type = "MenuNode"
            node.parentNode = srcNode?.id
          }
          return node
        }))
      }

      if (srcNode.type === "DefaultNode" && targetNode.type === "OutputNode") {
        setNodes((nodes) => nodes.map((node) => {
          if (node.id === targetNode?.id) {
            node.parentNode = srcNode?.id
          }
          return node
        }))
      }
    }
    return addEdge(params, eds)
  }), [nodes, setNodes, setEdges]);

  console.log(nodes)
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      nodeTypes={nodeTypes}
      defaultEdgeOptions={{ type: "smoothstep" }}
      onNodeClick={handleSelectNode}
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap pannable={true} nodeStrokeWidth={5}
        zoomable={true} nodeColor="grey" />
      <Controls />
      <Panel position="top-right">
        {node ?
          <button onClick={addNewNode}>New Node</button> : null
        }
      </Panel>
    </ReactFlow>
  );
};

