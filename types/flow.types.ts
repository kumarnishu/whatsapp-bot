import { IUser } from "./user.types";

export type FlowNode = {
    id: string,
    data: any,
    type: "DefaultNode" | "MenuNode" | "StartNode" | "OutputNode",
    parentNode: string
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
    is_active: Boolean
}

export type TFlowBody = Request['body'] & IFlow & FlowNode;


export type IMenuTracker = {
    _id: string,
    phone_number: string,
    bot_number:string,
    is_active:boolean,
    menu_id: string,
    flow:IFlow,
    joined_at: Date,
    last_active: Date
}
