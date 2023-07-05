import { Socket } from "socket.io";
import WAWebJS, { Client, LocalAuth } from "whatsapp-web.js";
import { User } from "../models/User";
import { Request } from "express";
import { ControlMessage } from "./ControlMessage";
const fs = require("fs")

export var client: Client | undefined = undefined;

export const ConectWhatsapp = async (req: Request, client_id: string, socket: Socket) => {
    if (client) {
        await client.destroy()
    }
    console.log("getting session")
    client = new Client({
        authStrategy: new LocalAuth({
            clientId: client_id
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
        await User.findByIdAndUpdate(req.user?._id, {
            is_whatsapp_active: true,
            connected_number: client?.info.wid.user
        })
        console.log("session revived", client && client.info.wid.user)
    })
    client.on('disconnected', async (reason) => {
        console.log("reasn", reason)
        fs.rmSync(`.wwebjs_auth/session-${client_id}`, { recursive: true, force: true });
        await User.findByIdAndUpdate(req.user?._id, {
            is_whatsapp_active: false
        })
        if (client)
            await client.initialize();
    });
    client.on('qr', async (qr) => {
        console.log("logged out", qr)
        socket.emit("qr", qr);
        await User.findByIdAndUpdate(req.user?._id, {
            is_whatsapp_active: false
        })

    });
    client.on('loading_screen', async (qr) => {
        console.log("loading..")
        socket.emit("loading");
    });
    client.on('message', async (msg: WAWebJS.Message) => {
        ControlMessage(msg)
    });
    await client.initialize();
}
