import { Socket } from "socket.io";
import { Request } from "express";
import venom from "venom-bot"
import { ControlMessage } from "./ControlMessage";


let  client: venom.Whatsapp | undefined = undefined;

export const ConectWhatsapp = async (req: Request, client_id: string, socket: Socket) => {
   await venom.create(client_id).then((cl) => {
        client = cl
        Start(cl)
    }).catch((Err) => console.log(Err))

    function Start(client: venom.Whatsapp) {
        client.onMessage((message) => {
            if (message.body === 'Hi' && message.isGroupMsg === false) {
                ControlMessage(message)
                client
                    .sendText(message.from, 'Welcome Venom 🕷')
                    .then((result) => {
                        console.log('Result: ', result); //return object success
                    })
                    .catch((erro) => {
                        console.error('Error when sending: ', erro); //return object error
                    });
            }
        });
    }
}

export {client}