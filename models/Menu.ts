import mongoose from "mongoose"
import { IMenu } from "../types/flow.types"


const MenuSchema = new mongoose.Schema<IMenu, mongoose.Model<IMenu, {}, {}>, {}>({
    is_main: {
        type: Boolean,
        required: true,
        default: false
    },
    menu_items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    }]
})

export const Menu = mongoose.model<IMenu, mongoose.Model<IMenu, {}, {}>>("Menu", MenuSchema)