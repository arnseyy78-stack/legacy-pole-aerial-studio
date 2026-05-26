export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed"
      });
    }

    const {
      studentName,
      studentEmail,
      packageName,
      className,
      amount,
      credits,
      expiry
    } = req.body;

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Legacy Studio <onboarding@resend.dev>",
          to: [studentEmail],
          bcc: ["legacy.pole.aerial@gmail.com"],
          subject: "Booking Confirmation",
          html: `
            <div>
              <h2>Legacy Pole & Aerial Studio</h2>

              <p>Hi ${studentName},</p>

              <p>Your booking has been confirmed.</p>

              <p><b>Package:</b> ${packageName}</p>
              <p><b>Class:</b> ${className}</p>
              <p><b>Amount:</b> ${amount}</p>
              <p><b>Credits:</b> ${credits}</p>
              <p><b>Expiry:</b> ${expiry}</p>
            </div>
          `
        })
      }
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
