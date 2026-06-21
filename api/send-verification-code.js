import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Missing email or code" });
    }

    const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

    await transporter.sendMail({
      from: `"Legacy Pole & Aerial Studio" <legacycavitepoleaerialstudio@gmail.com>`,
      to: email,
      subject: "Your Legacy verification code",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Legacy Pole & Aerial Studio</h2>
          <p>Your verification code is:</p>
          <h1>${code}</h1>
          <p>Enter this code on the website to activate your account.</p>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("Verification email error:", error);
    return res.status(500).json({ error: error.message });
  }
}
