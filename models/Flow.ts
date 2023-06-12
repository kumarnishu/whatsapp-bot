import mongoose from "mongoose"
import { IFlow } from "../types/flow.types"


const FlowSchema = new mongoose.Schema<IFlow, mongoose.Model<IFlow, {}, {}>, {}>({
    flow_name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    },
    menus: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    }]
    
})

export const Flow = mongoose.model<IFlow, mongoose.Model<IFlow, {}, {}>>("Flow",FlowSchema)