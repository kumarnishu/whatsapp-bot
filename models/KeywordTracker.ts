import mongoose from "mongoose"
import { IKeywordTracker } from "../types/flow.types"

const KeywordTrackerSchema = new mongoose.Schema<IKeywordTracker, mongoose.Model<IKeywordTracker, {}, {}>, {}>({
    phone_number: {
        type: String,
        required: true,
        index: true
    },
    bot_number: {
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
    }
})

export const KeywordTracker = mongoose.model<IKeywordTracker, mongoose.Model<IKeywordTracker, {}, {}>>("KeywordTracker", KeywordTrackerSchema)
