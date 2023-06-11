import WAWebJS, { Buttons } from "whatsapp-web.js";
import { client } from "./ConnectWhatsapp";

export const ControlMessage = async (msg: WAWebJS.Message) => {
    if (client) {
        console.log(msg)
        const from = await client.getNumberId(msg.from); // get mobile number details
       
        let messageContent2="we got you"
        if (from) {
            await client.sendMessage(from._serialized, messageContent2); // send message
            console.log("message sent")
        } else {
            console.log(from, `${from} is not registered`)
        }
    }

}