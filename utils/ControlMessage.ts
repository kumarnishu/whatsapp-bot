import WAWebJS from "whatsapp-web.js";
import { client } from "./ConnectWhatsapp";
import { Flow } from "../models/Flow";
import { User } from "../models/User";

export const ControlMessage = async (msg: WAWebJS.Message) => {
    console.log("recieved message:", msg)
    try {
        if (client) {
            const from = await client.getNumberId(msg.from);
            const me = await client.getNumberId(msg.to);
            let user = await User.findOne({ connected_number: String(msg.to).replace("@c.us", "") })
            console.log(user)
            let flows = await Flow.find({ created_by: user })
            console.log(flows)

            if (flows.length > 0) {
                let flow = flows.find(flow => {
                    let keys = flow.trigger_keywords.split(",");
                    let key = keys.find(key => key === msg.body)
                    if (key) {
                        return flow
                    }
                })
                if (flow && from) {
                    let parent = flow.nodes.find(node => node.parentNode === "start")
                    console.log(parent)

                    if (parent) {
                        let sendingNodes = flow.nodes.filter((node) => { return node.parentNode === parent?.id })
                        console.log(sendingNodes)

                        sendingNodes.forEach(async (node) => {
                            await client?.sendMessage(from._serialized, node.data.media_value)
                        })
                    }

                }
            }
        }
    }
    catch (err) {
        console.log(err)
    }
}