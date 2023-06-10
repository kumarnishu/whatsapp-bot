import { Request, Response, NextFunction } from "express";
import { ConectWhatsapp } from "../utils/ConnectWhatsapp";
import { AppSocket } from "..";

export const SetUpWhatsappProfile = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.client_id
    if (!id) {
        return res.status(404).json({ message: "whatsapp session id not found" })
    }
    if (AppSocket && id) {
        try {
            await ConectWhatsapp(req, id, AppSocket)
        }
        catch (err: any) {
            console.log(err)
            return res.status(500).json({ message: "error while logged out" })
        }

    }
    return res.status(200).json({ message: "whatsapp connected" })

}



