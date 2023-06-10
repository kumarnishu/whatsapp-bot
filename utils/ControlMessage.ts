import WAWebJS, { Buttons } from "whatsapp-web.js";
import { client } from "./ConnectWhatsapp";

export const ControlMessage = async (msg: WAWebJS.Message) => {
    if (client) {
        console.log(msg)
        const from = await client.getNumberId(msg.from); // get mobile number details
        let messageContent1: Buttons = {
            body: 'give response through buttons',
            buttons: [{
                buttonId: "shdwdiwd",
                buttonText: {
                    displayText: "yes"
                },
                type: 1
            }]
        }
        let messageContent2="we got you"
        if (from) {
            console.log(from._serialized)
            await client.sendMessage(from._serialized, messageContent1); // send message

            console.log("message sent")
        } else {
            console.log(from, `${from} is not registered`)
        }
    }

}