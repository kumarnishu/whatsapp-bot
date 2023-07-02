import mongoose from "mongoose"
import { IFlow } from "../types/flow.types"
import { FlowNode } from "typescript"


const FlowSchema = new mongoose.Schema<IFlow, mongoose.Model<IFlow, {}, {}>, {}>({
    flow_name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    },
    nodes: [{ type: Object }],
    edges: [{ type: Object }],
    trigger_keywords: {
        type: String,
        required: true,
        index: true,
        lowercase: true,
    },
    created_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const Flow = mongoose.model<IFlow, mongoose.Model<IFlow, {}, {}>>("Flow", FlowSchema)
