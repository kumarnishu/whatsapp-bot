import React, { useContext, useState, useCallback } from "react";
import { Background, BackgroundVariant, Connection, Controls, MiniMap, Node, Panel, ReactFlow, addEdge, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import { MenuNode, DefaultNode, OutputNode, StartNode } from "../components/nodes/NodeTypes"
import { v4 as uuidv4 } from 'uuid';
import { AppChoiceActions, ChoiceContext } from "../contexts/DialogContext";
import UpdateNodeModal from "../components/modals/flows/UpdateNode";

const nodeTypes = { MenuNode, DefaultNode, StartNode, OutputNode }

const initialNodes: Node[] = [
  {
    id: 'start',
    position: { x: 0, y: 10 },
    data: { media_value: "Trigger Keywords" },
    type: 'StartNode'
  }
];

export default function FlowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [node, setNode] = useState<Node>()
  const { setChoice } = useContext(ChoiceContext)

  function handleSelectNode(event: React.MouseEvent, node: Node) {
    setNode(node)
    setChoice({ type: AppChoiceActions.update_node })
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
            node.data = {
              ...node.data,
              label: "Menu Node"
            }
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
            node.data = {
              ...node.data,
              label: "Menu Node"
            }
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

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    if (event && event.dataTransfer) {
      const type = event?.dataTransfer.getData('application/reactflow');
      const newNode: Node = {
        id: uuidv4(),
        type,
        position: { x: 0, y: 0 },
        data: { media_value: `${type}` },
      };
      setNodes((nds) => nds.concat(newNode));
    }
  };

  const onDragStart = (event: DragEvent, nodeType: string) => {
    if (event && event.dataTransfer) {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (event && event.dataTransfer)
      event.dataTransfer.dropEffect = 'move';
  };

  const UpdateNode = (media_value: string, media_type?: string) => {
    if (node) {
      setNodes((nodes) => nodes.map((node) => {
        if (node.id === node.id) {
          node.data = {
            ...node.data,
            media_value: media_value,
            media_type: media_type,
          }
        }
        return node
      }))
    }

  }
  console.log(node)
  console.log(nodes)
  
  return (
    <div style={{ height: "90vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ type: "smoothstep" }}
        onNodeDoubleClick={handleSelectNode}
        //@ts-ignore

        onDrop={onDrop}
        //@ts-ignore

        onDragOver={onDragOver}
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap pannable={true} nodeStrokeWidth={5}
          zoomable={true} nodeColor="grey" />
        <Controls />
        <Panel position="top-right">
          {/* @ts-ignore */}
          <div className="react-flow__node-default" onDragStart={(event: DragEvent) => onDragStart(event, 'DefaultNode')} draggable>
            Default Node
          </div>
          <hr></hr>
          <div
            className="react-flow__node-default"
            //@ts-ignore
            onDragStart={(event: DragEvent) => onDragStart(event, 'OutputNode')}
            draggable
          >
            Output Node
          </div>
        </Panel>
      </ReactFlow>
      {node ? <UpdateNodeModal updateNode={UpdateNode} /> : null}
    </div>
  );
};

