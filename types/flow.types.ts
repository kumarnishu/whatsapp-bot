import { IUser } from "./user.types";

export type FlowNode = {
    id: string,
    data: any,
    type: "DefaultNode" | "MenuNode" | "StartNode" | "OutputNode",
    ParentNode: string
}
export type IFlow = {
    _id: string,
    flow_name: string,
    trigger_keywords: string,
    created_by: IUser,
    created_at: Date,
    updated_at: Date,
    updated_by: IUser,
    nodes: FlowNode[],
    edges: Object[],
    is_active:Boolean
}
export type TFlowBody = Request['body'] & IFlow & FlowNode;



