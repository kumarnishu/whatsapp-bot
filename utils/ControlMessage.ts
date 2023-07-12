import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js";
import { Flow } from "../models/Flow";
import { User } from "../models/User";
import { FlowNode } from "../types/flow.types";
import { toTitleCase } from "./ToTitleCase";
import { MenuTracker } from "../models/MenuTracker";
import { KeywordTracker } from "../models/KeywordTracker";


export const ControlMessage = async (client: Client, msg: WAWebJS.Message, customer_name?: string) => {
    let init_msg = "👉🏻"
    const from = await client.getNumberId(msg.from);
    let comingMessage = String(msg.body).toLowerCase()
    let specialMessage = msg.body
    let sendingMessage = ""
    let trackers = await KeywordTracker.find({ phone_number: from?._serialized, bot_number: msg.to }).populate('flow')
    let tracker = trackers.find((tracker) => {
        let keys = tracker.flow.trigger_keywords.split(",");
        for (let i = 0; i < keys.length; i++) {
            if (comingMessage.split(" ").includes(keys[i])) {
                return tracker
            }
        }
    })
    let menuTracker = await MenuTracker.findOne({ phone_number: from?._serialized }).populate('flow')
    let menuTrackers = await MenuTracker.find()
    if (specialMessage === "STOP") {
        trackers.forEach(async (tracker) => {
            await KeywordTracker.findByIdAndUpdate(tracker._id, { is_active: false })
        })
        menuTrackers.forEach(async (tracker) => {
            await MenuTracker.findByIdAndUpdate(tracker._id, { is_active: false })
        })
        if (from)
            await client?.sendMessage(from._serialized, "Stopped\n\nType START to Subscribe Again\t\n")
    }
    if (specialMessage === "START") {
        trackers.forEach(async (tracker) => {
            await KeywordTracker.findByIdAndUpdate(tracker._id, { is_active: true })
        })
        menuTrackers.forEach(async (tracker) => {
            await MenuTracker.findByIdAndUpdate(tracker._id, { is_active: true })
        })
        if (from)
            await client?.sendMessage(from._serialized, "Congrats ! Successfully Subscribed This Service")
    }
    if (!tracker) {
        let user = await User.findOne({ connected_number: String(msg.to) })
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
                if (customer_name) {
                    sendingMessage = sendingMessage + "  \tHello " + toTitleCase(customer_name) + "\t\n\n"
                }
                sendingMessage = sendingMessage + "  🏢  " + String(commonNode?.data.media_value) + "\n\n"
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
                        sendingMessage = sendingMessage + "\t" + init_msg + node.data.media_value + "\t\n"
                    })
                    await client?.sendMessage(from._serialized, sendingMessage)
                    await new KeywordTracker({
                        phone_number: String(from._serialized),
                        bot_number: String(msg.to),
                        flow: flow
                    }).save()
                    if (!menuTracker) {
                        await new MenuTracker({
                            menu_id: flow.nodes.find(node => node.parentNode === "common_message")?.id,
                            phone_number: String(from._serialized),
                            flow: flow
                        }).save()
                    }
                    if (menuTracker) {
                        let id = flow.nodes.find(node => node.parentNode === "common_message")?.id
                        if (id) {
                            menuTracker.menu_id = id
                            menuTracker.flow = flow
                            await menuTracker.save()
                        }

                    }

                }
            }
        }

    }
    if (tracker && menuTracker && from) {
        if (tracker.is_active) {
            menuTracker = await MenuTracker.findOne({ phone_number: tracker.phone_number })
            let startTriggered = false
            let keys = tracker.flow.trigger_keywords.split(",");
            for (let i = 0; i < keys.length; i++) {
                if (comingMessage.split(" ").includes(keys[i])) {
                    startTriggered = true
                    break
                }
            }
            if (comingMessage === '0' || startTriggered) {
                let commonNode = tracker?.flow.nodes.find((node) => node.id === "common_message")
                if (customer_name) {
                    sendingMessage = sendingMessage + "\tHello " + toTitleCase(customer_name) + "\t\n\n"
                }
                if (startTriggered) {
                    sendingMessage = sendingMessage + "  🏢  " + String(commonNode?.data.media_value) + "\t\n\n"
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
                    sendingMessage = sendingMessage + "\t" + init_msg + node.data.media_value + "\t\n"
                })
                if (tracker.is_active)
                    sendingMessage = sendingMessage + "\t\n" + "\n\t" + "🙏🏻 " + "Type STOP to Unsubscribe This Servicet\n\n"
                await client?.sendMessage(from._serialized, sendingMessage)
                if (parentNode) {
                    if (menuTracker) {
                        menuTracker.menu_id = parentNode.id
                        await menuTracker.save()
                    }
                }
            }
        }
    }
    if (!tracker && menuTracker && from) {
        if (comingMessage === '0') {
            let commonNode = menuTracker.flow.nodes.find((node) => node.id === "common_message")
            sendingMessage = sendingMessage + "  🏢  " + String(commonNode?.data.media_value) + "\t\n\n"
            let parentNode = menuTracker.flow.nodes.find((node) => node.parentNode === "common_message")
            let sendingNodes = menuTracker.flow.nodes.filter((node) => { return node.parentNode === parentNode?.id })
            sendingNodes.sort(function (a, b) {
                var keyA = new Date(a.data.index),
                    keyB = new Date(b.data.index);
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
            sendingNodes.forEach(async (node) => {
                sendingMessage = sendingMessage + "\t" + init_msg + node.data.media_value + "\t\n"
            })
            if (menuTracker.is_active)
                sendingMessage = sendingMessage + "\t\n" + "\n\t" + "🙏🏻 " + "Type STOP to Unsubscribe This Servicet\n\n"
            await client?.sendMessage(from._serialized, sendingMessage)
            if (parentNode) {
                if (menuTracker) {
                    menuTracker.menu_id = parentNode.id
                    await menuTracker.save()
                }
            }
        }
        if (menuTracker.is_active) {
            let parent = menuTracker.flow.nodes.find((node) => node.id === menuTracker?.menu_id)
            if (parent) {
                let sendingNodes = menuTracker.flow.nodes.filter((node) => { return node.parentNode === parent?.id })
                let targetNode = sendingNodes.filter((node) => {
                    let index = String(node.data.index)
                    if (index === comingMessage) {
                        return node
                    }
                    return undefined
                })[0]
                if (targetNode) {
                    let childNodes: FlowNode[] | undefined = menuTracker.flow.nodes.filter((node) => { return node.parentNode === targetNode?.id })
                    let childOutputNodes = childNodes.filter((node) => { return node.type === "OutputNode" })

                    let childMenuNodes = childNodes.filter((node) => { return node.type === "MenuNode" })

                    if (childMenuNodes.length > 0) {
                        let menuNode = childMenuNodes[0]
                        if (menuNode) {
                            let sendingNodes = menuTracker.flow.nodes.filter((node) => { return node.parentNode === menuNode.id })
                            sendingNodes.sort(function (a, b) {
                                var keyA = new Date(a.data.index),
                                    keyB = new Date(b.data.index);
                                // Compare the 2 dates
                                if (keyA < keyB) return -1;
                                if (keyA > keyB) return 1;
                                return 0;
                            });
                            sendingNodes.forEach(async (node) => {
                                sendingMessage = sendingMessage + "\t" + init_msg + node.data.media_value + "\t\n"
                            })
                            sendingMessage = "\n" + sendingMessage + "\n\t" + "👉🏻  " + "Press 0 for main menu\t\n"
                            await client?.sendMessage(from._serialized, sendingMessage)
                            if (menuTracker) {
                                menuTracker.menu_id = menuNode.id
                                await menuTracker.save()
                            }

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


