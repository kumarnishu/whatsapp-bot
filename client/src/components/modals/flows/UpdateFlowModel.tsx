import React, {  useContext, useState, useCallback } from "react";
import { Background, BackgroundVariant, Connection, Controls, MiniMap, Node, Panel, ReactFlow, addEdge, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from 'uuid';
import { MenuNode, DefaultNode, StartNode, OutputNode } from "../../nodes/NodeTypes"
import { IFlow } from "../../../types/flow.types";
import { Modal } from "react-bootstrap";
import UpdateNodeModal from "./UpdateNodeModal";
import { AppChoiceActions, ChoiceContext } from "../../../contexts/DialogContext";
import SaveUpdateFlowModal from "./SaveUpdateFlowModal";

const nodeTypes = { MenuNode, DefaultNode, StartNode, OutputNode }

function UpdateFlowModel({ selectedFlow }: { selectedFlow: IFlow }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [flow, setFlow] = useState<IFlow>(selectedFlow)
    const [nodes, setNodes, onNodesChange] = useNodesState(selectedFlow.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(selectedFlow.edges);
    const [selectedNode, setSelectedNode] = useState<Node>()
    const [displaySaveModal, setDisplaySaveModal] = useState(false)
    function handleSelectNode(event: React.MouseEvent, _node: Node) {
        setSelectedNode(_node)
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
                    }
                    return node
                }))
            }

            if (srcNode.type === "DefaultNode" && targetNode.type === "OutputNode") {
                let length = nodes.filter((node) => { return node.parentNode === srcNode?.id }).length
                setNodes((nodes) => nodes.map((node) => {
                    if (node.id === targetNode?.id) {
                        node.parentNode = srcNode?.id
                        node.data = {
                            ...node.data,
                            index: length ? length + 1 : 1
                        }
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
                data: {},
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
        if (selectedNode) {
            setNodes((nodes) => nodes.map((node) => {
                if (node.id === selectedNode.id) {
                    node.data = {
                        ...node.data,
                        media_value,
                        media_type,
                    }
                }
                return node
            }))
        }

    }

    console.log(flow)
    return (
        <Modal fullscreen
            show={choice === AppChoiceActions.update_flow ? true : false}
            centered
        >
            <div style={{ height: "100vh" }}>
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
                    <Controls  position="top-left" />
                    <Panel position="top-right" className="d-flex flex-column gap-1">
                        {/* @ts-ignore */}
                        <div style={{ cursor: "pointer", maxWidth: 100, backgroundColor: '#ff8080' }} className="react-flow__node-default btn  p-1 fs-6 mt-1 text-light" onDragStart={(event: DragEvent) => onDragStart(event, 'DefaultNode')} draggable>
                            <div className="d-flex gap-1 align-items-center justify-content-center">
                                <img width="20" height="20" src="https://img.icons8.com/arcade/64/box.png" alt="undo" />
                                <span>Default</span>
                            </div>
                        </div>
                        <div style={{ cursor: "pointer", maxWidth: 100, backgroundColor: '#32CD32' }} className="react-flow__node-default btn  p-1 fs-6 mt-1 text-light"
                            //@ts-ignore
                            onDragStart={(event: DragEvent) => onDragStart(event, 'OutputNode')}
                            draggable
                        >
                            <div className="d-flex gap-1 align-items-center justify-content-center">
                                <img width="20" height="20" src="https://img.icons8.com/arcade/64/box.png" alt="undo" />
                                <span>Output</span>
                            </div>
                        </div>
                        <div style={{ cursor: "pointer", maxWidth: 100 }} className="react-flow__node-default btn p-1 fs-6 mt-1 bg-dark text-light"
                        >
                            <div className="d-flex gap-1 align-items-center justify-content-center"
                                onClick={() => {
                                    setFlow({ ...flow, nodes, edges })
                                    setDisplaySaveModal(true)
                                }
                                }
                            >
                                <img width="20" height="20" src="https://img.icons8.com/color/48/save--v1.png" alt="undo" />
                                <span >Save</span>
                            </div>
                        </div>
                        <div style={{ cursor: "pointer", maxWidth: 100, backgroundColor: '#72A0C1' }} className="react-flow__node-default btn p-1 fs-6 mt-1 text-light"
                        >
                            <div className="d-flex gap-1 align-items-center justify-content-center"
                                onClick={() => setChoice({ type: AppChoiceActions.close_app })}
                            >
                                <img width="20" height="20" src="https://img.icons8.com/fluency/48/delete-sign.png" alt="close" />
                                <span >Close</span>
                            </div>
                        </div>

                    </Panel>
                </ReactFlow >
                {selectedNode ? <UpdateNodeModal updateNode={UpdateNode} selectedNode={selectedNode} setSelectedNode={setSelectedNode} /> : null}
                {displaySaveModal && flow ? <SaveUpdateFlowModal flow={flow} setDisplaySaveModal={setDisplaySaveModal} /> : null}
            </div>
        </Modal>
    )
}

export default UpdateFlowModel