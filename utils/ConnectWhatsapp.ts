import { Socket } from "socket.io";
import WAWebJS, { Client, LocalAuth } from "whatsapp-web.js";
import { User } from "../models/User";
import { Request } from "express";
import { ControlMessage } from "./ControlMessage";


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
            whatsapp: { client_id: client_id, is_active: true }
        })
        console.log("session revived", req.user?._id)

    })
    client.on("authenticated", async () => {
        console.log("authenticated")
        await User.findByIdAndUpdate(req.user?._id, {
            whatsapp: { client_id: client_id, is_active: true }
        })
    })
    client.on("auth_failure", async () => {
        console.log("failed to authenticate")
        await User.findByIdAndUpdate(req.user?._id, {
            whatsapp: { client_id: client_id, is_active: false }
        })
    })
    client.on('qr', async (qr) => {
        console.log("logged out", qr)
        socket.emit("qr", qr);
        await User.findByIdAndUpdate(req.user?._id, {
            whatsapp: { client_id: client_id, is_active: false }
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
