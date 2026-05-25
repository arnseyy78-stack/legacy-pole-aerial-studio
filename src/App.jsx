import { useEffect, useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");
  const [agreed, setAgreed] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [studentData, setStudentData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    emergencyName: "",
    emergencyPhone: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const paid = params.get("paid");

    if (paid === "true") {
      const savedStudent =
        JSON.parse(localStorage.getItem("legacyStudent")) || {};

      const savedClass =
        JSON.parse(localStorage.getItem("legacyClass")) || null;

      const savedPackage =
        JSON.parse(localStorage.getItem("legacyPackage")) || null;

      setStudentData(savedStudent);
      setSelectedClass(savedClass);
      setSelectedPackage(savedPackage);

      setPage("dashboard");
    }
  }, []);

  const classes = [
    { day: "Monday", time: "6:00 PM", name: "Pole Fitness" },
    { day: "Tuesday", time: "6:00 PM", name: "Pole Flow" },
    { day: "Wednesday", time: "6:00 PM", name: "Spinny Pole" },
    { day: "Thursday", time: "6:00 PM", name: "Mat Flexibility" },
    { day: "Friday", time: "6:00 PM", name: "Heels and Steel" },
    { day: "Saturday", time: "6:00 PM", name: "Floor Work" },
  ];

  const packages = [
    {
      name: "TEST PACKAGE",
      price: "₱1.00",
      amount: 100,
      credits: "1 Test Credit",
    },
    {
      name: "Single Pass",
      price: "₱850.00",
      amount: 85000,
      credits: "1 Class",
    },
    {
      name: "Class Card of 5",
      price: "₱4,000.00",
      amount: 400000,
      credits: "5 Classes",
    },
    {
      name: "Practice Session",
      price: "₱550.00",
      amount: 55000,
      credits: "Practice Access",
    },
    {
      name: "Private Class",
      price: "₱3,000.00",
      amount: 300000,
      credits: "Private Session",
    },
  ];

  const pageStyle = {
    background: "#000",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontFamily: "Arial",
    padding: "20px",
  };

  const cardStyle = {
    background: "#111",
    padding: "40px",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 0 30px rgba(255,255,255,0.05)",
  };

  const titleStyle = {
    fontSize: "56px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background: "#ec4899",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    marginTop: "14px",
    borderRadius: "12px",
    border: "1px solid #333",
    background: "#1a1a1a",
    color: "#fff",
  };

  if (page === "home") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>LEGACY</h1>

          <p style={{ color: "#aaa" }}>Pole & Aerial Studio</p>

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
            }}
            onClick={() => setPage("login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (page === "signup") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Student Waiver & Release</h1>

          <div
            style={{
              background: "#1a1a1a",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <p>
              I understand pole and aerial fitness involves physical risk.
            </p>

            <p>I confirm I am physically fit to participate.</p>

            <p>
              I agree to follow all safety rules and instructor instructions.
            </p>
          </div>

          <label
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />

            <span>I have read and agree to the waiver.</span>
          </label>

          <button
            disabled={!agreed}
            style={{
              ...buttonStyle,
              background: agreed ? "#ec4899" : "#555",
            }}
            onClick={() => setPage("student")}
          >
            Accept Waiver
          </button>
        </div>
      </div>
    );
  }

  if (page === "student") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Student Information</h1>

          <input
            style={inputStyle}
            placeholder="Full Name"
            value={studentData.fullName}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                fullName: e.target.value,
              })
            }
          />

          <input
            style={inputStyle}
            placeholder="Email Address"
            value={studentData.email}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                email: e.target.value,
              })
            }
          />

          <input
            style={inputStyle}
            placeholder="Phone Number"
            value={studentData.phone}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                phone: e.target.value,
              })
            }
          />

          <button
            style={buttonStyle}
            onClick={() => {
              localStorage.setItem(
                "legacyStudent",
                JSON.stringify(studentData)
              );

              setPage("classes");
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (page === "classes") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Choose Class</h1>

          {classes.map((item, index) => (
            <button
              key={index}
              style={buttonStyle}
              onClick={() => {
                setSelectedClass(item);

                localStorage.setItem(
                  "legacyClass",
                  JSON.stringify(item)
                );

                setPage("packages");
              }}
            >
              {item.day} — {item.time} — {item.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (page === "packages") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Choose Package</h1>

          {packages.map((pkg, index) => (
            <button
              key={index}
              style={buttonStyle}
              onClick={() => {
                setSelectedPackage(pkg);

                localStorage.setItem(
                  "legacyPackage",
                  JSON.stringify(pkg)
                );

                window.location.href =
                  "https://legacy-pole-aerial-studio.vercel.app/?paid=true";
              }}
            >
              {pkg.name} — {pkg.price}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (page === "dashboard") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Class Booked</h1>

          <div
            style={{
              background: "#1a1a1a",
              padding: "24px",
              borderRadius: "18px",
              lineHeight: "2",
            }}
          >
            <p>
              <strong>Name:</strong>{" "}
              {studentData.fullName || "No name saved"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {studentData.email || "No email saved"}
            </p>

            <p>
              <strong>Class:</strong>{" "}
              {selectedClass
                ? `${selectedClass.day} ${selectedClass.time} — ${selectedClass.name}`
                : "No class selected"}
            </p>

            <p>
              <strong>Package:</strong>{" "}
              {selectedPackage?.name}
            </p>

            <p>
              <strong>Amount:</strong>{" "}
              {selectedPackage?.price}
            </p>
          </div>

          <button
            style={buttonStyle}
            onClick={() => setPage("classes")}
          >
            Book Another Class
          </button>
        </div>
      </div>
    );
  }

  return null;
}
