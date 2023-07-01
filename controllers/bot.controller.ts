import { Request, Response, NextFunction } from "express";
import { ConectWhatsapp } from "../utils/ConnectWhatsapp";
import { AppSocket } from "..";
import { TFlowBody } from "../types/flow.types";
import { Flow } from "../models/Flow";

export const SetUpWhatsappProfile = async (req: Request, res: Response, next: NextFunction) => {
    const client_id = req.user?.client_id
    if (!client_id) {
        return res.status(404).json({ message: "whatsapp session id not found" })
    }
    if (AppSocket && client_id) {
        try {
            await ConectWhatsapp(req, client_id, AppSocket)
        }
        catch (err: any) {
            console.log(err)
            return res.status(500).json({ message: "error while Refresh Whatsapp,check internet" })
        }

    }
    return res.status(200).json({ message: "whatsapp connected" })

}

export const CreateFlow = async (req: Request, res: Response, next: NextFunction) => {
    const { flow_name, nodes } = req.body as TFlowBody
    let startNode = nodes.find(node => node.id === "start")
    let trigger_keywords = ""
    if (startNode && startNode.data) {
        trigger_keywords = startNode.data.label
    }
    let new_flow = await new Flow({
        flow_name: flow_name,
        nodes: nodes,
        trigger_keywords: trigger_keywords,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(new_flow)
}

export const UpdateFlow = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const { flow_name, nodes } = req.body as TFlowBody
    if (!await Flow.findById(id))
        return res.status(404).json({ message: "flow not exists" })
    let startNode = nodes.find(node => node.id === "start")
    let trigger_keywords = ""
    if (startNode && startNode.data) {
        trigger_keywords = startNode.data.label
    }
    await Flow.findByIdAndUpdate(id, {
        flow_name: flow_name,
        nodes: nodes,
        trigger_keywords: trigger_keywords,
        updated_at: new Date(),
        updated_by: req.user
    })
    return res.status(200).json({ message: "updated flow" })
}

export const DestroyFlow = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!await Flow.findById(id))
        return res.status(404).json({ message: "flow not exists" })
    await Flow.findByIdAndDelete(id)
    return res.status(200).json({ message: "deleted flow" })
}