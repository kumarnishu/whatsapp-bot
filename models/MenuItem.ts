import mongoose from "mongoose"
import { IMenuItem } from "../types/flow.types"


const MenuItemSchema = new mongoose.Schema<IMenuItem, mongoose.Model<IMenuItem, {}, {}>, {}>({
    index: {
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true
    },
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply',
        required: true
    }
})

export const MenuItem = mongoose.model<IMenuItem, mongoose.Model<IMenuItem, {}, {}>>("MenuItem", MenuItemSchema)