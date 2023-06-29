import React, { useState, useCallback, useEffect } from "react";
import { Background, BackgroundVariant, Connection, Controls, Edge, MiniMap, Node, Panel, ReactFlow, addEdge, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import { MenuNode, DefaultNode, OutputNode, StartNode } from "../components/nodes/NodeTypes"


const nodeTypes = { MenuNode, DefaultNode, StartNode, OutputNode }

const initialNodes: Node[] = [
  {
    id: 'start',
    position: { x: 0, y: 10 },
    data: { id: 'start', label: "Put Keywords to trigger this flow" },
    type: 'StartNode'  },
  {
    id: '2',
    position: { x: 0, y: 50 },
    data: { id: 2, label: "menu1" },
  },
  {
    id: '3',
    position: { x: 0, y: 100 },
    data: { label: "type 1 for catalouge of company" },
  },
  {
    id: '4',
    position: { x: 0, y: 150 },
    data: { label: "type 2 for call book of company" },
  }
];



export default function FlowPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [node, setNode] = useState<Node>()
  const [srcNode, setSourceNode] = useState<Node>()
  const [targetNode, setTargetNode] = useState<Node>()

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
        let data = () =>
          nodes.map((node) => {
            if (node.id === targetNode?.id) {
              node.type = "MenuNode"
              console.log("running1")

            }
            return node;
          })
        setNodes(data);
        console.log("running2")


      }
      if (srcNode.type === "MenuNode") {
        let length = nodes.filter((node) => { return node.parentNode === srcNode?.id }).length
        let data = nodes.map((node) => {
          if (node.id === targetNode?.id) {
            node.type = "DefaultNode"
            node.parentNode = srcNode?.id
            node.data = {
              ...node.data,
              index: length ? length + 1 : 1
            }
          }
          return node;
        })
        setNodes(data);
      }
      if (srcNode.type === "DefaultNode") {
        return edges
      }
    }
    return addEdge(params, eds)
  }), []);

  useEffect(()=>{

  },[])
  return (
    <ReactFlow
      defaultNodes={nodes}
      defaultEdges={edges}
      onConnect={onConnect}
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

