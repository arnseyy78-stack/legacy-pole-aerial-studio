import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("signup");
  const [agreed, setAgreed] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const paymongoLink = "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/geUY4Ih";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    emergencyName: "",
    emergencyPhone: ""
  });

  const isFormValid = Object.values(form).every(Boolean);

  const classes = [
    { day: "Monday", time: "6:00 PM", name: "Pole Fitness" },
    { day: "Tuesday", time: "6:00 PM", name: "Pole Flow" },
    { day: "Wednesday", time: "6:00 PM", name: "Spinny Pole" },
    { day: "Thursday", time: "6:00 PM", name: "Mat Flexibility" },
    { day: "Friday", time: "6:00 PM", name: "Heels and Steel" },
    { day: "Saturday", time: "6:00 PM", name: "Floor Work" }
  ];

  const packages = [
    { name: "Single Pass", price: "₱850.00", amount: 850, note: "One class access" },
    { name: "Class Card of 5", price: "₱4,000.00", amount: 4000, note: "Consumable within 30 days" },
    { name: "Practice Session", price: "₱550.00", amount: 550, note: "Open practice access" },
    { name: "Private Class", price: "₱3,000.00", amount: 3000, note: "Can be up to 3 students" }
  ];

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function saveAndContinue() {
    localStorage.setItem("legacyStudentRecord", JSON.stringify(form));
    setPage("waiver");
  }

  function chooseClass(item) {
    setSelectedClass(item);
    localStorage.setItem("legacySelectedClass", JSON.stringify(item));
    setPage("packages");
  }

  function choosePackage(item) {
    setSelectedPackage(item);
    localStorage.setItem("legacySelectedPackage", JSON.stringify(item));
    setPage("payment");
  }

  function goToPayment(method) {
    const record = {
      student: form,
      class: selectedClass,
      package: selectedPackage,
      paymentMethod: method,
      paymentLink: paymongoLink,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("legacyBookingRecord", JSON.stringify(record));
    window.location.href = paymongoLink;
  }

  if (page === "payment") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "700px", maxWidth: "95%" }}>
          <button style={backButton} onClick={() => setPage("packages")}>
            ← Back to Packages
          </button>

          <h1 style={titleStyle}>Payment Method</h1>

          <div style={summaryBox}>
            <p><b>Class:</b> {selectedClass?.day} {selectedClass?.time} — {selectedClass?.name}</p>
            <p><b>Package:</b> {selectedPackage?.name}</p>
            <p><b>Amount:</b> {selectedPackage?.price}</p>
          </div>

          <button style={payButton} onClick={() => goToPayment("GCash")}>
            Pay with GCash
          </button>

          <button style={{ ...payButton, background: "#7c3aed" }} onClick={() => goToPayment("Maya")}>
            Pay with Maya
          </button>

          <p style={securityText}>
            You will be redirected to PayMongo secure checkout.
          </p>
        </div>
      </div>
    );
  }

  if (page === "packages") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "900px", maxWidth: "95%" }}>
          <button style={backButton} onClick={() => setPage("calendar")}>
            ← Back to Classes
          </button>

          <h1 style={titleStyle}>Choose Package</h1>

          <p style={selectedText}>
            Selected: <b>{selectedClass?.day} {selectedClass?.time}</b> — {selectedClass?.name}
          </p>

          <div style={packageGrid}>
            {packages.map((item) => (
              <button key={item.name} style={packageCard} onClick={() => choosePackage(item)}>
                <h2 style={{ margin: 0 }}>{item.name}</h2>
                <p style={priceText}>{item.price}</p>
                <p style={noteText}>{item.note}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page === "calendar") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "900px", maxWidth: "95%" }}>
          <h1 style={titleStyle}>Classes</h1>

          <div style={classList}>
            {classes.map((item) => (
              <button key={item.day} style={classRow} onClick={() => chooseClass(item)}>
                <span style={dayText}>{item.day}</span>{" "}
                <span>{item.time}</span>{" "}
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page === "waiver") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "700px", maxWidth: "90%" }}>
          <h1 style={titleStyle}>Student Waiver & Release</h1>

          <div style={waiverBox}>
            <p><b>Legacy Pole & Aerial Studio Waiver</b></p>
            <p>I understand that pole dance, aerial fitness, flexibility training, conditioning, and related activities involve physical exertion and risk of injury.</p>
            <p>I confirm that I am voluntarily participating and physically fit to join. I agree to follow instructor instructions, safety rules, and studio policies.</p>
            <p>I release and hold harmless Legacy Pole & Aerial Studio, its owners, instructors, staff, representatives, and venue partners from claims arising from my participation, except where prohibited by law.</p>
            <p>I understand that I must disclose any medical condition, injury, pregnancy, medication, or limitation that may affect my ability to participate safely.</p>
            <p>By checking the box below, I confirm that I have read, understood, and voluntarily agree to this waiver.</p>
          </div>

          <label style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>I have read and agree to the waiver.</span>
          </label>

          <button
            disabled={!agreed}
            onClick={() => setPage("calendar")}
            style={{
              ...buttonStyle,
              background: agreed ? "#ec4899" : "#555",
              cursor: agreed ? "pointer" : "not-allowed",
              opacity: agreed ? 1 : 0.7
            }}
          >
            Accept Waiver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Student Information</h1>

        <input name="fullName" placeholder="Full Name" style={inputStyle} onChange={handleChange} />
        <input name="email" placeholder="Email Address" style={inputStyle} onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" style={inputStyle} onChange={handleChange} />
        <input name="dob" type="date" style={inputStyle} onChange={handleChange} />
        <input name="emergencyName" placeholder="Emergency Contact Name" style={inputStyle} onChange={handleChange} />
        <input name="emergencyPhone" placeholder="Emergency Contact Number" style={inputStyle} onChange={handleChange} />

        <button
          disabled={!isFormValid}
          onClick={saveAndContinue}
          style={{
            ...buttonStyle,
            background: isFormValid ? "#ec4899" : "#555",
            cursor: isFormValid ? "pointer" : "not-allowed",
            opacity: isFormValid ? 1 : 0.7
          }}
        >
          Continue
        </button>

        <p style={securityText}>🔒 Your information is safe and secure.</p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#050505",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Arial",
  padding: "20px"
};

const cardStyle = {
  width: "380px",
  background: "#111",
  borderRadius: "24px",
  padding: "40px",
  border: "1px solid rgba(255,255,255,0.08)"
};

const titleStyle = {
  textAlign: "left",
  marginBottom: "30px",
  fontSize: "42px",
  fontWeight: "800"
};

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#1c1c1c",
  color: "white",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  color: "white",
  fontWeight: "700",
  marginTop: "16px"
};

const waiverBox = {
  maxHeight: "360px",
  overflowY: "auto",
  background: "#1c1c1c",
  padding: "20px",
  borderRadius: "16px",
  lineHeight: "1.6",
  color: "#ddd"
};

const securityText = {
  textAlign: "center",
  color: "#999",
  marginTop: "22px",
  fontSize: "14px"
};

const classList = {
  display: "flex",
  flexDirection: "column",
  gap: "14px"
};

const classRow = {
  background: "transparent",
  border: "none",
  color: "white",
  textAlign: "left",
  fontSize: "24px",
  cursor: "pointer",
  textDecoration: "underline"
};

const dayText = {
  fontWeight: "700"
};

const packageGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px"
};

const packageCard = {
  background: "#1c1c1c",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  padding: "24px",
  color: "white",
  textAlign: "left",
  cursor: "pointer"
};

const priceText = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#ec4899",
  margin: "18px 0 8px"
};

const noteText = {
  color: "#bbb",
  fontSize: "15px",
  lineHeight: "1.5"
};

const selectedText = {
  color: "#ccc",
  marginBottom: "24px",
  fontSize: "17px"
};

const backButton = {
  background: "transparent",
  border: "none",
  color: "#ec4899",
  fontSize: "16px",
  cursor: "pointer",
  marginBottom: "20px"
};

const summaryBox = {
  background: "#1c1c1c",
  borderRadius: "18px",
  padding: "20px",
  marginBottom: "24px",
  lineHeight: "1.7"
};

const payButton = {
  width: "100%",
  padding: "18px",
  borderRadius: "18px",
  border: "none",
  background: "#ec4899",
  color: "white",
  fontSize: "18px",
  fontWeight: "800",
  cursor: "pointer",
  marginTop: "14px"
};
