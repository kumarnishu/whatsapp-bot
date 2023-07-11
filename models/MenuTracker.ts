import mongoose from "mongoose"
import { IMenuTracker } from "../types/flow.types"


const MenuTrackerSchema = new mongoose.Schema<IMenuTracker, mongoose.Model<IMenuTracker, {}, {}>, {}>({
    phone_number: {
        type: String,
        required: true,
        index: true
    },
    bot_number: {
        type: String,
        required: true,
    },
    menu_id: {
        type: String,
        required: true,
        index: true,
        lowercase: true,
    },
    joined_at: {
        type: Date,
        default: new Date(),

    },
    last_active: {
        type: Date,
        default: new Date(),

    },
    flow: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flow',
        required: true
    },
})

export const MenuTracker = mongoose.model<IMenuTracker, mongoose.Model<IMenuTracker, {}, {}>>("MenuTracker", MenuTrackerSchema)
