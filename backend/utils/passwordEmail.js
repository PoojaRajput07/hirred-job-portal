import nodemailer from "nodemailer";
export const passwordEmail=async(email,subject,message)=>{
    const transporter=nodemailer.createTransport({
       host:"smtp.gmail.com",
       port:587,
       secure:false,
       auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASS
       }

    });
    await transporter.sendMail({
        from:process.env.EMAIL,
        to:email,
        text:message,
        subject
    })

}
