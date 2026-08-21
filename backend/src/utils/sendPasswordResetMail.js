import nodemailer from "nodemailer";

const sendPasswordResetMail = async (toEmail, resetUrl) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Nestro Furniture" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: "Reset your Nestro password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #281C19;">
          <h2>Reset your password</h2>
          <p>We received a request to reset your Nestro account password.</p>
          <p><a href="${resetUrl}" style="display: inline-block; background: #8C6239; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset password</a></p>
          <p>This link expires in 15 minutes. If you did not request it, you can safely ignore this email.</p>
        </div>
      `,
    });

    return "Password reset email sent successfully";
  } catch (error) {
    console.error("Password reset mail error:", error);
    return "Password reset email sending failed: " + error.message;
  }
};

export default sendPasswordResetMail;
