import WAWebJS, { List, MessageMedia } from "whatsapp-web.js";
import { client } from "./ConnectWhatsapp";

export const ControlMessage = async (msg: WAWebJS.Message) => {
    console.log("recieved message:", msg)
    try {
        if (client) {
            const from = await client.getNumberId(msg.from); // get mobile number details
            let message: WAWebJS.MessageContent | undefined;
            // message="hello i Got your message"
            message = await MessageMedia.fromUrl('https://res.cloudinary.com/dc56gnk0b/raw/upload/v1687411459/AR_REPORT_17-6-23._ge4nu5.xlsx', { unsafeMime: true });
            //location
            // message = 'https://www.google.com/maps/place/AGARSON+SAFETY+SHOE/@28.6909549,76.95733,15z/data=!4m6!3m5!1s0x390d09e89161e923:0x7bf949116c2efe71!8m2!3d28.6909549!4d76.95733!16s%2Fg%2F11c56q_2n3?entry=ttu'
            // message = await client.getContactById(`919****412@c.us`)
            if (from) {
                const result = await
                client.sendMessage(from._serialized, message)
                console.log("sent message", result)
            } else {
                console.log(from, `${from} is not registered`)
            }
        }
    }
    catch (err) {
        console.log(err)
    }
}