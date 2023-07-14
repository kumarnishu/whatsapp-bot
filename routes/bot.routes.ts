import express from "express";
import { isAdmin, isAuthenticatedUser } from "../middlewares/auth.middleware";
import { CreateFlow, DestroyFlow, GetFlows, GetTrackers, SetUpWhatsappProfile,  ToogleTrackerStatus, UpdateFlow, UpdateTrackerName } from "../controllers/bot.controller";

const router = express.Router()

router.route("/setup/whatsapp").post(isAuthenticatedUser, isAdmin, SetUpWhatsappProfile)
router.route("/flows").get(isAuthenticatedUser, isAdmin, GetFlows)
router.route("/flows").post(isAuthenticatedUser, isAdmin, CreateFlow)
router.route("/flows/:id").delete(isAuthenticatedUser, isAdmin, DestroyFlow)
router.route("/flows/:id").put(isAuthenticatedUser, isAdmin, UpdateFlow)
router.route("/trackers").get(isAuthenticatedUser, isAdmin, GetTrackers)
router.route("/trackers/:id").put(isAuthenticatedUser, isAdmin, UpdateTrackerName)
router.route("/toogle/:id").post(isAuthenticatedUser, isAdmin, ToogleTrackerStatus)


export default router

