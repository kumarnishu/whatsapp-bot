import { Request, Response, NextFunction } from "express";
import { ConectWhatsapp, client } from "../utils/ConnectWhatsapp";
import { AppSocket } from "..";
import { User } from "../models/User";

export const SetUpWhatsappProfile = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.whatsapp.client_id
    if (!id) {
        return res.status(404).json({ message: "whatsapp session id not found" })
    }
    if (AppSocket && id) {
        try {
            await ConectWhatsapp(req, id, AppSocket)
        }
        catch (err: any) {
            console.log(err)
            return res.status(500).json({ message: "error while setting whatsapp client" })
        }

    }
    return res.status(200).json({ message: "whatsapp connected" })

}

export const LogoutWhatsapp = async (req: Request, res: Response, next: NextFunction) => {
    let clientId = req.params.client_id
    if (!clientId) {
        return res.status(400).json({ message: "please provde client id" })
    }
    if (client) {
        try {
            await client.logout();
        }
        catch (err) { console.log(err)}
        if (req.user)
            await User.findByIdAndUpdate(req.user?._id, {
                whatsapp: { client_id: req.user.whatsapp.client_id, is_active: false }
            })
    }
    return res.status(200).json({ message: "whatsapp logged out" })
}

