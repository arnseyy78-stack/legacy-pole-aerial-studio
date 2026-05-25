import { useEffect, useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");
  const [agreed, setAgreed] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);

  const [student, setStudent] = useState({
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

  const classes = [
    { day: "Monday", time: "6:00 PM", name: "Pole Fitness" },
    { day: "Tuesday", time: "6:00 PM", name: "Pole Flow" },
    { day: "Wednesday", time: "6:00 PM", name: "Spinny Pole" },
    { day: "Thursday", time: "6:00 PM", name: "Mat Flexibility" },
    { day: "Friday", time: "6:00 PM", name: "Heels and Steel" },
    { day: "Saturday", time: "6:00 PM", name: "Floor Work" }
  ];

  const packages = [
    { name: "TEST PACKAGE", price: "₱1.00", amount: 100, credits: 1, type: "Test Credit", note: "Test checkout only" },
    { name: "Single Pass", price: "₱850.00", amount: 85000, credits: 1, type: "Class Credit", note: "One class access" },
    { name: "Class Card of 5", price: "₱4,000.00", amount: 400000, credits: 5, type: "Class Credits", note: "Consumable within 30 days", expiryDays: 30 },
    { name: "Practice Session", price: "₱550.00", amount: 55000, credits: 1, type: "Practice Credit", note: "Open practice access" },
    { name: "Private Class", price: "₱3,000.00", amount: 300000, credits: 1, type: "Private Credit", note: "Can be up to 3 students" }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "true") {
      setPage("dashboard");
    }
  }, []);

  const isStudentValid = Object.values(student).every(Boolean);
  const isLoginValid = login.email && login.password;

  function handleStudentChange(e) {
    setStudent({ ...student, [e.target.name]: e.target.value });
  }

  function handleLoginChange(e) {
    setLogin({ ...login, [e.target.name]: e.target.value });
  }

  function saveStudent() {
    localStorage.setItem("legacyStudent", JSON.stringify(student));
    setPage("waiver");
  }

  function loginStudent() {
    localStorage.setItem("legacyLoginEmail", login.email);
    setPage("classes");
  }

  function chooseClass(item) {
    setSelectedClass(item);
    localStorage.setItem("legacyClass", JSON.stringify(item));
    setPage("packages");
  }

  function expiryDate(days) {
    if (!days) return "No expiry";
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString();
  }

  async function choosePackage(pkg) {
    setLoading(true);

    const savedStudent = JSON.parse(localStorage.getItem("legacyStudent")) || {
      fullName: "Returning Student",
      email: localStorage.getItem("legacyLoginEmail") || "No email saved"
    };

    const savedClass = JSON.parse(localStorage.getItem("legacyClass")) || selectedClass;

    const booking = {
      student: savedStudent,
      class: savedClass,
      package: pkg,
      creditsRemaining: pkg.credits,
      creditType: pkg.type,
      purchaseDate: new Date().toLocaleDateString(),
      expiryDate: expiryDate(pkg.expiryDays)
    };

    localStorage.setItem("legacyBooking", JSON.stringify(booking));

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: pkg.name,
          amount: pkg.amount,
          studentName: savedStudent.fullName,
          studentEmail: savedStudent.email,
          className: `${savedClass.day} ${savedClass.time} - ${savedClass.name}`
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

  if (page === "home") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>LEGACY</h1>
          <p style={mutedText}>Pole & Aerial Studio</p>

          <button style={buttonStyle} onClick={() => setPage("student-info")}>
            Sign Up
          </button>

          <button style={{ ...buttonStyle, background: "#111", color: "#fff" }} onClick={() => setPage("login")}>
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (page === "login") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Login</h1>

          <input name="email" placeholder="Email Address" style={inputStyle} onChange={handleLoginChange} />
          <input name="password" type="password" placeholder="Password" style={inputStyle} onChange={handleLoginChange} />

          <button
            disabled={!isLoginValid}
            onClick={loginStudent}
            style={{ ...buttonStyle, background: isLoginValid ? "linear-gradient(to right,#d4b06a,#f0d8a8)" : "#ccc" }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (page === "student-info") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Student Information</h1>

          <input name="fullName" placeholder="Full Name" style={inputStyle} onChange={handleStudentChange} />
          <input name="email" placeholder="Email Address" style={inputStyle} onChange={handleStudentChange} />
          <input name="phone" placeholder="Phone Number" style={inputStyle} onChange={handleStudentChange} />
          <input name="dob" type="date" style={inputStyle} onChange={handleStudentChange} />
          <input name="emergencyName" placeholder="Emergency Contact Name" style={inputStyle} onChange={handleStudentChange} />
          <input name="emergencyPhone" placeholder="Emergency Contact Number" style={inputStyle} onChange={handleStudentChange} />

          <button
            disabled={!isStudentValid}
            onClick={saveStudent}
            style={{ ...buttonStyle, background: isStudentValid ? "linear-gradient(to right,#d4b06a,#f0d8a8)" : "#ccc" }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (page === "waiver") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, maxWidth: "700px" }}>
          <h1 style={titleStyle}>Student Waiver & Release</h1>

          <div style={summaryBox}>
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
            style={{ ...buttonStyle, background: agreed ? "linear-gradient(to right,#d4b06a,#f0d8a8)" : "#ccc" }}
          >
            Accept Waiver
          </button>
        </div>
      </div>
    );
  }

  if (page === "classes") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Classes</h1>

          {classes.map((item) => (
            <button key={item.day} style={classRow} onClick={() => chooseClass(item)}>
              <b>{item.day}</b> {item.time} {item.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (page === "packages") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, maxWidth: "900px" }}>
          <button style={backButton} onClick={() => setPage("classes")}>
            ← Back to Classes
          </button>

          <h1 style={titleStyle}>Choose Package</h1>

          <p style={mutedText}>
            Selected: <b>{selectedClass?.day} {selectedClass?.time}</b> — {selectedClass?.name}
          </p>

          <div style={packageGrid}>
            {packages.map((pkg) => (
              <button key={pkg.name} style={packageCard} onClick={() => choosePackage(pkg)}>
                <h2>{pkg.name}</h2>
                <h1 style={{ color: "#b48a3c" }}>{pkg.price}</h1>
                <p style={{ color: "#777" }}>{pkg.note}</p>
              </button>
            ))}
          </div>

          {loading && <p style={mutedText}>Creating secure checkout...</p>}
        </div>
      </div>
    );
  }

  if (page === "dashboard") {
    const booking = JSON.parse(localStorage.getItem("legacyBooking"));

    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, maxWidth: "700px" }}>
          <h1 style={titleStyle}>Student Dashboard</h1>

          <div style={summaryBox}>
            <p><b>Student:</b> {booking?.student?.fullName || "Returning Student"}</p>
            <p><b>Email:</b> {booking?.student?.email || localStorage.getItem("legacyLoginEmail") || "No email saved"}</p>
            <p><b>Booked Class:</b> {booking?.class?.day} {booking?.class?.time} — {booking?.class?.name}</p>
            <p><b>Package:</b> {booking?.package?.name}</p>
            <p><b>Amount Paid:</b> {booking?.package?.price}</p>
            <p><b>Remaining Credits:</b> {booking?.creditsRemaining} {booking?.creditType}</p>
            <p><b>Purchased:</b> {booking?.purchaseDate}</p>
            <p><b>Expiry:</b> {booking?.expiryDate}</p>
          </div>

          <button style={buttonStyle} onClick={() => setPage("classes")}>
            Book Another Class
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const pageStyle = {
  background: "linear-gradient(to bottom,#f7f4ee,#ffffff)",
  minHeight: "100vh",
  color: "#111",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  fontFamily: "Arial"
};

const cardStyle = {
  width: "100%",
  maxWidth: "520px",
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(212,176,106,0.25)",
  borderRadius: "32px",
  padding: "42px",
  boxShadow: "0 15px 45px rgba(0,0,0,0.08)"
};

const titleStyle = {
  fontSize: "52px",
  fontWeight: "800",
  marginBottom: "24px",
  background: "linear-gradient(to right,#111,#d4b06a)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

const mutedText = {
  color: "#777",
  marginBottom: "24px"
};

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "14px",
  background: "#fff",
  border: "1px solid rgba(212,176,106,0.22)",
  borderRadius: "16px",
  color: "#111",
  fontSize: "15px",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  background: "linear-gradient(to right,#d4b06a,#f0d8a8)",
  color: "#111",
  border: "none",
  borderRadius: "16px",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "12px"
};

const classRow = {
  background: "#fff",
  border: "1px solid rgba(212,176,106,0.18)",
  color: "#111",
  textAlign: "left",
  fontSize: "18px",
  cursor: "pointer",
  borderRadius: "16px",
  padding: "18px",
  display: "block",
  marginBottom: "14px"
};

const packageGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px"
};

const packageCard = {
  background: "#fff",
  border: "1px solid rgba(212,176,106,0.18)",
  borderRadius: "20px",
  padding: "24px",
  color: "#111",
  textAlign: "left",
  cursor: "pointer"
};

const summaryBox = {
  background: "#fff",
  border: "1px solid rgba(212,176,106,0.18)",
  borderRadius: "20px",
  padding: "22px",
  lineHeight: "2.2",
  color: "#222"
};

const backButton = {
  background: "transparent",
  border: "none",
  color: "#b48a3c",
  fontSize: "16px",
  cursor: "pointer",
  marginBottom: "20px"
};
