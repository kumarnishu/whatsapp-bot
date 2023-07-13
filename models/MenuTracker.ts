import mongoose from "mongoose"
import { IMenuTracker } from "../types/flow.types"

const MenuTrackerSchema = new mongoose.Schema<IMenuTracker, mongoose.Model<IMenuTracker, {}, {}>, {}>({

    customer_name: {
        type: String,
        index: true
    },
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
    },
    is_active: {
        type: Boolean,
        default: true
    },
    flow: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flow',
        required: true
    },
    updated_at: {
        type: Date,
        default: new Date(),
        required: true
    }
})

export const MenuTracker = mongoose.model<IMenuTracker, mongoose.Model<IMenuTracker, {}, {}>>("MenuTracker", MenuTrackerSchema)
