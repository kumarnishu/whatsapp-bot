import mongoose from "mongoose"
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { IUser, IUserMethods } from "../types/user.types";

const UserSchema = new mongoose.Schema<IUser, mongoose.Model<IUser, {}, IUserMethods>, IUserMethods>({
    username: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false,
    },
    mobile: {
        type: String,
        trim: true,
        index: true,
        required: true,
    },

    is_admin: {
        type: Boolean,
        default: false,
        required: true,
    },
    email_verified: {
        type: Boolean,
        default: false,
        required: true
    },
    connected_number:{
        type: Number,
    },
    is_active: {
        type: Boolean,
        default: true,
        required: true,

    },
    is_whatsapp_active:{
        type: Boolean,
        default: false,
    },
    last_login: {
        type: Date,
        default: new Date(),
        required: true,

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
    client_id: {
        type: String,
        trim: true,
        required: true
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpire: {
        type: Date,
        default: null
    },
    emailVerifyToken: {
        type: String,
        default: null
    },
    emailVerifyExpire: {
        type: Date,
        default: null
    },
})

// hashing passwords
UserSchema.pre('save', async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10)
});


// Compare Password
UserSchema.method("comparePassword", function (password: string) {
    return bcrypt.compare(password, this.password);
})
// Generating Password Reset Token
UserSchema.method("getResetPasswordToken", function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = resetToken
    this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    return resetToken;
})
//generating email verification token
UserSchema.method("getEmailVerifyToken", function () {
    const emailToken = crypto.randomBytes(32).toString('hex');
    this.emailVerifyToken = emailToken
    this.emailVerifyExpire = new Date(Date.now() + 15 * 60 * 1000);
    return emailToken;
})

export const User = mongoose.model<IUser, mongoose.Model<IUser, {}, IUserMethods>>("User", UserSchema)