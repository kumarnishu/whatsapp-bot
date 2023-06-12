import mongoose from "mongoose"
import { IReply } from "../types/flow.types"


const ReplySchema = new mongoose.Schema<IReply, mongoose.Model<IReply, {}, {}>, {}>({
    reply: [
        {
            type: {
                type:String,
                required:true
            },
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ReplyItem',
                required: true
            }
        }
    ]
})

export const Reply = mongoose.model<IReply, mongoose.Model<IReply, {}, {}>>("Reply", ReplySchema)