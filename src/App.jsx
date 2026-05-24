import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");

  if (page === "auth") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial"
      }}>
        <div style={{
          background: "#1a1a1a",
          padding: "40px",
          borderRadius: "20px",
          width: "320px"
        }}>
          <h1 style={{ textAlign: "center" }}>LEGACY</h1>

          <div style={{ marginTop: "30px" }}>
            <input
              placeholder="Email"
              style={inputStyle}
            />

            <input
              placeholder="Password"
              type="password"
              style={inputStyle}
            />

            <button style={buttonStyle}>
              Login
            </button>

            <button style={{
              ...buttonStyle,
              background: "#333",
              marginTop: "10px"
            }}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      fontFamily: "Arial"
    }}>
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
