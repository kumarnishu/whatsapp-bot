import { Socket } from "socket.io";
import { Client, LocalAuth, Message } from "whatsapp-web.js";
import { User } from "../models/User";
import { Request } from "express";
import { ControlMessage } from "./ControlMessage";
const fs = require("fs")

let clients: { client_id: string, client: Client }[] = []
export async function createWhatsappClient(req: Request, client_id: string, client_data_path: string, socket: Socket) {
    console.log("getting session")
    let oldClient = clients.find((client) => client.client_id === client_id)
    if (oldClient) {
        oldClient.client.destroy()
    }
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
        if (!clients.find((client) => client.client_id === client_id))
            clients.push({ client_id: client_id, client: client })
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
        clients = clients.filter((client) => { return client.client_id === client_id })
        console.log(client_id)
    })
    client.on('qr', async (qr) => {
        console.log("logged out", qr)
        socket.emit("qr", qr);
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
        clients = clients.filter((client) => { return client.client_id === client_id })
        console.log(client_id)
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

clients.forEach((client) => console.log(client.client_id))