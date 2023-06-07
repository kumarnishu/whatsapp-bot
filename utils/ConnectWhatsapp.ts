import { Socket } from "socket.io";
import { Client, LocalAuth } from "whatsapp-web.js";
import { User } from "../models/User";
import { Request } from "express";


export var client: Client | undefined = undefined;

export const ConectWhatsapp = async (req: Request, client_id: string, socket: Socket) => {
    console.log("getting session")
    client = new Client({
        authStrategy: new LocalAuth({
            clientId: client_id
        }),

    });
    client.on("ready", async () => {
        socket.emit("ready", client_id)
        await User.findByIdAndUpdate(req.user?._id, {
            whatsapp: { client_id: client_id, is_active: true }
        })
        console.log("session revived", req.user?._id)

    })
    client.on('qr', async (qr) => {
        console.log("logged out", qr)
        socket.emit("qr", qr);
        await User.findByIdAndUpdate(req.user?._id, {
            whatsapp: { client_id: client_id, is_active: false }
        })

    });

    client.on('message', msg => {
        if (msg.body == 'hi') {
            msg.reply('pong');
        }
    });
    await client.initialize();
}
