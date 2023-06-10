import WAWebJS from "whatsapp-web.js";
import { client } from "./ConnectWhatsapp";

export const ControlMessage = async (msg: WAWebJS.Message) => {
    console.log(msg)
    if (client) {
        const from = await client.getNumberId(msg.from); // get mobile number details
        if (from) {
            const sendMessageData = await client.sendMessage(from._serialized, "hi nishu got your message"); // send message
            console.log("message sent")
        } else {
            console.log(from, `${from} is not registered`)
        }
    }

}