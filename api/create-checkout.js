export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { packageName, amount, studentName, studentEmail, className } = req.body;

    const response = await fetch("https://api.paymongo.com/v2/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
success_url: "https://legacypolestudio.com/?paid=true",
cancel_url: "https://legacypolestudio.com/?cancelled=true",
            payment_method_types: ["qrph"],
            line_items: [
              {
                currency: "PHP",
                amount: amount,
                name: packageName,
                quantity: 1
              }
            ],
            description: `${studentName} - ${className}`,
            metadata: {
              studentName,
              studentEmail,
              className,
              packageName
            }
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json(data);
    }

    return res.status(200).json({
      checkoutUrl: data.data.attributes.checkout_url
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
