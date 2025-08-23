import nodemailer from "nodemailer" ; 


const transporter = nodemailer.createTransport({
    host: 'smtp.relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

export default transporter;



//ab authcontroller mai ja kr hume welcome mail bhejne ka code likhna hoga uske liye ek  object bnana hoga fir uss object ko iss transporter,sendMail() mai call krenge

