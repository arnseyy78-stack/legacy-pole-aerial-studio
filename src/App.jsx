import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("signup");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    emergencyName: "",
    emergencyPhone: ""
  });

  const [waiverAgreed, setWaiverAgreed] = useState(false);

  const isFormValid =
    form.fullName &&
    form.email &&
    form.phone &&
    form.dob &&
    form.emergencyName &&
    form.emergencyPhone;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveAccountAndContinue = () => {
    localStorage.setItem("legacyStudentAccount", JSON.stringify(form));
    setPage("waiver");
  };

  if (page === "waiver") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Waiver Agreement</h1>

          <p style={waiverText}>
            I understand that pole and aerial classes involve physical activity.
            I confirm that I am fit to participate and I accept responsibility
            for my own safety during class.
          </p>

          <p style={waiverText}>
            I agree to follow all studio rules, instructor guidance, and safety
            instructions at Legacy Pole & Aerial Studio.
          </p>

          <label style={checkStyle}>
            <input
              type="checkbox"
              checked={waiverAgreed}
              onChange={(e) => setWaiverAgreed(e.target.checked)}
            />
            I have read and agree to the waiver.
          </label>

          <button
            disabled={!waiverAgreed}
            style={{
              ...buttonStyle,
              background: waiverAgreed ? "#ec4899" : "#555",
              cursor: waiverAgreed ? "pointer" : "not-allowed",
              opacity: waiverAgreed ? 1 : 0.7
            }}
          >
            Continue to Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Student Information</h1>

        <input name="fullName" placeholder="Full Name" style={inputStyle} value={form.fullName} onChange={handleChange} />
        <input name="email" placeholder="Email Address" style={inputStyle} value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" style={inputStyle} value={form.phone} onChange={handleChange} />
        <input type="date" name="dob" style={inputStyle} value={form.dob} onChange={handleChange} />
        <input name="emergencyName" placeholder="Emergency Contact Name" style={inputStyle} value={form.emergencyName} onChange={handleChange} />
        <input name="emergencyPhone" placeholder="Emergency Contact Number" style={inputStyle} value={form.emergencyPhone} onChange={handleChange} />

        <button
          disabled={!isFormValid}
          onClick={saveAccountAndContinue}
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
  color: "white",
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "38px"
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
  fontSize: "16px",
  marginTop: "10px"
};

const waiverText = {
  color: "#ccc",
  lineHeight: "1.6",
  fontSize: "15px"
};

const checkStyle = {
  color: "white",
  display: "flex",
  gap: "10px",
  marginTop: "20px",
  marginBottom: "20px"
};

const securityText = {
  textAlign: "center",
  color: "#999",
  marginTop: "22px",
  fontSize: "14px"
};
