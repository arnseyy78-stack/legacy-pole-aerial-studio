export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const event = req.body;

const eventId =
  event?.data?.id ||
  event?.id;

const eventType =
  event?.data?.attributes?.type ||
  event?.type;

const checkout =
  event?.data?.attributes?.data?.attributes ||
  event?.data?.attributes ||
  event?.attributes ||
  {};

const metadata = checkout?.metadata || {};

if (
  eventType !== "checkout_session.payment.paid" &&
  eventType !== "checkout_session"
) {
  return res.status(200).json({
    received: true,
    skipped: eventType
  });
}

    const studentEmail = metadata?.studentEmail;
    const packageName = metadata?.packageName;

    // Every card the studio sells. Keep in step with the cards in
    // src/App.jsx. type "unlimited" is what the app's guard checks to
    // skip the credit gate; credits 0 is correct for it.
    const PACKAGES = {
      "Single Pass":          { credits: 1, days: 7,  type: "credits" },
      "1 Week Unlimited":     { credits: 0, days: 7,  type: "unlimited" },
      "Class Card":           { credits: 5, days: 30, type: "credits" },
      "Self Studio Practice": { credits: 1, days: 7,  type: "credits" },
      "Private Class":        { credits: 1, days: 7,  type: "credits" }
    };

    const pkg = PACKAGES[packageName];

    console.log("WEBHOOK DEBUG:", {
      eventId,
      eventType,
      studentEmail,
      packageName,
      package: pkg || null
    });

    // Note: no "credits <= 0" test here. 1 Week Unlimited legitimately has
    // zero credits, and that test was why it was dropped before the write.
    if (!eventId || !studentEmail || !packageName || !pkg) {
      console.log("SKIPPED — unknown or missing package:", packageName);

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

    // Expiry runs from the purchase, using the package's own validity.
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + pkg.days);

    // An unlimited pass holds no credits — the expiry is its only limit.
    const updatedCredits =
      pkg.type === "unlimited"
        ? 0
        : (Number(student.credits) || 0) + pkg.credits;

    const packageExpiry = expiry.toISOString();
    const updateRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/students?email=eq.${encodeURIComponent(studentEmail)}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          Prefer: "return=representation"
        },
        body: JSON.stringify({
          credits: updatedCredits,
          package_expiry: packageExpiry,
          package_type: pkg.type
        })
      }
    );

    const updateText = await updateRes.text();

    if (!updateRes.ok) {
      console.log("Student credit update failed:", updateText);

return res.status(200).json({
  received: true,
  skipped: "credit update failed"
});
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
          credits_added: pkg.credits
        })
      }
    );

    const logText = await logRes.text();

    if (!logRes.ok) {
      console.log("Payment event insert failed:", logText);
      
      return res.status(200).json({
  received: true,
  skipped: "payment log failed"
});
    }

    console.log("WEBHOOK SUCCESS:", {
      studentEmail,
      packageName,
      creditsAdded: pkg.credits,
      packageType: pkg.type,
      updatedCredits
    });

    return res.status(200).json({ success: true });
  } 
catch (error) {
  console.log("Webhook error:", error);

  return res.status(200).json({
    received: true,
    error: error.message
  });
}  
}
