import { Socket } from "socket.io";
import { Client, LocalAuth, Message } from "whatsapp-web.js";
import { User } from "../models/User";
import { Request } from "express";
import { ControlMessage } from "./ControlMessage";
const fs = require("fs")


export async function createWhatsappClient(req:Request,client_id: string, client_data_path:string, socket: Socket) {
    console.log("getting session")
    let client = new Client({
        authStrategy: new LocalAuth({
            clientId: client_id,
            dataPath: `./.browsers/${client_data_path}`
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        }
    });

    client.on("ready", async () => {
        socket.emit("ready", client_id)
        let connected_number = client?.info.wid.user
        if (connected_number) {
            let user = await User.findOne({ connected_number: connected_number })
            if (user)
                user.is_whatsapp_active = true
            if (!user) {
                await User.findByIdAndUpdate(req.user?._id, {
                    is_whatsapp_active: true,
                    connected_number: client?.info.wid.user
                })
            }
        }
        console.log("session revived", client && client.info.wid.user)
        console.log(client_id)
    })
    client.on('disconnected', async (reason) => {
        console.log("reasn", reason)
        fs.rmSync(`.wwebjs_auth/session-${client_id}`, { recursive: true, force: true });
        let connected_number = client?.info.wid.user
        if (connected_number) {
            let user = await User.findOne({ connected_number: connected_number })
            if (user)
                user.is_whatsapp_active = false
            if (!user) {
                await User.findByIdAndUpdate(req.user?._id, {
                    is_whatsapp_active: false,
                    connected_number: null
                })
            }
        }
        console.log(client_id)
    })
    client.on('qr', async (qr) => {
        console.log("logged out", qr)
        socket.emit("qr", qr);
        await User.findByIdAndUpdate(req.user?._id, {
            is_whatsapp_active: false
        })
        console.log(client_id)
    });
    client.on('loading_screen', async (qr) => {
        console.log("loading..")
        socket.emit("loading");
        console.log(client_id)
    });
    client.on('message', async (msg: Message) => {
        if (client) {
            ControlMessage(client, msg)
            console.log(client_id)
        }
    });
    await client.initialize();
}