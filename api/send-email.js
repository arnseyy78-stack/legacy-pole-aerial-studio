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

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Legacy Studio <onboarding@resend.dev>",
        to: [studentEmail],
        bcc: ["legacycavitepoleaerial@gmail.com"],
        subject: "Legacy Pole & Aerial Studio Booking Confirmation",
        html: `
          <h2>Legacy Pole & Aerial Studio</h2>
          <p>Hi ${studentName || "Student"},</p>
          <p>Your booking has been confirmed.</p>
          <p><b>Package:</b> ${packageName}</p>
          <p><b>Class:</b> ${className}</p>
          <p><b>Amount:</b> ${amount}</p>
          <p><b>Credits:</b> ${credits}</p>
          <p><b>Expiry:</b> ${expiry}</p>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Resend failed:", data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log("Email server error:", error);
    return res.status(500).json({ error: error.message });
  }
}
