import { Socket } from "socket.io";
import { Client,  LocalAuth, Message } from "whatsapp-web.js";
import { ControlMessage } from "./ControlMessage";
import { User } from "../models/User";
const fs = require("fs")

let clients: { client_id: string, client: Client }[] = []

export async function createWhatsappClient(client_id: string, client_data_path: string, socket: Socket) {
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
        socket.emit("ready", client.info.wid.user)
        let user = await User.findOne({
            connected_number: client.info.wid._serialized
        })
        if (!user)
            user = await User.findOne({ client_id: client_id })
        if (user) {
            await User.findByIdAndUpdate(user._id, {
                is_whatsapp_active: true,
                connected_number: client?.info.wid._serialized
            })
        }
        // let contacts:Contact[] = await client.getContacts()
        // console.log(contacts)
        if (!clients.find((client) => client.client_id === client_id))
            clients.push({ client_id: client_id, client: client })
        console.log("session revived for", client.info)
    })
    try {
        client.on('disconnected', async (reason) => {
            console.log("reason", reason)
            socket.emit("disconnected_whatsapp", client_id)
            let user = await User.findOne({ connected_number: client.info.wid._serialized })
            if (user) {
                await User.findByIdAndUpdate(user._id, {
                    is_whatsapp_active: false,
                    connected_number: null
                })
            }
            clients = clients.filter((client) => { return client.client_id === client_id })
            fs.rmSync(`.browsers/${client_id}`, { recursive: true, force: true })
            console.log("disconnected", client.info)
        })
    }
    catch (err) {
        console.log(err)
    }
    client.on('qr', async (qr) => {
        socket.emit("qr", qr);
        clients = clients.filter((client) => { return client.client_id === client_id })
        console.log("logged out", qr, client_id)
    });
    client.on('loading_screen', async (qr) => {
        socket.emit("loading");
        console.log("loading", client_id)
    });
    client.on('message', async (msg: Message) => {
        if (client) {
            await ControlMessage(client, msg)
        }
    });

    // client.on('message_ack', (data) => {
    //     console.log(data.ack)
    // })
    await client.initialize();
}
