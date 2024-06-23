import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";
import { v4 as uuidv4 } from 'uuid';
import { User } from "../models/user.model.js";

const sendEmail = async ({ email, userId }) => {
    try {
        const uniqueToken = uuidv4();


        await User.findByIdAndUpdate(userId,
            { verifyToken: uniqueToken, verifyTokenExpiry: Date.now() + 3600000 });


        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "5b6de6a76f0fa4",
                pass: "b2119434eceea7"
            }
        });

        const url = `${process.env.DOMAIN}/verify-email?token=${uniqueToken}`;
        const mailOptions = {
            from: 'kishanverma@email.com',
            to: email,
            subject: "Verification Email",
            html: `<p>Click <a href="${url}">here</a> to Verify your email
            or copy and paste the link below in your browser. <br> ${url}
            </p>`
        }

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error) {
        throw new ApiError(400, "Invalid Email Request")
    }
}

export { sendEmail }