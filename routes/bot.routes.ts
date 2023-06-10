import express from "express";
import {isAuthenticatedUser } from "../middlewares/auth.middleware";
import {  SetUpWhatsappProfile } from "../controllers/bot.controller";

const router = express.Router()

router.route("/setup/whatsapp/:client_id").post(isAuthenticatedUser, SetUpWhatsappProfile)


export default router

