import { Edge, Node } from "reactflow";
import { IUser } from "./user.types";

export type IFlow = {
    _id?: string,
    flow_name: string,
    trigger_keywords: string,
    created_by?: IUser,
    created_at?: Date,
    updated_at?: Date,
    updated_by?: IUser,
    nodes: Node[],
    edges: Edge[],
    is_active?:boolean
}
export type ITracker = {
    _id: string,
    phone_number: string,
    bot_number: string,
    customer_name: string,
    is_active: boolean,
    menu_id: string,
    flow: IFlow,
    updated_at: Date
}
