import express from "express";
import {isAdmin, isAuthenticatedUser } from "../middlewares/auth.middleware";
import {  SetUpWhatsappProfile } from "../controllers/bot.controller";

const router = express.Router()

router.route("/setup/whatsapp").post(isAuthenticatedUser,isAdmin, SetUpWhatsappProfile)


export default router

