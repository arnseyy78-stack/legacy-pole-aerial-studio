import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");

  // SIGN UP PAGE
  if (page === "signup") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={{ textAlign: "center" }}>Student Information</h1>

          <input placeholder="Full Name" style={inputStyle} />
          <input placeholder="Email Address" style={inputStyle} />
          <input placeholder="Phone Number" style={inputStyle} />
          
          <input
            type="date"
            style={inputStyle}
          />

          <input
            placeholder="Emergency Contact Name"
            style={inputStyle}
          />

          <input
            placeholder="Emergency Contact Number"
            style={inputStyle}
          />

          <button style={buttonStyle}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  // LOGIN PAGE
  if (page === "auth") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={{ textAlign: "center" }}>LEGACY</h1>

          <input placeholder="Email" style={inputStyle} />

          <input
            placeholder="Password"
            type="password"
            style={inputStyle}
          />

          <button style={buttonStyle}>
            Login
          </button>

          <button
            onClick={() => setPage("signup")}
            style={{
              ...buttonStyle,
              background: "#333",
              marginTop: "10px"
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  // HOME PAGE
  return (
    <div style={pageStyle}>
      <h1>LEGACY</h1>
      <p>Pole & Aerial Studio</p>

      <button
        onClick={() => setPage("auth")}
        style={{
          marginTop: "20px",
          padding: "14px 30px",
          borderRadius: "999px",
          border: "none",
          background: "#ec4899",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Book Now
      </button>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#111",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  fontFamily: "Arial"
};

const cardStyle = {
  background: "#1a1a1a",
  padding: "40px",
  borderRadius: "20px",
  width: "340px"
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  borderRadius: "12px",
  border: "none",
  background: "#2a2a2a",
  color: "white",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "999px",
  border: "none",
  background: "#ec4899",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};
