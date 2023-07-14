import { Socket } from "socket.io";
import { Client, LocalAuth, Message } from "whatsapp-web.js";
import { ControlMessage } from "./ControlMessage";
import { User } from "../models/User";
import { KeywordTracker } from "../models/KeywordTracker";
import { MenuTracker } from "../models/MenuTracker";
const fs = require("fs")
import cron from "cron";

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
        if (client.info.wid.user) {
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
        }
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

    client.on('message_ack', async (data) => {
        //@ts-ignore
        if (data.ack === 2 && data._data.self === "in") {
            await handleBot(data)
        }
    })
    await client.initialize();
}


async function handleBot(data: Message) {
    let trackers = await KeywordTracker.find({ phone_number: data.to, bot_number: data.from })
    let menuTrackers = await MenuTracker.find({ phone_number: data.to, bot_number: data.from })
    trackers.forEach(async (tracker) => {
        await KeywordTracker.findByIdAndUpdate(tracker._id, { is_active: false })
    })
    menuTrackers.forEach(async (tracker) => {
        await MenuTracker.findByIdAndUpdate(tracker._id, { is_active: false })
    })
    //@ts-ignore
    console.log("running cron job")
    //cron job to restart
    // let time = new Date(new Date().getTime() + 5 * 60 * 60 * 1000)
    let time = new Date(new Date().getTime() + 60 * 1000)
    new cron.CronJob(time, async () => {
        console.log('running cron job')
        trackers.forEach(async (tracker) => {
            await KeywordTracker.findByIdAndUpdate(tracker._id, { is_active: true })
        })
        menuTrackers.forEach(async (tracker) => {
            await MenuTracker.findByIdAndUpdate(tracker._id, { is_active: true })
        })
    }).start()
}