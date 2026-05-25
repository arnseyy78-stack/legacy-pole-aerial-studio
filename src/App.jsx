import { useEffect, useState } from "react";

export default function App() {
  const [page, setPage] = useState("signup");
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

  function saveAndContinue() {
    localStorage.setItem("legacyStudentRecord", JSON.stringify(form));
    setPage("waiver");
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

    const response = await fetch("/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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

          <p style={mutedText}>
            📧 PayMongo will send the payment receipt to the student email.
          </p>

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
            onClick={() => setPage("calendar")}
            style={{ ...buttonStyle, background: agreed ? "#ec4899" : "#555" }}
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
          style={{ ...buttonStyle, background: isFormValid ? "#ec4899" : "#555" }}
        >
          Continue
        </button>
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
  marginTop: "16px",
  cursor: "pointer"
};

const waiverBox = {
  background: "#1c1c1c",
  padding: "20px",
  borderRadius: "16px",
  lineHeight: "1.6",
  color: "#ddd"
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
  color: "#ec4899"
};

const noteText = { color: "#bbb" };
const selectedText = { color: "#ccc", marginBottom: "24px" };
const mutedText = { color: "#bbb", fontSize: "17px" };

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
  padding: "24px",
  borderRadius: "18px",
  textAlign: "left",
  lineHeight: "1.8",
  marginTop: "30px"
};
