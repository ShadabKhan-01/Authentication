import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import User from '@/model/userModel';

const verifySubject = "Please click the link below to verify your email address";
const forgotSubject = "Please click the link below to change your password";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {

        const hasedToken = bcrypt.hashSync(userId.toString(), 10);

        if (emailType === "verify") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                verifyToken: hasedToken,
                verifyTokenExpiry: Date.now() + 20 * 60 * 1000, // 10 minutes
                }
            })
        } else if (emailType === "forgot") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswrodToken: hasedToken,
                forgotPasswrodTokenExpiry: Date.now() + 20 * 60 * 1000, // 10 minutes
            })
        }

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "8fd0fdd95b5511", // ❌
                pass: "553fb3c73c21ed" // ❌
            }
        });

        const mailOptions = {
            from: 'kd803039@gmail.com',
            to: email,
            subject: emailType === "verify" ? verifySubject : forgotSubject,
            // text: "Hello world?", // plain‑text body
            html: `<p>click <a href="${process.env.Domain}/verifyemail?token=${hasedToken}&email=${email}">here </a>or go to link : "${process.env.Domain}/verifyemail?token=${hasedToken}&email=${email}"</p>`, // HTML body
        }

        const mailresponse = await transporter.sendMail(mailOptions);
        return mailresponse;
    } catch (error) {
        console.error("Error sending email:", error);
    }
}