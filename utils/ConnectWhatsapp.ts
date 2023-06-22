import { Socket } from "socket.io";
import WAWebJS, { Client, RemoteAuth } from "whatsapp-web.js";
import { User } from "../models/User";
import { Request } from "express";
import { ControlMessage } from "./ControlMessage";
import { store } from "../config/db";

export var client: Client | undefined = undefined;

export const ConectWhatsapp = async (req: Request, client_id: string, socket: Socket) => {
    if (client) {
        await client.destroy()
    }
    console.log("getting session")
    let session = await store.sessionExists({ session: client_id })
    client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            clientId: client_id,
            backupSyncIntervalMs: 300000
        }),
        puppeteer: {
            headless: true
        }
    });


    client.on("remote_session_saved", async () => {
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
    if (!session)
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
