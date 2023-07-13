import express from "express";
import { isAdmin, isAuthenticatedUser } from "../middlewares/auth.middleware";
import { CreateFlow, DestroyFlow, GetFlows, SetUpWhatsappProfile, StartBot, StopBot, UpdateFlow } from "../controllers/bot.controller";

const router = express.Router()

router.route("/setup/whatsapp").post(isAuthenticatedUser, isAdmin, SetUpWhatsappProfile)
router.route("/flows").get(isAuthenticatedUser, isAdmin, GetFlows)
router.route("/flows").post(isAuthenticatedUser, isAdmin, CreateFlow)
router.route("/flows/:id").delete(isAuthenticatedUser, isAdmin, DestroyFlow)
router.route("/flows/:id").put(isAuthenticatedUser, isAdmin, UpdateFlow)
router.route("/start/:id").put(isAuthenticatedUser, isAdmin, StartBot)
router.route("/stop/:id").put(isAuthenticatedUser, isAdmin, StopBot)


export default router

