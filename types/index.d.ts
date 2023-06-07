import { IUser } from "./user.types";

declare module "express-session" {
    interface SessionData {
        data:{
            user_id:string
        };
    }
}

declare declare global {
    namespace Express {
        export interface Request {
            user: IUser |null
        }
    }
}