export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      studentName,
      studentEmail,
      packageName,
      className,
      amount,
      credits,
      expiry
    } = req.body;

    const studioEmail = "legacy.pole.aerial@gmail.com";

    const subject = "Legacy Pole & Aerial Studio Booking Confirmation";

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #222;">
        <h2>Legacy Pole & Aerial Studio</h2>
        <p>Hi ${studentName || "Student"},</p>
        <p>Your booking has been confirmed.</p>

        <div style="background:#f6f1ea;padding:20px;border-radius:14px;">
          <p><b>Package:</b> ${packageName}</p>
          <p><b>Class / Session:</b> ${className}</p>
          <p><b>Amount:</b> ${amount}</p>
          <p><b>Credits:</b> ${credits}</p>
          <p><b>Expiry:</b> ${expiry}</p>
        </div>

        <p>If this is a Practice Session or Private Class, please contact the studio to confirm your time schedule.</p>
        <p>Thank you for booking with Legacy Pole & Aerial Studio.</p>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Legacy Pole & Aerial Studio <onboarding@resend.dev>",
        to: [studentEmail],
        bcc: [studioEmail],
        subject,
        html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json(data);
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
