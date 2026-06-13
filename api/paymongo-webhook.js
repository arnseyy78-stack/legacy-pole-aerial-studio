export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const event = req.body;
    const eventId = event?.data?.id;
    const eventType = event?.data?.attributes?.type;

    const attributes =
      event?.data?.attributes?.data?.attributes ||
      event?.data?.attributes ||
      {};

    const metadata = attributes?.metadata || {};

    const studentEmail = metadata?.studentEmail;
    const packageName = metadata?.packageName;

    const packageCredits =
      packageName === "Single Pass" ? 1 :
      packageName === "Class Card" ? 5 :
      0;

    console.log("WEBHOOK DEBUG:", {
      eventId,
      eventType,
      metadata,
      studentEmail,
      packageName,
      packageCredits
    });

    if (!studentEmail || !packageName || packageCredits <= 0) {
      return res.status(200).json({ received: true, skipped: "missing data" });
    }

    const check = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/payment_events?event_id=eq.${eventId}`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    const existing = await check.json();

    if (existing.length > 0) {
      return res.status(200).json({ received: true, skipped: "already processed" });
    }

    const studentRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/students?email=eq.${encodeURIComponent(studentEmail)}`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    const students = await studentRes.json();
    const student = students[0];

    if (!student) {
      return res.status(200).json({ received: true, skipped: "student not found" });
    }

    const updatedCredits = (Number(student.credits) || 0) + packageCredits;

    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/students?email=eq.${encodeURIComponent(studentEmail)}`,
      {
        method: "PATCH",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ credits: updatedCredits })
      }
    );

    await fetch(`${process.env.SUPABASE_URL}/rest/v1/payment_events`, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event_id: eventId,
        student_email: studentEmail,
        package_name: packageName,
        credits_added: packageCredits
      })
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("Webhook error:", error);
    return res.status(500).json({ error: error.message });
  }
}
