import { useEffect, useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");
  const [agreed, setAgreed] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    emergencyName: "",
    emergencyPhone: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("paid") === "true") {
      setPage("dashboard");
    }

    if (params.get("cancelled") === "true") {
      alert("Payment cancelled.");
      setPage("packages");
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
      note: "Test checkout only",
    },
    {
      name: "Single Pass",
      price: "₱850.00",
      amount: 85000,
      credits: "1 Class Credit",
      note: "One class access",
    },
    {
      name: "Class Card of 5",
      price: "₱4,000.00",
      amount: 400000,
      credits: "5 Class Credits",
      note: "Consumable within 30 days",
    },
    {
      name: "Practice Session",
      price: "₱550.00",
      amount: 55000,
      credits: "1 Practice Credit",
      note: "Open practice access",
    },
    {
      name: "Private Class",
      price: "₱3,000.00",
      amount: 300000,
      credits: "Private Session",
      note: "Can be up to 3 students",
    },
  ];

  const pageStyle = {
    background: "#000",
    minHeight: "100vh",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "500px",
    background: "#0d0d0d",
    border: "1px solid #222",
    borderRadius: "24px",
    padding: "36px",
  };

  const titleStyle = {
    fontSize: "54px",
    fontWeight: "800",
    marginBottom: "10px",
  };

  const mutedText = {
    color: "#bbb",
    marginBottom: "30px",
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
    boxSizing: "border-box",
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
    marginTop: "10px",
  };

  const isFormValid = Object.values(form).every(Boolean);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAndContinue = () => {
    localStorage.setItem("legacyStudentRecord", JSON.stringify(form));
    localStorage.setItem("legacyStudentName", form.fullName);
    localStorage.setItem("legacyStudentEmail", form.email);

    setPage("classes");
  };

  const chooseClass = (item) => {
    setSelectedClass(item);
    setPage("packages");
  };

  const choosePackage = async (pkg) => {
    setSelectedPackage(pkg);

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: pkg.amount,
          packageName: pkg.name,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        localStorage.setItem(
          "legacyBooking",
          JSON.stringify({
            student: form,
            class: selectedClass,
            package: pkg,
            date: new Date().toLocaleDateString(),
          })
        );

        window.location.href = data.checkoutUrl;
      } else {
        alert("Payment checkout failed. Please check PayMongo setup.");
      }
    } catch (error) {
      alert("Something went wrong.");
    }
  };

  if (page === "home") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>LEGACY</h1>

          <p style={mutedText}>Pole & Aerial Studio</p>

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
              marginTop: "12px",
            }}
            onClick={() => setPage("login")}
          >
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

          <input
            placeholder="Email Address"
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
          />

          <button
            style={buttonStyle}
            onClick={() => setPage("dashboard")}
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
              background: "#161616",
              padding: "18px",
              borderRadius: "16px",
              lineHeight: "1.8",
            }}
          >
            <p><b>Legacy Pole & Aerial Studio Waiver</b></p>

            <p>I understand pole and aerial fitness involves physical risk.</p>

            <p>I confirm I am physically fit to participate.</p>

            <p>I agree to follow all safety rules and instructor instructions.</p>

            <p>
              I release Legacy Pole & Aerial Studio from claims arising from
              participation, except where prohibited by law.
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
            onClick={() => setPage("student-info")}
            style={{
              ...buttonStyle,
              background: agreed ? "#ec4899" : "#555",
            }}
          >
            Accept Waiver
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

          <input
            name="fullName"
            placeholder="Full Name"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email Address"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="dob"
            type="date"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="emergencyName"
            placeholder="Emergency Contact Name"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="emergencyPhone"
            placeholder="Emergency Contact Number"
            style={inputStyle}
            onChange={handleChange}
          />

          <button
            disabled={!isFormValid}
            style={{
              ...buttonStyle,
              background: isFormValid ? "#ec4899" : "#555",
            }}
            onClick={saveAndContinue}
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
              style={{
                ...buttonStyle,
                marginBottom: "12px",
              }}
              onClick={() => chooseClass(item)}
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
        <div style={{ ...cardStyle, maxWidth: "900px" }}>
          <h1 style={titleStyle}>Choose Package</h1>

          <p style={mutedText}>
            Selected: {selectedClass?.day} {selectedClass?.time} —{" "}
            {selectedClass?.name}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
            }}
          >
            {packages.map((pkg, index) => (
              <div
                key={index}
                style={{
                  background: "#111",
                  border: "1px solid #222",
                  borderRadius: "18px",
                  padding: "22px",
                }}
              >
                <h2>{pkg.name}</h2>

                <h1 style={{ color: "#ec4899" }}>{pkg.price}</h1>

                <p style={{ color: "#999" }}>{pkg.note}</p>

                <button
                  style={buttonStyle}
                  onClick={() => choosePackage(pkg)}
                >
                  Select Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page === "dashboard") {
    const booking = JSON.parse(
      localStorage.getItem("legacyBooking")
    );

    const student = booking?.student;

    const savedName = localStorage.getItem("legacyStudentName");
    const savedEmail = localStorage.getItem("legacyStudentEmail");

    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, maxWidth: "700px" }}>
          <h1 style={titleStyle}>Student Dashboard</h1>

          <div
            style={{
              background: "#161616",
              borderRadius: "18px",
              padding: "20px",
              lineHeight: "2.4",
            }}
          >
            <p>
              <b>Student:</b>{" "}
              {student?.fullName || savedName}
            </p>

            <p>
              <b>Email:</b>{" "}
              {student?.email || savedEmail}
            </p>

            <p>
              <b>Booked Class:</b>{" "}
              {booking?.class?.day}{" "}
              {booking?.class?.time} —{" "}
              {booking?.class?.name}
            </p>

            <p>
              <b>Package:</b>{" "}
              {booking?.package?.name}
            </p>

            <p>
              <b>Amount Paid:</b>{" "}
              {booking?.package?.price}
            </p>

            <p>
              <b>Remaining Credits:</b>{" "}
              {booking?.package?.credits}
            </p>

            <p>
              <b>Purchased:</b>{" "}
              {booking?.date}
            </p>

            <p>
              <b>Expiry:</b> No expiry
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
