const nodemailer = require("nodemailer");

exports.sendResetEmail = async (email, name, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: false, // use TLS if port is 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const message = `
      <p>Hello ${name},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>This link expires in 30 minutes.</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: message, // <-- use html instead of text
    });

    console.log(`Password reset email sent to ${email}`);
  } catch (err) {
    console.error("sendResetEmail error:", err);
    throw err;
  }
};
