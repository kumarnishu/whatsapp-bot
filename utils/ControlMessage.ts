import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js";
import { Flow } from "../models/Flow";
import { User } from "../models/User";
import { MenuTracker } from "../models/MenuTracker";
import { FlowNode } from "../types/flow.types";

export const ControlMessage = async (client: Client, msg: WAWebJS.Message) => {
    let init_msg = "👉 "
    try {
        if (client) {
            const from = await client.getNumberId(msg.from);
            let tracker = await MenuTracker.findOne({ phone_number: from?._serialized }).populate('flow')
            let comingMessage = String(msg.body).toLowerCase()
            let sendingMessage = ""
            if (!tracker) {
                let user = await User.findOne({ connected_number: String(msg.to)})
                let flows = await Flow.find({ created_by: user })
                if (flows.length > 0) {
                    let flow = flows.find((flow) => {
                        let keys = flow.trigger_keywords.split(",");
                        for (let i = 0; i < keys.length; i++) {
                            if (comingMessage.split(" ").includes(keys[i])) {
                                return flow
                            }
                        }
                        return null
                    })
                    if (flow && from) {
                        let commonNode = flow.nodes.find((node) => node.id === "common_message")
                        sendingMessage = String(commonNode?.data.media_value) + "\n"
                        let parent = flow.nodes.find(node => node.parentNode === "common_message")
                        if (parent) {
                            let sendingNodes = flow.nodes.filter((node) => { return node.parentNode === parent?.id })
                            sendingNodes.sort(function (a, b) {
                                var keyA = new Date(a.data.index),
                                    keyB = new Date(b.data.index);
                                // Compare the 2 dates
                                if (keyA < keyB) return -1;
                                if (keyA > keyB) return 1;
                                return 0;
                            });
                            sendingNodes.forEach(async (node) => {
                                sendingMessage = sendingMessage + init_msg + node.data.media_value + "\n"
                            })
                            await client?.sendMessage(from._serialized, sendingMessage)
                            await new MenuTracker({
                                menu_id: flow.nodes.find(node => node.parentNode === "common_message")?.id,
                                phone_number: String(from._serialized),
                                joined_at: new Date(),
                                last_active: new Date(),
                                flow: flow
                            }).save()
                        }
                    }
                }
            }
            if (tracker && from) {
                let parent = tracker.flow.nodes.find((node) => node.id === tracker?.menu_id)
                let startTriggered = false
                let keys = tracker.flow.trigger_keywords.split(",");
                for (let i = 0; i < keys.length; i++) {
                    if (comingMessage.split(" ").includes(keys[i])) {
                        startTriggered = true
                        break
                    }
                }
                if (comingMessage === '0' || startTriggered) {
                    if (startTriggered) {
                        let commonNode = tracker?.flow.nodes.find((node) => node.id === "common_message")
                        sendingMessage = String(commonNode?.data.media_value) + "\n"
                    }
                    let parentNode = tracker?.flow.nodes.find((node) => node.parentNode === "common_message")
                    let sendingNodes = tracker?.flow.nodes.filter((node) => { return node.parentNode === parentNode?.id })
                    sendingNodes.sort(function (a, b) {
                        var keyA = new Date(a.data.index),
                            keyB = new Date(b.data.index);
                        // Compare the 2 dates
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                        return 0;
                    });
                    sendingNodes.forEach(async (node) => {
                        sendingMessage = sendingMessage + init_msg + node.data.media_value + "\n"
                    })
                    await client?.sendMessage(from._serialized, sendingMessage)
                    if (parentNode) {
                        tracker.menu_id = parentNode.id
                        await tracker.save()
                    }
                }
                if (parent) {
                    let sendingNodes = tracker.flow.nodes.filter((node) => { return node.parentNode === parent?.id })
                    let targetNode = sendingNodes.filter((node) => {
                        let index = String(node.data.index)
                        if (index === comingMessage) {
                            return node
                        }
                        return undefined
                    })[0]

                    if (targetNode) {
                        let childNodes: FlowNode[] | undefined = tracker.flow.nodes.filter((node) => { return node.parentNode === targetNode?.id })
                        let childOutputNodes = childNodes.filter((node) => { return node.type === "OutputNode" })

                        let childMenuNodes = childNodes.filter((node) => { return node.type === "MenuNode" })

                        if (childMenuNodes.length > 0) {
                            let menuNode = childMenuNodes[0]
                            if (menuNode) {
                                let sendingNodes = tracker.flow.nodes.filter((node) => { return node.parentNode === menuNode.id })
                                sendingNodes.sort(function (a, b) {
                                    var keyA = new Date(a.data.index),
                                        keyB = new Date(b.data.index);
                                    // Compare the 2 dates
                                    if (keyA < keyB) return -1;
                                    if (keyA > keyB) return 1;
                                    return 0;
                                });
                                sendingNodes.forEach(async (node) => {
                                    sendingMessage = sendingMessage + init_msg + node.data.media_value + "\n"
                                })
                                sendingMessage = sendingMessage + init_msg + "Press 0 for main menu"
                                await client?.sendMessage(from._serialized, sendingMessage)
                                tracker.menu_id = menuNode.id
                                await tracker.save()
                            }
                        }
                        if (childOutputNodes.length > 0) {
                            childOutputNodes?.forEach(async (node) => {
                                if (node.data.media_type === "message") {
                                    let nodeText = String(node.data.media_value).split("\\n")
                                    let message = ""
                                    for (let i = 0; i < nodeText.length; i++) {
                                        message = message + nodeText[i] + "\n"
                                    }
                                    await client?.sendMessage(from._serialized, message)
                                }
                                else {
                                    let message = await MessageMedia.fromUrl(String(node.data.media_value));
                                    await client?.sendMessage(from._serialized, message)
                                }

                            })
                        }
                    }
                }
            }
        }
    }
    catch (err) {
        console.log(err)
    }
}