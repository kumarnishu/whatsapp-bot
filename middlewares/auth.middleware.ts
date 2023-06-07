import { Request, Response, NextFunction } from "express";
import { IUser } from "../types/user.types";
import { User } from "../models/User";


export const isAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session)
        return res.status(403).json({ message: "please login to access this resource" })
    if (!req.session.data)
        return res.status(403).json({ message: "login again ! session expired" })
    req.user = await User.findById(req.session.data.user_id)
    next();
};
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.is_admin)
        return next();
    return res.status(403).json({ message: "!must be admin" });
}

export async function AuthenticateUser(req: Request, res: Response, user: IUser) {
    if (user && user._id) {
        req.session.data = { user_id: user._id }
        req.session.save()
    }
    let tmpUser = await User.findById(req.session.data?.user_id)
    if (tmpUser) {
        req.user = tmpUser
        return res.status(201).json(tmpUser)
    }
    if (!tmpUser) {
        return res.status(403).json({ message: "login again ! session expired" })
    }
}