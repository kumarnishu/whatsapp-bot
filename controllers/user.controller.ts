import { NextFunction, Request, Response } from 'express';
import isEmail from "validator/lib/isEmail";
import isMongoId from "validator/lib/isMongoId";
import { User } from '../models/User';
import { sendEmail } from '../utils/SendEmail';
import { TUserBody } from '../types/user.types';
import { AuthenticateUser } from '../middlewares/auth.middleware';


// Create Owner account
export const SignUp =
    async (req: Request, res: Response, next: NextFunction) => {
        let { username, email, password, mobile, whatsapp } = req.body as TUserBody
        // validations
        if (!username || !email || !password || !mobile || !whatsapp)
            return res.status(400).json({ message: "fill all the required fields" });
        if (!isEmail(email))
            return res.status(400).json({ message: "please provide valid email" });

        if (await User.findOne({ username: username.toLowerCase().trim() }))
            return res.status(403).json({ message: `${username} already exists` });
        if (await User.findOne({ email: email.toLowerCase().trim() }))
            return res.status(403).json({ message: `${email} already exists` });
        if (await User.findOne({ mobile: String(mobile).toLowerCase().trim() }))
            return res.status(403).json({ message: `${mobile} already exists` });
        let users = await User.find()
        if (users.length > 0) {
            return res.status(403).json({ message: "Not Allowed Here" });
        }
        let owner = new User({
            username,
            password,
            email,
            mobile,
            is_admin: true,
            whatsapp: {
                client_id: whatsapp.client_id.replace(/\s/g, ''),
                is_active: false
            }
        })

        owner.created_by = owner
        owner.updated_by = owner
        await owner.save()
        AuthenticateUser(req, res, owner)
    }

// create normal user 
export const NewUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
        return res.status(403).json({ message: "please login to access this resource" })
    let { username, email, mobile, password } = req.body as TUserBody;
    // validations
    if (!username || !email || !password || !mobile)
        return res.status(400).json({ message: "fill all the required fields" });
    if (!isEmail(email))
        return res.status(400).json({ message: "please provide valid email" });


    if (await User.findOne({ username: username.toLowerCase().trim() }))
        return res.status(403).json({ message: `${username} already exists` });

    if (await User.findOne({ email: email.toLowerCase().trim() }))
        return res.status(403).json({ message: `${email} already exists` });
    if (await User.findOne({ mobile: String(mobile).toLowerCase().trim() }))
        return res.status(403).json({ message: `${mobile} already exists` });

    const user = new User({
        username,
        email,
        password,
        mobile,
        created_by: req.user,
        updated_by: req.user,
    })
    await user.save()
    return res.status(201).json(user)

}

// login
export const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body as TUserBody & { username: string };
    if (!username)
        return res.status(400).json({ message: "please enter username or email" })
    if (!password)
        return res.status(400).json({ message: "please enter password" })

    let user = await User.findOne({
        username: String(username).toLowerCase().trim(),
    }).select("+password").populate("created_by").populate("updated_by")
    if (!user) {
        user = await User.findOne({
            email: String(username).toLowerCase().trim(),
        }).select("+password").populate("created_by").populate("updated_by")
        if (user)
            if (!user.email_verified)
                return res.status(403).json({ message: "please verify email id before login" })
    }
    if (!user)
        return res.status(403).json({ message: "Invalid username or password" })
    if (!user.is_active)
        return res.status(401).json({ message: "you are blocked, contact admin" })
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched)
        return res.status(403).json({ message: "Invalid username or password" })
    user.last_login = new Date()
    await user.save()
    AuthenticateUser(req, res, user)
}


// update user only admin can do
export const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    let { email, username, mobile } = req.body as TUserBody;
    if (!username || !email || !mobile)
        return res.status(400).json({ message: "fill all the required fields" });
    //check username
    if (username !== user.username) {
        if (await User.findOne({ username: String(username).toLowerCase().trim() }))
            return res.status(403).json({ message: `${username} already exists` });
    }
    // check mobile
    if (mobile != user.mobile) {
        if (await User.findOne({ mobile: String(mobile).toLowerCase().trim() }))
            return res.status(403).json({ message: `${mobile} already exists` });
    }
    //check email
    if (email !== user.email) {
        if (await User.findOne({ email: String(email).toLowerCase().trim() }))
            return res.status(403).json({ message: `${email} already exists` });
    }
    // check first owner to update himself
    if ((String(user.created_by) === String(user._id)))
        if ((String(user.created_by) !== String(req.user?._id)))
            return res.status(403).json({ message: "not allowed contact  administrator" })

    //handle dp

    if (email !== user.email) {
        await User.findByIdAndUpdate(user.id, {
            email, username,
            email_verified: false
        })
            .then(() => { return res.status(200).json({ message: "user updated" }) })
    }
    await User.findByIdAndUpdate(user.id, {
        email,
        username,
        mobile,
        updated_by: req.user?._id,
        updated_at: new Date(),
    }).then(() => res.status(200).json({ message: "user updated" }))
}


// get all users only admin can do
export const GetUsers =
    async (req: Request, res: Response, next: NextFunction) => {
        const users = await User.find().populate("created_by").populate("updated_by")
        res.status(200).json(users)
    }

// logout
export const Logout = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.data)
        return res.status(200).json({ message: "already logged out" })
    req.session.destroy(() => {
        console.log(req.session)
    })
    return res.status(200).json({ message: "logged out" })
}

// get profile
export const GetProfile = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user
    if (user)
        user = await User.findById(user._id)
    if (user)
        return res.status(200).json(user)
    else
        return res.status(400).json({ message: "login again ! session expired" })
}
//update profile 
export const UpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
    let user = await User.findById(req.user?._id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    let { email, mobile } = req.body as TUserBody;
    if (!email || !mobile) {
        return res.status(400).json({ message: "please fill required fields" })
    }

    if (mobile != user.mobile) {
        if (await User.findOne({ mobile: String(mobile).toLowerCase().trim() }))
            return res.status(403).json({ message: `${mobile} already exists` });
    }
    //check email
    if (email !== user.email) {
        if (await User.findOne({ email: String(email).toLowerCase().trim() }))
            return res.status(403).json({ message: `${email} already exists` });
    }


    if (email != user.email) {
        await User.findByIdAndUpdate(user.id, {
            email,
            mobile,
            email_verified: false,
            updated_by: user.id
        })
            .then(() => { return res.status(200).json({ message: "profile updated" }) })
    }
    await User.findByIdAndUpdate(user.id, {
        email,
        mobile,
        updated_by: user._id
    })
        .then(() => res.status(200).json({ message: "profile updated" }))
}

//update password
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword, confirmPassword } = req.body as TUserBody & { oldPassword: string, newPassword: string, confirmPassword: string };
    if (!oldPassword || !newPassword || !confirmPassword)
        return res.status(400).json({ message: "please fill required fields" })
    if (confirmPassword == oldPassword)
        return res.status(403).json({ message: "new password should not be same to the old password" })
    if (newPassword !== confirmPassword)
        return res.status(403).json({ message: "new password and confirm password not matched" })
    let user = await User.findById(req.user?._id).select("+password")
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched)
        return res.status(401).json({ message: "Old password is incorrect" })
    user.password = newPassword;
    user.updated_by = user
    await user.save();
    res.status(200).json({ message: "password updated" });
}

// make admin
export const MakeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    if (user.is_admin)
        return res.status(404).json({ message: "already a admin" })
    user.is_admin = true
    if (req.user)
        user.updated_by = req.user
    await user.save();
    res.status(200).json({ message: "admin role provided successfully" });
}


// block user
export const BlockUser = async (req: Request, res: Response, next: NextFunction) => {
    //update role of user
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    if (!user.is_active)
        return res.status(404).json({ message: "user already blocked" })

    if (String(user.created_by._id) === String(user._id))
        return res.status(403).json({ message: "not allowed contact crm administrator" })
    if (String(user._id) === String(req.user?._id))
        return res.status(403).json({ message: "not allowed this operation here, because you may block yourself" })
    user.is_active = false
    if (req.user)
        user.updated_by = req.user
    await user.save();
    res.status(200).json({ message: "user blocked successfully" });
}
// unblock user
export const UnBlockUser = async (req: Request, res: Response, next: NextFunction) => {
    //update role of user
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    if (user.is_active)
        return res.status(404).json({ message: "user is already active" })
    user.is_active = true
    if (req.user)
        user.updated_by = req.user
    await user.save();
    res.status(200).json({ message: "user unblocked successfully" });
}

// remove admin
export const RemoveAdmin = async (req: Request, res: Response, next: NextFunction) => {
    //update role of user
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    if (String(user.created_by._id) === String(user._id))
        return res.status(403).json({ message: "not allowed contact administrator" })
    if (String(user._id) === String(req.user?._id))
        return res.status(403).json({ message: "not allowed this operation here, because you may harm yourself" })
    user = await User.findById(id)
    if (!user?.is_admin)
        res.status(400).json({ message: "you are not an admin" });
    await User.findByIdAndUpdate(id, {
        is_admin: false,
        updated_by: req.user
    })
    res.status(200).json({ message: "admin role removed successfully" });
}

// sending password reset mail controller
export const SendPasswordResetMail = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    if (!email) return res.status(400).json({ message: "please provide email id" })
    const userEmail = String(email).toLowerCase().trim();
    if (!isEmail(userEmail))
        return res.status(400).json({ message: "provide a valid email" })
    const user = await User.findOne({ email: userEmail });
    if (!user)
        return res.status(404).json({ message: "you have no account with this email id" })
    const resetToken = await user.getResetPasswordToken();
    await user.save();
    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n valid for 15 minutes only \n\n\n\nIf you have not requested this email then, please ignore it.`;
    const options = {
        to: user.email,
        subject: `Password Recovery`,
        message: message,
    };
    let response = await sendEmail(options);
    if (response) {
        return res.status(200).json({
            message: `Email sent to ${user.email} successfully`,
        })
    }
    else {
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();
        return res.status(500).json({ message: "email could not be sent, something went wrong" })
    }
}
// reset password controller
export const ResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    let resetPasswordToken = req.params.token;
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword)
        return res.status(400).json({ message: "Please fill all required fields " })
    if (newPassword !== confirmPassword)
        return res.status(400).json({ message: "passwords do not matched" })
    let user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user)
        return res.status(403).json({ message: "Reset Password Token is invalid or has been expired" })

    user.password = req.body.newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    res.status(200).json({ message: "password updated" });
}
// send verification mail controller
export const SendVerifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    if (!email)
        return res.status(400).json({ message: "please provide your email id" })
    const userEmail = String(email).toLowerCase().trim();
    if (!isEmail(userEmail))
        return res.status(400).json({ message: "provide a valid email" })
    const user = await User.findOne({ email: userEmail });
    if (!user)
        return res.status(404).json({ message: "you have no account with this email id" })
    const verifyToken = await user.getEmailVerifyToken();
    await user.save();
    const emailVerficationUrl = `${req.protocol}://${req.get(
        "host"
    )}/email/verify/${verifyToken}`;
    const message = `Your email verification link is :- \n\n ${emailVerficationUrl} \n\n valid for 15 minutes only \n\nIf you have not requested this email then, please ignore it.`;
    const options = {
        to: user.email,
        subject: `CRM Email Verification`,
        message,
    };

    let response = await sendEmail(options);
    if (response) {
        return res.status(200).json({
            message: `Email sent to ${user.email} successfully`,
        })
    }
    else {
        user.emailVerifyToken = null;
        user.emailVerifyExpire = null;
        await user.save();
        return res.status(500).json({ message: "email could not be sent, something went wrong" })
    }
}
// verify mail controller
export const VerifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const emailVerifyToken = req.params.token;
    let user = await User.findOne({
        emailVerifyToken,
        emailVerifyExpire: { $gt: Date.now() },
    });
    if (!user)
        return res.status(403).json({ message: "Email verification Link  is invalid or has been expired" })
    user.email_verified = true;
    user.emailVerifyToken = null;
    user.emailVerifyExpire = null;
    await user.save();
    res.status(200).json({
        message: `congrats ${user.email} verification successful`
    });
}