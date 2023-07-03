import express from "express";
import {isAdmin, isAuthenticatedUser } from "../middlewares/auth.middleware";
import {  CreateFlow, DestroyFlow, GetFlows, SetUpWhatsappProfile } from "../controllers/bot.controller";

const router = express.Router()

router.route("/setup/whatsapp").post(isAuthenticatedUser, isAdmin, SetUpWhatsappProfile)
router.route("/flows").get(isAuthenticatedUser, isAdmin, GetFlows)
router.route("/flows").post(isAuthenticatedUser, isAdmin, CreateFlow)
router.route("/flows/:id").delete(isAuthenticatedUser, isAdmin,DestroyFlow)


export default router

