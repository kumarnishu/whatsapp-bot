import express from "express";
import { isAdmin, isAuthenticatedUser, } from "../middlewares/auth.middleware";
import { BlockUser, GetProfile, GetUsers, Login, Logout, MakeAdmin, NewUser, RemoveAdmin, ResetPassword, SendPasswordResetMail, SendVerifyEmail, SignUp, UnBlockUser, UpdateProfile, UpdateUser, VerifyEmail, updatePassword } from "../controllers/user.controller";

const router = express.Router()


router.post("/signup", SignUp)
router.route("/users")
    .get(isAuthenticatedUser, GetUsers)
    .post(isAuthenticatedUser, isAdmin, NewUser)
router.route("/users/:id")
    .put(isAuthenticatedUser, isAdmin, UpdateUser)
router.patch("/make-admin/user/:id", isAuthenticatedUser, isAdmin, MakeAdmin)
router.patch("/block/user/:id", isAuthenticatedUser, isAdmin, BlockUser)
router.patch("/unblock/user/:id", isAuthenticatedUser, isAdmin, UnBlockUser)
router.patch("/remove-admin/user/:id", isAuthenticatedUser, isAdmin, RemoveAdmin)
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