export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Legacy Pole Studio <bookings@legacypolestudio.com>",
        to: ["legacycavitepoleaerialstudio@gmail.com"],
bcc: ["legacycavitepoleaerialstudio@gmail.com"],
        subject: "Legacy Pole & Aerial Studio Booking Confirmation",
        html: `
          <h2>Legacy Pole & Aerial Studio</h2>
          <p>Your booking has been confirmed.</p>
          <p>This is a Resend test email.</p>
        `
      })
    });

    const data = await response.json();

    console.log("RESEND RESPONSE:", data);

    if (!response.ok) {
      console.log("Resend failed:", data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.log("Email server error:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}
