import React, { useEffect, useContext, useState, useCallback } from "react";
import { Background, BackgroundVariant, Connection, Controls, MiniMap, Node, Panel, ReactFlow, addEdge, useNodesState, useEdgesState, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from 'uuid';
import { MenuNode, DefaultNode, StartNode, OutputNode, CommonNode } from "../../nodes/NodeTypes"
import { IFlow } from "../../../types/flow.types";
import { Modal } from "react-bootstrap";
import UpdateNodeModal from "./UpdateNodeModal";
import { AppChoiceActions, ChoiceContext } from "../../../contexts/DialogContext";
import SaveNewFlow from "./SaveNewFlow";

const nodeTypes = { MenuNode, DefaultNode, StartNode, OutputNode, CommonNode }
const initialNodes: Node[] = [
    {
        id: 'start',
        position: { x: 0, y: 0 },
        data: { index: 1, media_type: "message", media_value: "Start" },
        type: 'StartNode',
        deletable: false
    },
    {
        id: 'common_message',
        position: { x: 0, y: 50 },
        data: { index: 1, media_type: "message", media_value: "Common Message" },
        type: 'CommonNode',
        deletable: false,
        parentNode: 'start'
    }
];

const initialEdges: Edge[] = [
    {
        id: 'start_common_message',
        source: 'start',
        target: 'common_message',
        deletable: false
    }
]

function CreateFlowModal() {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node>()
    const [flow, setFlow] = useState<IFlow>()
    const [displaySaveModal, setDisplaySaveModal] = useState(false)
    const [displayNodeUpdateModal, setDisplayNodeUpdateModal] = useState(false)

    function handleSingleClick(event: React.MouseEvent, _node: Node) {
        setSelectedNode(_node)
    }
    function handleDoubleClick(event: React.MouseEvent, _node: Node) {
        if (selectedNode) {
            setDisplayNodeUpdateModal(true)
        }
    }

    function handleEdgeDelete(event: React.MouseEvent, _edge: Edge) {
        let is_deletable = true
        let parentNode = nodes.find((node) => node.id === _edge.source)
        if (_edge.source === "start")
            is_deletable = false
        else if (parentNode?.type === "MenuNode")
            is_deletable = false
        if (is_deletable) {
            setEdges(edges.filter((edge) => {
                return edge.id !== _edge.id
            }))
        }
    }
    //handle nodes
    const onConnect = useCallback((params: Connection) => setEdges((eds) => {
        let srcNode = nodes.find(node => node.id === params.source)
        let targetNode = nodes.find(node => node.id === params.target)

        if (srcNode && targetNode) {
            if (srcNode.type === "CommonNode") {
                setNodes((nodes) => nodes.map((node) => {
                    if (node.id === targetNode?.id) {
                        node.type = "MenuNode"
                        node.parentNode = srcNode?.id
                        node.position = {
                            x: selectedNode ? selectedNode.position.x : 0,
                            y: selectedNode ? selectedNode.position.y + 50 : 100
                        }
                        node.data = {
                            ...node.data,
                            media_type: "message",
                            media_value: "menu"
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
                        node.position = {
                            x: selectedNode ? selectedNode.position.x : 0,
                            y: selectedNode ? selectedNode.position.y + 50 : 100
                        }
                        node.data = {
                            ...node.data,
                            index: length ? length + 1 : 1,
                            media_type: "message",
                            media_value: "default"
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
                        node.position = {
                            x: selectedNode ? selectedNode.position.x : 0,
                            y: selectedNode ? selectedNode.position.y + 50 : 100
                        }
                        node.data = {
                            ...node.data,
                            media_type: "message",
                            media_value: "menu"
                        }
                    }
                    return node
                }))
            }

            if (srcNode.type === "DefaultNode" && targetNode.type === "OutputNode") {
                let length = nodes.filter((node) => { return node.parentNode === srcNode?.id }).length
                setNodes((nodes) => nodes.map((node) => {
                    if (node.id === targetNode?.id) {
                        node.parentNode = srcNode?.id
                        node.position = {
                            x: selectedNode ? selectedNode.position.x : 0,
                            y: selectedNode ? selectedNode.position.y + 50 : 100
                        }
                        node.data = {
                            ...node.data,
                            index: length ? length + 1 : 1,
                            media_type: "message",
                            media_value: "output"
                        }
                    }
                    return node
                }))
            }
        }
        return addEdge(params, eds)
    }), [nodes, selectedNode, setNodes, setEdges]);

    const onDrop = (event: DragEvent) => {
        event.preventDefault();
        if (event && event.dataTransfer) {
            const type = event?.dataTransfer.getData('application/reactflow');
            const newNode: Node = {
                id: uuidv4(),
                type,
                position: {
                    x: selectedNode ? selectedNode.position.x : 0,
                    y: selectedNode ? selectedNode.position.y + 50 : 100
                },
                data: { media_type: "message", media_value: "default" }
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

    const UpdateNode = (index: number, media_value: string, media_type?: string) => {
        if (selectedNode) {
            setNodes((nodes) => nodes.map((node) => {
                if (node.id === selectedNode.id) {
                    node.data = {
                        ...node.data,
                        index: index,
                        media_value,
                        media_type,
                    }
                }
                if (node.id === "start") {
                    if (flow)
                        setFlow({
                            ...flow,
                            trigger_keywords: node.data.media_value
                        })
                }
                return node
            }))
        }

    }
    const handleNewNodeONClick = (type: string) => {
        const newNode: Node = {
            id: uuidv4(),
            type,
            position: {
                x: selectedNode ? selectedNode.position.x : 0,
                y: selectedNode ? selectedNode.position.y + 50 : 100
            },
            data: { media_type: "message", media_value: "default" }
        };
        setNodes((nds) => nds.concat(newNode));
    }
    useEffect(() => {
        let startNode = nodes.find(node => node.id === "start")
        if (startNode) {
            setFlow({
                flow_name: "",
                nodes,
                edges,
                trigger_keywords: startNode.data.media_value
            })
        }
    }, [nodes, edges])

    return (
        <Modal fullscreen
            show={choice === AppChoiceActions.create_flow ? true : false}
            centered
        >
            <div style={{ height: "100vh" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onConnect={onConnect}
                    fitView
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    onNodeClick={handleSingleClick}
                    onNodeDoubleClick={handleDoubleClick}
                    onEdgeDoubleClick={handleEdgeDelete}
                    defaultEdgeOptions={{ animated: true, interactionWidth: 50 }}
                    //@ts-ignore

                    onDrop={onDrop}
                    //@ts-ignore

                    onDragOver={onDragOver}
                >
                    <Background variant={BackgroundVariant.Dots} />
                    <MiniMap pannable={true} nodeStrokeWidth={5}
                        zoomable={true} nodeColor="grey" />
                    <Controls position="top-left" />
                    <Panel position="top-right" className="d-flex flex-column gap-1">
                        {/* @ts-ignore */}
                        <div style={{ cursor: "pointer", maxWidth: 100, backgroundColor: '#ff8080' }} className="react-flow__node-default btn  p-1 fs-6 mt-1 text-light" onDragStart={(event: DragEvent) => onDragStart(event, 'DefaultNode')} draggable
                            onDoubleClick={() => handleNewNodeONClick("DefaultNode")}
                        >
                            <div className="d-flex gap-1 align-items-center justify-content-center"
                            >
                                <img width="20" height="20" src="https://img.icons8.com/arcade/64/box.png" alt="undo" />
                                <span>Default</span>
                            </div>
                        </div>
                        <div style={{ cursor: "pointer", maxWidth: 100, backgroundColor: '#32CD32' }} className="react-flow__node-default btn  p-1 fs-6 mt-1 text-light"
                            //@ts-ignore
                            onDragStart={(event: DragEvent) => onDragStart(event, 'OutputNode')}
                            draggable
                            onDoubleClick={() => handleNewNodeONClick("OutputNode")}
                        >
                            <div className="d-flex gap-1 align-items-center justify-content-center">
                                <img width="20" height="20" src="https://img.icons8.com/arcade/64/box.png" alt="undo" />
                                <span>Output</span>
                            </div>
                        </div>
                        <div style={{ cursor: "pointer", maxWidth: 100, backgroundColor: '#72A0C1' }} className="react-flow__node-default btn p-1 fs-6 mt-1 text-light"
                        >
                            <div className="d-flex gap-1 align-items-center justify-content-center"
                                onClick={() => {
                                    setDisplaySaveModal(true)
                                }}
                            >
                                <img width="20" height="20" src="https://img.icons8.com/color/48/save--v1.png" alt="close" />
                                <span >Save</span>
                            </div>
                        </div>


                        <div style={{ cursor: "pointer", maxWidth: 100, backgroundColor: '#72A0C1' }} className="react-flow__node-default btn p-1 fs-6 mt-1 text-light"
                        >
                            <div className="d-flex gap-1 align-items-center justify-content-center"
                                onClick={() => {
                                    setChoice({ type: AppChoiceActions.close_app })
                                    setFlow(undefined)
                                    setNodes(initialNodes)
                                    setEdges(initialEdges)
                                }}
                            >
                                <img width="20" height="20" src="https://img.icons8.com/fluency/48/delete-sign.png" alt="close" />
                                <span >Close</span>
                            </div>
                        </div>
                        <div style={{ cursor: "pointer", maxWidth: 100, backgroundColor: '#72A0C1' }} className="react-flow__node-default btn p-1 fs-6 mt-1 text-light"
                        >
                            <div className="d-flex gap-1 align-items-center justify-content-center"
                                onClick={() => {
                                    setFlow(undefined)
                                    setNodes(initialNodes)
                                    setEdges(initialEdges)
                                }}
                            >
                                <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/update-left-rotation.png" alt="close" />
                                <span>Reset</span>
                            </div>
                        </div>
                    </Panel>
                </ReactFlow >
                {displayNodeUpdateModal && selectedNode ? <UpdateNodeModal updateNode={UpdateNode} selectedNode={selectedNode} setDisplayNodeUpdateModal={setDisplayNodeUpdateModal} displayNodeUpdateModal={displayNodeUpdateModal} /> : null}
                {displaySaveModal && flow ? <SaveNewFlow setFlow={setFlow} flow={flow} setDisplaySaveModal={setDisplaySaveModal} 
                /> : null}
            </div>
        </Modal>
    )
}

export default CreateFlowModal