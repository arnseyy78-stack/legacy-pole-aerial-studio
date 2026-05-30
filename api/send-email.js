export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      studentEmail,
      studentName,
      packageName,
      className,
      amount,
      credits,
      expiry
      type
    } = req.body;

    const isClassBooking =
      className &&
      className !== "No class selected" &&
      className !== "Test package selected" &&
      className !== "Awaiting Class Booking";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Legacy Pole Studio <bookings@legacypolestudio.com>",
        reply_to: "legacycavitepoleaerialstudio@gmail.com",
        to: [studentEmail],
        bcc: ["legacycavitepoleaerialstudio@gmail.com"],
        subject: 
            type === "waitlist"
    ? "Waitlist Confirmation"
          : isClassBooking
          ? "Class Booking Confirmation"
          : "Package Purchase Confirmation",
        html: `
          <h2>Legacy Pole & Aerial Studio</h2>

          <p>Hi ${studentName || "Student"},</p>

          ${
  type === "waitlist"
    ? `
      <p>You have been added to the waitlist.</p>
      <p><b>Class:</b> ${className}</p>
      <p><b>Date:</b> ${expiry}</p>
      <p>We will contact you if a spot becomes available.</p>
    `
    : isClassBooking
              ? `
                <p>Your booking has been confirmed.</p>
                <p><b>Package:</b> ${packageName}</p>
                <p><b>Class:</b> ${className}</p>
                <p><b>Amount:</b> ${amount}</p>
                <p><b>Credits:</b> ${credits}</p>
                <p><b>Expiry:</b> ${expiry}</p>
              `
              : `
                <p>Your purchase has been confirmed.</p>
                <p><b>Package:</b> ${packageName}</p>
                <p><b>Amount:</b> ${amount}</p>
                <p><b>Credits:</b> ${credits}</p>
                <p><b>Expiry:</b> ${expiry}</p>
              `
          }

          <br/>

          <p>
            Thank you for booking with Legacy Pole & Aerial Studio 💜
          </p>
        `
      })
    });

    const data = await response.json();

    console.log("RESEND RESPONSE:", data);

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
