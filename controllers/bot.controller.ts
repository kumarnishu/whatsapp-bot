import { Request, Response, NextFunction } from "express";
import { ConectWhatsapp } from "../utils/ConnectWhatsapp";
import { AppSocket } from "..";

export const SetUpWhatsappProfile = async (req: Request, res: Response, next: NextFunction) => {
    const client_id = req.user?.client_id
    if (!client_id) {
        return res.status(404).json({ message: "whatsapp session id not found" })
    }
    if (AppSocket && client_id) {
        try {
            await ConectWhatsapp(req, client_id, AppSocket)
        }
        catch (err: any) {
            console.log(err)
            return res.status(500).json({ message: "error while Refresh Whatsapp,check internet" })
        }

    }
    return res.status(200).json({ message: "whatsapp connected" })

}



