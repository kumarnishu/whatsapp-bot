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
        let user = await User.findOne({ client_id: client_id })
        if (user) {
            await User.findByIdAndUpdate(user._id, {
                is_whatsapp_active: true,
                connected_number: client?.info.wid.user
            })
        }
        if (!clients.find((client) => client.client_id === client_id))
            clients.push({ client_id: client_id, client: client })
        console.log("session revived for", client && client.info.wid.user)
    })
    client.on('disconnected', async (reason) => {
        console.log("reason", reason)
        fs.rmSync(`.browsers/${client_id}`, { recursive: true, force: true });
        let user = await User.findOne({ client_id: client_id })
        if (user) {
            await User.findByIdAndUpdate(user._id, {
                is_whatsapp_active: false,
                connected_number: null
            })
        }
        clients = clients.filter((client) => { return client.client_id === client_id })
        console.log("task is running for", client_id)
    })
    client.on('qr', async (qr) => {
        console.log("logged out", qr)
        socket.emit("qr", qr);
        clients = clients.filter((client) => { return client.client_id === client_id })
        console.log("task is running for", client_id)
    });
    client.on('loading_screen', async (qr) => {
        console.log("loading..")
        socket.emit("loading");
        console.log("task is running for", client_id)
    });
    client.on('message', async (msg: Message) => {
        if (client) {
            ControlMessage(client, msg)
            console.log("task is running for",client_id)
        }
    });
    await client.initialize();
}
