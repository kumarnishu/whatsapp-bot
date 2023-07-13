import { Request, Response, NextFunction } from "express";
import { ConectWhatsapp } from "../utils/ConnectWhatsapp";
import { AppSocket } from "..";
import { TFlowBody, TTrackerBody } from "../types/flow.types";
import { Flow } from "../models/Flow";
import { KeywordTracker } from "../models/KeywordTracker";
import { MenuTracker } from "../models/MenuTracker";

export const SetUpWhatsappProfile = async (req: Request, res: Response, next: NextFunction) => {
    const client_id = req.user?.client_id
    const client_data_path = req.user?.client_data_path
    if (!client_id || !client_data_path) {
        return res.status(404).json({ message: "fill all required fields" })
    }
    if (AppSocket && client_id && client_data_path) {
        try {
            await ConectWhatsapp(client_id, client_data_path, AppSocket)
        }
        catch (err: any) {
            console.log(err)
            return res.status(500).json({ message: "error while Refresh Whatsapp,check internet" })
        }

    }
    return res.status(200).json({ message: "whatsapp connected" })

}

export const CreateFlow = async (req: Request, res: Response, next: NextFunction) => {
    const { flow_name, nodes, edges, trigger_keywords } = req.body as TFlowBody
    if (!flow_name || !nodes || !edges || !trigger_keywords)
        return res.status(400).json({ message: "please fill required fields" })
    let flows = await Flow.find({ created_by: req.user, flow_name: flow_name })
    let flow = flows[0]
    if (flow)
        return res.status(500).json({ message: "Already a flow exists with this name" })
    await new Flow({
        flow_name: flow_name,
        nodes: nodes,
        edges: edges,
        trigger_keywords: trigger_keywords.toLowerCase(),
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json("new flow created")
}


export const UpdateFlow = async (req: Request, res: Response, next: NextFunction) => {
    const { flow_name, nodes, edges, trigger_keywords } = req.body as TFlowBody
    const id = req.params.id
    if (!id) {
        return res.status(400).json({ message: "please provide correct flow id" })
    }
    if (!flow_name || !nodes || !edges || !trigger_keywords)
        return res.status(400).json({ message: "please fill required fields" })


    let flow = await Flow.findById(id)
    if (flow?.flow_name !== flow_name) {
        let flows = await Flow.find({ created_by: req.user, flow_name: flow_name })
        let flowtmp = flows[0]
        if (flowtmp)
            return res.status(400).json({ message: "Already a flow exists with this name" })
    }

    if (flow) {
        await Flow.findByIdAndUpdate(flow._id, {
            flow_name: flow_name,
            nodes: nodes,
            edges: edges,
            trigger_keywords: trigger_keywords.toLowerCase(),
            created_at: new Date(),
            updated_at: new Date(),
            updated_by: req.user
        })
        return res.status(200).json({ message: "flow updated" })
    }
    else
        return res.status(404).json({ message: "flow not exists" })

}


export const GetFlows = async (req: Request, res: Response, next: NextFunction) => {
    let flows = await Flow.find({ created_by: req.user })
    return res.status(200).json(flows)
}

export const DestroyFlow = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let flow = await Flow.findById(id)
    if (!flow)
        return res.status(404).json({ message: "flow not exists" })
    await Flow.findByIdAndDelete(id)
    return res.status(200).json({ message: "deleted flow" })
}


export const StartBot = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({ message: "please provide correct tracker id" })
    }
    const { phone_number, bot_number } = req.body as TTrackerBody

    let trackers = await KeywordTracker.find({ phone_number: phone_number, bot_number: bot_number })
    let menuTrackers = await MenuTracker.find({ phone_number: phone_number, bot_number: bot_number })
    trackers.forEach(async (tracker) => {
        await KeywordTracker.findByIdAndUpdate(tracker._id, { is_active: true })
    })
    menuTrackers.forEach(async (tracker) => {
        await MenuTracker.findByIdAndUpdate(tracker._id, { is_active: true })
    })

    return res.status(200).json("bot successfully started for this number")
}

export const StopBot = async (req: Request, res: Response, next: NextFunction) => {
    const { phone_number, bot_number } = req.body as TTrackerBody
    const id = req.params.idF
    if (!id) {
        return res.status(400).json({ message: "please provide correct tracker id" })
    }
    let trackers = await KeywordTracker.find({ phone_number: phone_number, bot_number: bot_number })
    let menuTrackers = await MenuTracker.find({ phone_number: phone_number, bot_number: bot_number })
    trackers.forEach(async (tracker) => {
        await KeywordTracker.findByIdAndUpdate(tracker._id, { is_active: false })
    })
    menuTrackers.forEach(async (tracker) => {
        await MenuTracker.findByIdAndUpdate(tracker._id, { is_active: false })
    })
    return res.status(200).json("bot stopped for this number")

}
