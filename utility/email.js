const nodemailer = require('nodemailer')

require('dotenv').config()

//gmail transporter

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD
    }
  });

 async function  sendUserOTPEmail (email,otp){
    const mailOptions = {
        from: ` Recipe App ${process.env.GMAIL_USER}`,
        to:email,
        subject: 'Verify your Account',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <body style="font-family: Arial, sans-serif; background-color: #f0f2f5; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; text-align: center;">
                <h2 style="color: #333;"> Verify your Account </h2>
                <p style="font-size: 16px; color: #555;"> Use the OTP below to verify your account: </p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #4CAF50; margin: 20px 0;">
                ${otp}
                </p>
                <p style="font-size: 14px; color: #999;">This OTP is valid for 10 minutes.</p>
            </div>
            </body>
            </html>
        `,
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log(`Otp send to ${email}`)
    } catch (error) {
        console.error('Error sending account verefication email', error)
        throw error;
    }
}
module.exports={
sendUserOTPEmail
}
