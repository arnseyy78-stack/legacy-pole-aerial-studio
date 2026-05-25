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

  const classes = [
    { day: "Monday", time: "6:00 PM", name: "Pole Fitness" },
    { day: "Tuesday", time: "6:00 PM", name: "Pole Flow" },
    { day: "Wednesday", time: "6:00 PM", name: "Spinny Pole" },
    { day: "Thursday", time: "6:00 PM", name: "Mat Flexibility" },
    { day: "Friday", time: "6:00 PM", name: "Heels and Steel" },
    { day: "Saturday", time: "6:00 PM", name: "Floor Work" }
  ];

  const packages = [
    { name: "TEST PACKAGE", price: "₱1.00", amount: 100, note: "Test checkout only", credits: 1, type: "Test Credit" },
    { name: "Single Pass", price: "₱850.00", amount: 85000, note: "One class access", credits: 1, type: "Class Credit" },
    { name: "Class Card of 5", price: "₱4,000.00", amount: 400000, note: "Consumable within 30 days", credits: 5, type: "Class Credits", expiryDays: 30 },
    { name: "Practice Session", price: "₱550.00", amount: 55000, note: "Open practice access", credits: 1, type: "Practice Credit" },
    { name: "Private Class", price: "₱3,000.00", amount: 300000, note: "Can be up to 3 students", credits: 1, type: "Private Credit" }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "true") setPage("dashboard");
  }, []);

  const isFormValid = Object.values(form).every(Boolean);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function saveAndContinue() {
    localStorage.setItem("legacyStudentRecord", JSON.stringify(form));
    localStorage.setItem("legacyStudentName", form.fullName);
    localStorage.setItem("legacyStudentEmail", form.email);
    setPage("waiver");
  }

  function chooseClass(item) {
    setSelectedClass(item);
    localStorage.setItem("legacySelectedClass", JSON.stringify(item));
    setPage("packages");
  }

  function getExpiryDate(days) {
    if (!days) return "No expiry";
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString();
  }

  async function choosePackage(item) {
    setLoading(true);

    const savedStudent = JSON.parse(localStorage.getItem("legacyStudentRecord")) || form;

    const booking = {
      student: savedStudent,
      class: selectedClass,
      package: item,
      creditsRemaining: item.credits,
      creditType: item.type,
      expiryDate: getExpiryDate(item.expiryDays),
      purchaseDate: new Date().toLocaleDateString()
    };

    localStorage.setItem("legacyBookingDashboard", JSON.stringify(booking));
    localStorage.setItem("legacySelectedPackage", JSON.stringify(item));

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: item.name,
          amount: item.amount,
          studentName: savedStudent.fullName,
          studentEmail: savedStudent.email,
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

  if (page === "dashboard") {
    const booking = JSON.parse(localStorage.getItem("legacyBookingDashboard"));
    const student = booking?.student || JSON.parse(localStorage.getItem("legacyStudentRecord"));
    const bookedClass = booking?.class || JSON.parse(localStorage.getItem("legacySelectedClass"));
    const bookedPackage = booking?.package || JSON.parse(localStorage.getItem("legacySelectedPackage"));

    const studentName = student?.fullName || localStorage.getItem("legacyStudentName") || "Student";
    const studentEmail = student?.email || localStorage.getItem("legacyStudentEmail") || "No email saved";

    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, maxWidth: "700px" }}>
          <h1 style={titleStyle}>Student Dashboard</h1>

          <div style={summaryBox}>
            <p><b>Student:</b> {studentName}</p>
            <p><b>Email:</b> {studentEmail}</p>
            <p><b>Booked Class:</b> {bookedClass?.day} {bookedClass?.time} — {bookedClass?.name}</p>
            <p><b>Package:</b> {bookedPackage?.name}</p>
            <p><b>Amount Paid:</b> {bookedPackage?.price}</p>
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

  if (page === "home") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>LEGACY</h1>
          <p style={mutedText}>Pole & Aerial Studio</p>

          <button style={buttonStyle} onClick={() => setPage("student-info")}>
            Sign Up
          </button>

          <button style={{ ...buttonStyle, background: "#333" }} onClick={() => setPage("classes")}>
            Log In
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
            onClick={() => setPage("classes")}
            style={{ ...buttonStyle, background: agreed ? "#ec4899" : "#555" }}
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
                <h1 style={{ color: "#ec4899" }}>{pkg.price}</h1>
                <p style={{ color: "#999" }}>{pkg.note}</p>
              </button>
            ))}
          </div>

          {loading && <p style={mutedText}>Creating secure checkout...</p>}
        </div>
      </div>
    );
  }

  return null;
}

const pageStyle = {
  background: "#000",
  minHeight: "100vh",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  fontFamily: "Arial"
};

const cardStyle = {
  width: "100%",
  maxWidth: "500px",
  background: "#0d0d0d",
  border: "1px solid #222",
  borderRadius: "24px",
  padding: "36px"
};

const titleStyle = {
  fontSize: "48px",
  fontWeight: "800",
  marginBottom: "24px"
};

const mutedText = {
  color: "#bbb",
  marginBottom: "24px"
};

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "14px",
  background: "#161616",
  border: "1px solid #333",
  borderRadius: "14px",
  color: "white",
  fontSize: "15px",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  background: "#ec4899",
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "10px"
};

const classRow = {
  background: "transparent",
  border: "none",
  color: "white",
  textAlign: "left",
  fontSize: "24px",
  cursor: "pointer",
  textDecoration: "underline",
  display: "block",
  marginBottom: "14px"
};

const packageGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px"
};

const packageCard = {
  background: "#111",
  border: "1px solid #222",
  borderRadius: "18px",
  padding: "22px",
  color: "white",
  textAlign: "left",
  cursor: "pointer"
};

const summaryBox = {
  background: "#161616",
  borderRadius: "18px",
  padding: "20px",
  lineHeight: "2.2"
};

const backButton = {
  background: "transparent",
  border: "none",
  color: "#ec4899",
  fontSize: "16px",
  cursor: "pointer",
  marginBottom: "20px"
};
