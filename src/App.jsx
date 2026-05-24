import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("signup");
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    emergencyName: "",
    emergencyPhone: ""
  });

  const isFormValid = Object.values(form).every(Boolean);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function saveAndContinue() {
    localStorage.setItem("legacyStudentRecord", JSON.stringify(form));
    setPage("waiver");
  }

  if (page === "calendar") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "900px", maxWidth: "95%" }}>
          <h1 style={titleStyle}>Class Calendar</h1>
          <div style={calendarGrid}>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <div style={dayCard} key={day}>
                <h2>{day}</h2>
                <p>10:00 AM - Static Pole</p>
                <p>1:00 PM - Spinny Heels Pole</p>
                <p>4:00 PM - Static Pole</p>
                <p>7:00 PM - Spinny Heels Pole</p>
              </div>
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
            <p>I confirm that I am voluntarily participating and that I am physically fit to join. I agree to follow all instructor instructions, safety rules, and studio policies.</p>
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
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "36px",
  fontWeight: "700"
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

const calendarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px"
};

const dayCard = {
  background: "#1c1c1c",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "18px",
  padding: "20px",
  lineHeight: "1.7"
};
