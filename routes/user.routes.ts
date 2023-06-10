import express from "express";
import {isAuthenticatedUser, } from "../middlewares/auth.middleware";
import {  GetProfile,  Login, Logout,ResetPassword, SendPasswordResetMail, SendVerifyEmail, SignUp,  UpdateProfile,  VerifyEmail, updatePassword } from "../controllers/user.controller";

const router = express.Router()


router.post("/signup", SignUp)
router.route("/users")
router.post("/login", Login)
router.post("/logout", Logout)
router.route("/profile")
    .get(isAuthenticatedUser, GetProfile)
    .put(isAuthenticatedUser, UpdateProfile)
router.route("/password/update").patch(isAuthenticatedUser, updatePassword)
router.post("/email/verify", isAuthenticatedUser, SendVerifyEmail)
router.patch("/email/verify/:token", VerifyEmail)
router.post("/password/reset", SendPasswordResetMail)
router.patch("/password/reset/:token", ResetPassword)


export default router;