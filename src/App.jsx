import { useEffect, useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");
  const [agreed, setAgreed] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    emergencyName: "",
    emergencyPhone: ""
  });

  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const isFormValid = Object.values(form).every(Boolean);
  const isLoginValid = login.email && login.password;

  const classes = [
    { day: "Monday", time: "6:00 PM", name: "Pole Fitness" },
    { day: "Tuesday", time: "6:00 PM", name: "Pole Flow" },
    { day: "Wednesday", time: "6:00 PM", name: "Spinny Pole" },
    { day: "Thursday", time: "6:00 PM", name: "Mat Flexibility" },
    { day: "Friday", time: "6:00 PM", name: "Heels and Steel" },
    { day: "Saturday", time: "6:00 PM", name: "Floor Work" }
  ];

  const packages = [
    { name: "TEST PACKAGE", price: "₱1.00", amount: 100, note: "Test checkout only" },
    { name: "Single Pass", price: "₱850.00", amount: 85000, note: "One class access" },
    { name: "Class Card of 5", price: "₱4,000.00", amount: 400000, note: "Consumable within 30 days" },
    { name: "Practice Session", price: "₱550.00", amount: 55000, note: "Open practice access" },
    { name: "Private Class", price: "₱3,000.00", amount: 300000, note: "Can be up to 3 students" }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "true") {
      setPage("success");
    }
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleLoginChange(e) {
    setLogin({ ...login, [e.target.name]: e.target.value });
  }

  function saveAndContinue() {
    localStorage.setItem("legacyStudentRecord", JSON.stringify(form));
    setLogin({ email: form.email, password: "" });
    setPage("waiver");
  }

  function loginAndContinue() {
    localStorage.setItem("legacyStudentLogin", JSON.stringify(login));
    setPage("calendar");
  }

  function chooseClass(item) {
    setSelectedClass(item);
    localStorage.setItem("legacySelectedClass", JSON.stringify(item));
    setPage("packages");
  }

  async function choosePackage(item) {
    setLoading(true);

    localStorage.setItem("legacySelectedPackage", JSON.stringify(item));
    localStorage.setItem("legacyStudentRecord", JSON.stringify(form));
    localStorage.setItem("legacySelectedClass", JSON.stringify(selectedClass));

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: item.name,
          amount: item.amount,
          studentName: form.fullName,
          studentEmail: form.email,
          className: `${selectedClass.day} ${selectedClass.time} - ${selectedClass.name}`
        })
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Payment checkout failed. Please check PayMongo setup.");
        setLoading(false);
      }
    } catch {
      alert("Checkout error. Please try again.");
      setLoading(false);
    }
  }

  if (page === "success") {
    const student = JSON.parse(localStorage.getItem("legacyStudentRecord"));
    const bookedClass = JSON.parse(localStorage.getItem("legacySelectedClass"));
    const bookedPackage = JSON.parse(localStorage.getItem("legacySelectedPackage"));

    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "650px", textAlign: "center" }}>
          <div style={{ fontSize: "70px" }}>✅</div>
          <h1 style={{ ...titleStyle, textAlign: "center" }}>Class Booked</h1>

          <div style={summaryBox}>
            <p><b>Name:</b> {student?.fullName}</p>
            <p><b>Email:</b> {student?.email}</p>
            <p><b>Class:</b> {bookedClass?.day} {bookedClass?.time} — {bookedClass?.name}</p>
            <p><b>Package:</b> {bookedPackage?.name}</p>
            <p><b>Amount:</b> {bookedPackage?.price}</p>
          </div>

          <p style={mutedText}>📧 PayMongo will send the payment receipt to the student email.</p>

          <button
            style={buttonStyle}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Book Another Class
          </button>
        </div>
      </div>
    );
  }

  if (page === "login") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Student Login</h1>

          <input
            name="email"
            placeholder="Email Address"
            value={login.email}
            style={inputStyle}
            onChange={handleLoginChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Create Password"
            value={login.password}
            style={inputStyle}
            onChange={handleLoginChange}
          />

          <button
            disabled={!isLoginValid}
            onClick={loginAndContinue}
            style={{ ...buttonStyle, background: isLoginValid ? "#ec4899" : "#555" }}
          >
            Continue to Classes
          </button>
        </div>
      </div>
    );
  }

  if (page === "packages") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "900px", maxWidth: "95%" }}>
          <button style={backButton} onClick={() => setPage("calendar")}>← Back to Classes</button>
          <h1 style={titleStyle}>Choose Package</h1>

          <p style={selectedText}>
            Selected: <b>{selectedClass?.day} {selectedClass?.time}</b> — {selectedClass?.name}
          </p>

          <div style={packageGrid}>
            {packages.map((item) => (
              <button key={item.name} style={packageCard} onClick={() => choosePackage(item)}>
                <h2>{item.name}</h2>
                <p style={priceText}>{item.price}</p>
                <p style={noteText}>{item.note}</p>
              </button>
            ))}
          </div>

          {loading && <p style={mutedText}>Creating secure checkout...</p>}
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
                <b>{item.day}</b> {item.time} {item.name}
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
            <p>I understand pole and aerial fitness involves physical risk.</p>
            <p>I confirm I am physically fit to participate.</p>
            <p>I agree to follow all safety rules and instructor instructions.</p>
            <p>I release Legacy Pole & Aerial Studio from claims arising from participation, except where prohibited by law.</p>
          </div>

          <label style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>I have read and agree to the waiver.</span>
          </label>

          <button
            disabled={!agreed}
            onClick={() => setPage("login")}
            style={{ ...buttonStyle, background: agreed ? "#ec4899" : "#555" }}
          >
            Accept Waiver
          </button>
        </div>
      </div>
    );
  }
if (page === "home") {
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>LEGACY</h1>

        <p style={mutedText}>
          Pole & Aerial Studio
        </p>

        <button
          style={buttonStyle}
          onClick={() => setPage("signup")}
        >
          Sign Up
        </button>

        <button
          style={{
            ...buttonStyle,
            background: "#333",
            marginTop: "12px"
          }}
          onClick={() => setPage("login")}
        >
          Login
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
          style={{ ...buttonStyle, background: isFormValid ? "#ec4899" : "#555" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

const pageStyle = {
  background: "linear-gradient(to bottom,#f7f4ee,#ffffff)",
  minHeight: "100vh",
  color: "#111",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  fontFamily: "'Poppins', sans-serif"
};

const cardStyle = {
  width: "100%",
  maxWidth: "520px",
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(212,176,106,0.22)",
  borderRadius: "32px",
  padding: "42px",
  backdropFilter: "blur(18px)",
  boxShadow: "0 15px 45px rgba(0,0,0,0.08)"
};

const titleStyle = {
  fontSize: "56px",
  fontWeight: "800",
  marginBottom: "12px",
  letterSpacing: "-2px",
  background: "linear-gradient(to right,#111,#d4b06a)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

const mutedText = {
  color: "#777",
  marginBottom: "28px",
  fontSize: "15px",
  lineHeight: "1.6"
};

const inputStyle = {
  width: "100%",
  padding: "18px",
  marginBottom: "16px",
  background: "#fff",
  border: "1px solid rgba(212,176,106,0.18)",
  borderRadius: "18px",
  color: "#111",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
  transition: "0.3s",
  boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
};

const buttonStyle = {
  width: "100%",
  padding: "18px",
  background: "linear-gradient(to right,#d4b06a,#f0d8a8)",
  color: "#111",
  border: "none",
  borderRadius: "18px",
  fontWeight: "700",
  fontSize: "15px",
  cursor: "pointer",
  marginTop: "14px",
  transition: "0.3s",
  boxShadow: "0 10px 25px rgba(212,176,106,0.22)"
};

const classRow = {
  background: "#fff",
  border: "1px solid rgba(212,176,106,0.12)",
  color: "#111",
  textAlign: "left",
  fontSize: "18px",
  cursor: "pointer",
  borderRadius: "18px",
  padding: "18px",
  display: "block",
  marginBottom: "14px",
  transition: "0.3s",
  boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
};

const packageGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "22px"
};

const packageCard = {
  background: "#fff",
  border: "1px solid rgba(212,176,106,0.14)",
  borderRadius: "24px",
  padding: "28px",
  color: "#111",
  textAlign: "left",
  cursor: "pointer",
  transition: "0.3s",
  boxShadow: "0 4px 14px rgba(0,0,0,0.04)"
};

const summaryBox = {
  background: "#fff",
  border: "1px solid rgba(212,176,106,0.12)",
  borderRadius: "24px",
  padding: "26px",
  lineHeight: "2.2",
  color: "#222",
  boxShadow: "0 4px 14px rgba(0,0,0,0.04)"
};

const backButton = {
  background: "transparent",
  border: "none",
  color: "#b48a3c",
  fontSize: "15px",
  cursor: "pointer",
  marginBottom: "20px",
  fontWeight: "600"
};
