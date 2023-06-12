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

export const CreateMenu = async (req: Request, res: Response, next: NextFunction)=>{
}
export const UpdateMenu = async (req: Request, res: Response, next: NextFunction)=>{
}
export const DeleteMenu = async (req: Request, res: Response, next: NextFunction)=>{
}

export const CreateMenuItem = async (req: Request, res: Response, next: NextFunction)=>{
}
export const DeleteMenuItem = async (req: Request, res: Response, next: NextFunction)=>{
}
export const UpdateMenuItem = async (req: Request, res: Response, next: NextFunction)=>{
}

export const CreateReply = async (req: Request, res: Response, next: NextFunction)=>{
}
export const DeleteReply = async (req: Request, res: Response, next: NextFunction)=>{
}
export const UpdateReply = async (req: Request, res: Response, next: NextFunction)=>{
}


export const CreateFlow = async (req: Request, res: Response, next: NextFunction)=>{
}

export const UpdateFlow = async (req: Request, res: Response, next: NextFunction) => {

}

export const DestroyFlow = async (req: Request, res: Response, next: NextFunction) => {

}