import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOtpMail = async (toEmail, otp) => {
  try {
    const mailOptions = {
      from: `"Nestro Furniture" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: "Verify Your Email - OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>Email Verification</h2>

          <p>Your OTP code is:</p>

          <h1 style="letter-spacing:4px; color:#2563eb;">
            ${otp}
          </h1>

          <p>This OTP is valid for <b>3 minutes</b>.</p>

          <p>If you didn't request this email, please ignore it.</p>

          <hr>

          <small>Nestro Furniture Team</small>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email Sent:", info.messageId);

    return "OTP Email sent successfully";
  } catch (error) {
    console.error("Mail Error:", error);

    return "Email sending failed: " + error.message;
  }
};

export default sendOtpMail;