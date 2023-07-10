import { createWhatsappClient } from "./CreateWhatsappClient";
import { Request } from "express";
import { Socket } from "socket.io";

export const ConectWhatsapp = async (req: Request, client_id: string, client_data_path: string, socket: Socket) => {
    try {
        createWhatsappClient(req, client_id, client_data_path, socket)
    }
    catch (err: any) {
        console.log(err.message)
    }
}
