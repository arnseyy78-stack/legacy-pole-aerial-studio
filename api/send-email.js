export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Legacy Studio <onboarding@resend.dev>",
      to: ["legacycavitepoleaerial@gmail.com"],
      subject: "Test Booking Confirmation",
      html: "<h2>Legacy Pole & Aerial Studio</h2><p>Test email works.</p>"
    })
  });

  const data = await response.json();

  console.log("RESEND RESPONSE:", data);

  return res.status(response.status).json(data);
}
