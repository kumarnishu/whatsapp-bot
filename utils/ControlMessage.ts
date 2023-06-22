import { Message } from "venom-bot";
import { client } from "./ConnectWhatsapp";

export const ControlMessage = async (message: Message) => {
    try {
        if (client) {
            const poll = {
                name: 'new poll',
                options: [
                    {
                        name: 'option 1'
                    },
                    {
                        name: 'option 2'
                    }
                ],
                selectableOptionsCount: 1
            };
            await client.sendPollCreation('917404293907@c.us', poll)
                .then((result) => {
                    console.log('Result: ', result); //return object success
                })
                .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
        }

    }
    catch (err) {
        console.log(err)
    }
}