import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#efe7dc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Georgia"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "60px",
          borderRadius: "30px",
          width: "400px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >
        <h1>LEGACY</h1>

        <p>Pole & Aerial Studio</p>

        <button
          onClick={() => setPage("dashboard")}
          style={{
            padding: "16px 30px",
            border: "none",
            borderRadius: "999px",
            background: "#2d2015",
            color: "white",
            cursor: "pointer"
          }}
        >
          Start Booking
        </button>

        {page === "dashboard" && (
          <div style={{ marginTop: "30px" }}>
            <h2>Dashboard Working ✅</h2>

            <p>Vercel build fixed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
