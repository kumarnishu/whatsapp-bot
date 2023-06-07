import nodemailer from "nodemailer";

export const sendEmail = async (options: {
    to: string,
    subject: string,
    message: string
}) => {
    let host = String(process.env.EMAIL_HOST)
    let port = Number(process.env.EMAIL_PORT)
    let service = String(process.env.EMAIL_SERVICE)
    let app_email = String(process.env.APP_EMAIL)
    let pass = String(process.env.APP_EMAIL_PASSWORD)
    try {

        const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            service: service,
            auth: {
                user: app_email,
                pass: pass
            },
        });

        const mailOptions = {
            from: app_email,
            to: options.to,
            subject: options.subject,
            text: options.message,
        };
        await transporter.sendMail(mailOptions)
        return true
    }
    catch (err) {
        console.log("error", err);
        return false
    }
}