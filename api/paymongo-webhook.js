export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const event = req.body;
    const eventId = event?.data?.id;
    const eventType = event?.data?.attributes?.type;

    if (eventType !== "checkout_session.payment.paid") {
      return res.status(200).json({ received: true, skipped: eventType });
    }

    const checkout = event?.data?.attributes?.data?.attributes || {};
    const metadata = checkout?.metadata || {};

    const studentEmail = metadata?.studentEmail;
    const packageName = metadata?.packageName;

    const packageCredits =
      packageName === "Single Pass" ? 1 :
      packageName === "Class Card" ? 5 :
      0;

    console.log("WEBHOOK DEBUG:", {
      eventId,
      eventType,
      studentEmail,
      packageName,
      packageCredits
    });

    if (!eventId || !studentEmail || !packageName || packageCredits <= 0) {
      return res.status(200).json({ received: true, skipped: "missing required data" });
    }

    const headers = {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json"
    };

    const existingRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/payment_events?event_id=eq.${eventId}`,
      { headers }
    );

    const existing = await existingRes.json();

    if (existing.length > 0) {
      return res.status(200).json({ received: true, skipped: "already processed" });
    }

    const studentRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/students?email=eq.${encodeURIComponent(studentEmail)}`,
      { headers }
    );

    const students = await studentRes.json();

console.log("STUDENT LOOKUP:", students);

if (!students || students.length === 0) {
  console.log("Student not found:", studentEmail);

  return res.status(200).json({
    received: true,
    skipped: "student not found"
  });
}

const student = students[0];
    const updatedCredits = (Number(student.credits) || 0) + packageCredits;

    const updateRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/students?email=eq.${encodeURIComponent(studentEmail)}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          Prefer: "return=representation"
        },
        body: JSON.stringify({ credits: updatedCredits })
      }
    );

    const updateText = await updateRes.text();

    if (!updateRes.ok) {
      console.log("Student credit update failed:", updateText);
      return res.status(500).json({ error: "credit update failed", details: updateText });
    }

    const logRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/payment_events`,
      {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "return=representation"
        },
        body: JSON.stringify({
          event_id: eventId,
          student_email: studentEmail,
          package_name: packageName,
          credits_added: packageCredits
        })
      }
    );

    const logText = await logRes.text();

    if (!logRes.ok) {
      console.log("Payment event insert failed:", logText);
      return res.status(500).json({ error: "payment event insert failed", details: logText });
    }

    console.log("WEBHOOK SUCCESS:", {
      studentEmail,
      packageName,
      creditsAdded: packageCredits,
      updatedCredits
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("Webhook error:", error);
    return res.status(500).json({ error: error.message });
  }
}
