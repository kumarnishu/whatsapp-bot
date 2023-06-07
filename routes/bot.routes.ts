import express from "express";
import {isAuthenticatedUser } from "../middlewares/auth.middleware";
import { LogoutWhatsapp, SetUpWhatsappProfile } from "../controllers/bot.controller";

const router = express.Router()

router.route("/setup/whatsapp/:client_id").post(isAuthenticatedUser, SetUpWhatsappProfile)
router.route("/logout/whatsapp/:client_id").post(isAuthenticatedUser, LogoutWhatsapp)


export default router

