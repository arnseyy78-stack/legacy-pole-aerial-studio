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

  const isFormValid =
    form.fullName &&
    form.email &&
    form.phone &&
    form.dob &&
    form.emergencyName &&
    form.emergencyPhone;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  if (page === "signup") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>
            Student Information
          </h1>

          <input
            name="fullName"
            placeholder="Full Name"
            style={inputStyle}
            value={form.fullName}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email Address"
            style={inputStyle}
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            style={inputStyle}
            value={form.phone}
            onChange={handleChange}
          />

          <input
            type="date"
            name="dob"
            style={inputStyle}
            value={form.dob}
            onChange={handleChange}
          />

          <input
            name="emergencyName"
            placeholder="Emergency Contact Name"
            style={inputStyle}
            value={form.emergencyName}
            onChange={handleChange}
          />

          <input
            name="emergencyPhone"
            placeholder="Emergency Contact Number"
            style={inputStyle}
            value={form.emergencyPhone}
            onChange={handleChange}
          />

          <button
            disabled={!isFormValid}
            style={{
              ...buttonStyle,
              background: isFormValid ? "#ec4899" : "#555",
              cursor: isFormValid ? "pointer" : "not-allowed",
              opacity: isFormValid ? 1 : 0.7
            }}
          >
            Continue
          </button>

          <p style={securityText}>
            🔒 Your information is safe and secure.
          </p>
        </div>
      </div>
    );
  }

  return null;
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
  boxShadow: "0 0 40px rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)"
};

const titleStyle = {
  color: "white",
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "42px",
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
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  color: "white",
  fontWeight: "700",
  fontSize: "16px",
  marginTop: "10px",
  transition: "0.2s ease"
};

const securityText = {
  textAlign: "center",
  color: "#999",
  marginTop: "22px",
  fontSize: "14px"
};
