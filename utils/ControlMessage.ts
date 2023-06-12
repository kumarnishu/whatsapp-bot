import WAWebJS, { Location, MessageMedia } from "whatsapp-web.js";
import { client } from "./ConnectWhatsapp";

export const ControlMessage = async (msg: WAWebJS.Message) => {
    console.log("recieved message:", msg)
    try {
        if (client) {
            const from = await client.getNumberId(msg.from); // get mobile number details
            let message: WAWebJS.MessageContent | undefined | Location;
            // message = await MessageMedia.fromUrl('https://res.cloudinary.com/dc56gnk0b/image/upload/v1686560829/MCA_NEW_2nd_semester_assignment_January_2023_c0lkly.pdf', { unsafeMime: true });
            //address
            message = new Location(28.699550, 76.919070,"Khasra no--26/2, opp. mie 764, near METRO PILLAR NO – 768, Part-A, MIE Part-A, Bahadurgarh, Haryana 124507")

            if (from) {
                const result = await client.sendMessage(from._serialized, message); // send message
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