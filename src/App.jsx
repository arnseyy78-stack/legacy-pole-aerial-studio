import { useEffect, useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");
  const [agreed, setAgreed] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [student, setStudent] = useState({
    fullName: "",
    email: "",
    phone: ""
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
    {
      name: "TEST PACKAGE",
      price: "₱1.00",
      amount: 100,
      credits: 5,
      type: "Class Credits",
      note: "5 test credits"
    },
    {
      name: "Single Pass",
      price: "₱850",
      amount: 85000,
      credits: 1,
      type: "Class Credit",
      note: "One class access"
    },
    {
      name: "Class Card of 5",
      price: "₱4,000",
      amount: 400000,
      credits: 5,
      type: "Class Credits",
      note: "Consumable within 30 days",
      expiryDays: 30
    },
    {
      name: "Practice Session",
      price: "₱550",
      amount: 55000,
      credits: 1,
      type: "Practice Credit",
      note: "Open practice access"
    },
    {
      name: "Private Class",
      price: "₱3,000",
      amount: 300000,
      credits: 1,
      type: "Private Credit",
      note: "Can be up to 3 students"
    }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("paid") === "true") {
      setPage("schedule");
    }
  }, []);

  function handleStudentChange(e) {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  }

  function handleLoginChange(e) {
    setLogin({
      ...login,
      [e.target.name]: e.target.value
    });
  }

  function saveStudent() {
    localStorage.setItem(
      "legacyStudent",
      JSON.stringify(student)
    );

    setPage("waiver");
  }

  function saveLogin() {
    const returningStudent = {
      fullName: "Returning Student",
      email: login.email,
      phone: ""
    };

    localStorage.setItem(
      "legacyStudent",
      JSON.stringify(returningStudent)
    );

    localStorage.setItem(
      "legacyLogin",
      JSON.stringify(login)
    );

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

    setSelectedPackage(pkg);

    localStorage.setItem(
      "legacyPackage",
      JSON.stringify(pkg)
    );
// FREE TEST PACKAGE
if (pkg.name === "TEST PACKAGE") {

  const savedStudent =
    JSON.parse(localStorage.getItem("legacyStudent")) || student;

  const booking = {
    student: savedStudent,
    package: pkg,
    class: null,
    creditsRemaining: 5,
    creditType: pkg.type,
    purchaseDate: new Date().toLocaleDateString(),
    expiryDate: "No expiry"
  };

  localStorage.setItem(
    "legacyBooking",
    JSON.stringify(booking)
  );

  localStorage.setItem(
    "legacyCredits",
    5
  );

  setPage("schedule");
  return;
}
    // RESET CREDITS
    if (
      pkg.name === "Class Card of 5" ||
      pkg.name === "TEST PACKAGE"
    ) {
      localStorage.setItem(
        "legacyCredits",
        5
      );
    }

    const savedStudent =
      JSON.parse(
        localStorage.getItem("legacyStudent")
      ) || student;

    try {
      const response = await fetch(
        "/api/create-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            packageName: pkg.name,
            amount: pkg.amount,
            studentName: savedStudent.fullName,
            studentEmail: savedStudent.email
          })
        }
      );

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href =
          data.checkoutUrl;
      } else {
        alert("Payment checkout failed.");
        setLoading(false);
      }
    } catch {
      alert("Checkout error.");
      setLoading(false);
    }
  }

  function chooseClass(classItem) {
    const savedStudent =
      JSON.parse(
        localStorage.getItem("legacyStudent")
      ) || student;

    const savedPackage =
      JSON.parse(
        localStorage.getItem("legacyPackage")
      ) || selectedPackage;

    const existingCredits =
      Number(
        localStorage.getItem("legacyCredits")
      ) || 0;

    let updatedCredits = existingCredits;

    // CREDIT SYSTEM
    if (
      savedPackage?.name === "Class Card of 5" ||
      savedPackage?.name === "TEST PACKAGE"
    ) {

      // FIRST PURCHASE
      updatedCredits = updatedCredits - 1;

if (updatedCredits < 0) {
  const choice = window.confirm(
  "No credits remaining.\n\nPress OK to buy a new package.\nPress Cancel to view your dashboard."
);

if (choice) {
  setPage("packages");
} else {
  setPage("dashboard");
}

return;
}
      if (existingCredits <= 0) {

  const buyMore = window.confirm(
    "No credits remaining.\n\nPress OK to buy a new package.\nPress Cancel to view dashboard."
  );

  if (buyMore) {
    setPage("packages");
  } else {
    setPage("dashboard");
  }

  return;
}

updatedCredits = updatedCredits - 1;

      // USE CREDIT
      updatedCredits =
        updatedCredits - 1;

      if (updatedCredits < 0) {
        alert("No credits remaining.");
        return;
      }

      localStorage.setItem(
        "legacyCredits",
        updatedCredits
      );
    }

    const booking = {
      student: savedStudent,
      package: savedPackage,
      class: classItem,
      creditsRemaining:
        savedPackage?.name ===
          "Class Card of 5" ||
        savedPackage?.name ===
          "TEST PACKAGE"
          ? updatedCredits
          : savedPackage?.credits,
      creditType: savedPackage?.type,
      purchaseDate:
        new Date().toLocaleDateString(),
      expiryDate: expiryDate(
        savedPackage?.expiryDays
      )
    };

    localStorage.setItem(
      "legacyBooking",
      JSON.stringify(booking)
    );

    setPage("dashboard");
  }

  const booking =
    JSON.parse(
      localStorage.getItem("legacyBooking")
    ) || {};

  if (page === "dashboard") {
    return (
      <div style={pageStyle}>
        <div style={editorialCard}>
          <div style={miniLogo}>L</div>

          <h1 style={editorialTitle}>
            Class Booked
          </h1>

          <div style={infoCard}>
            <p>
              <b>Name:</b>{" "}
              {booking.student?.fullName}
            </p>

            <p>
              <b>Email:</b>{" "}
              {booking.student?.email}
            </p>

            <p>
              <b>Package:</b>{" "}
              {booking.package?.name}
            </p>

            <p>
              <b>Amount:</b>{" "}
              {booking.package?.price}
            </p>

            <p>
              <b>Remaining Credits:</b>{" "}
              {booking.package?.name ===
                "Class Card of 5" ||
              booking.package?.name ===
                "TEST PACKAGE"
                ? localStorage.getItem(
                    "legacyCredits"
                  )
                : booking.creditsRemaining}{" "}
              {booking.creditType}
            </p>

            <p>
              <b>Class:</b>{" "}
              {booking.class?.day}{" "}
              {booking.class?.time} —{" "}
              {booking.class?.name}
            </p>

            <p>
              <b>Expiry:</b>{" "}
              {booking.expiryDate}
            </p>
          </div>

          <button
            style={luxuryButton}
            onClick={() =>
              setPage("schedule")
            }
          >
            Book Another Class
          </button>
        </div>
      </div>
    );
  }

  if (page === "schedule") {
    return (
      <div style={pageStyle}>
        <div style={editorialCard}>
          <div style={miniLogo}>L</div>

          <h1 style={editorialTitle}>
            Class Schedule
          </h1>

          <p style={subText}>
            Select your next class.
          </p>

          <div style={classGrid}>
            {classes.map((item) => (
              <button
                key={item.day}
                style={classCard}
                onClick={() =>
                  chooseClass(item)
                }
              >
                <h2 style={classDay}>
                  {item.day}
                </h2>

                <p style={classTime}>
                  {item.time}
                </p>

                <p style={className}>
                  {item.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page === "packages") {
    return (
      <div style={pageStyle}>
        <div style={editorialCard}>
          <div style={miniLogo}>L</div>

          <h1 style={editorialTitle}>
            Packages
          </h1>

          <div style={packageGrid}>
            {packages.map((pkg) => (
              <button
                key={pkg.name}
                style={packageCard}
                onClick={() =>
                  choosePackage(pkg)
                }
              >
                <h2 style={packageName}>
                  {pkg.name}
                </h2>

                <h1 style={packagePrice}>
                  {pkg.price}
                </h1>

                <p style={packageNote}>
                  {pkg.note}
                </p>
              </button>
            ))}
          </div>

          {loading && (
            <p style={subText}>
              Creating secure checkout...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (page === "auth") {
    return (
      <div style={pageStyle}>
        <div style={editorialCard}>
          <div style={miniLogo}>L</div>

          <h1 style={editorialTitle}>
            Login / Sign Up
          </h1>

          <div style={authGrid}>
            <button
              style={authCard}
              onClick={() =>
                setPage("student")
              }
            >
              <h2>Sign Up</h2>
              <p>
                New student registration
              </p>
            </button>

            <button
              style={authCard}
              onClick={() =>
                setPage("login")
              }
            >
              <h2>Login</h2>
              <p>
                Returning student
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (page === "login") {
    return (
      <div style={pageStyle}>
        <div style={editorialCard}>
          <div style={miniLogo}>L</div>

          <h1 style={editorialTitle}>
            Login
          </h1>

          <input
            name="email"
            placeholder="Email Address"
            style={inputStyle}
            onChange={handleLoginChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            style={inputStyle}
            onChange={handleLoginChange}
          />

          <button
            style={luxuryButton}
            onClick={saveLogin}
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
        <div style={editorialCard}>
          <div style={miniLogo}>L</div>

          <h1 style={editorialTitle}>
            Waiver
          </h1>

          <div style={infoCard}>
            <p>
              I understand pole and aerial
              fitness involves physical
              risk.
            </p>

            <p>
              I confirm I am physically fit
              to participate.
            </p>

            <p>
              I agree to follow all safety
              rules and instructor
              instructions.
            </p>

            <p>
              I release Legacy Pole &
              Aerial Studio from claims
              arising from participation,
              except where prohibited by
              law.
            </p>
          </div>

          <label style={checkRow}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) =>
                setAgreed(
                  e.target.checked
                )
              }
            />

            <span>
              I agree to the waiver.
            </span>
          </label>

          <button
            disabled={!agreed}
            style={{
              ...luxuryButton,
              opacity: agreed ? 1 : 0.45
            }}
            onClick={() =>
              setPage("packages")
            }
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (page === "student") {
    return (
      <div style={pageStyle}>
        <div style={editorialCard}>
          <div style={miniLogo}>L</div>

          <h1 style={editorialTitle}>
            Student Information
          </h1>

          <div style={formCard}>
            <input
              name="fullName"
              placeholder="Full Name"
              style={inputStyle}
              onChange={handleStudentChange}
            />

            <input
              name="email"
              placeholder="Email Address"
              style={inputStyle}
              onChange={handleStudentChange}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              style={inputStyle}
              onChange={handleStudentChange}
            />

            <button
              style={luxuryButton}
              onClick={saveStudent}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <div style={logoCircle}>
          L
        </div>

        <div style={navLinks}>
          <span>ABOUT</span>
          <span>CONTACT</span>
        </div>
      </nav>

      <div style={heroContainer}>
        <div style={leftHero}>
          <h1 style={mainTitle}>
            LEGACY
          </h1>

          <p style={mainSubtitle}>
            Pole & Aerial Studio
          </p>

          <p style={description}>
            Premium movement experience
            blending strength,
            confidence, elegance, and
            feminine energy.
          </p>

          <button
            style={luxuryButton}
            onClick={() =>
              setPage("auth")
            }
          >
            Start Booking
          </button>
        </div>

        <div style={artContainer}>
          <div style={circleOne}></div>
          <div style={circleTwo}></div>
          <div style={circleThree}></div>
        </div>
      </div>
    </div>
  );
}

// STYLES

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(to bottom right,#f6eee3,#efe2d1,#f9f5ef)",
  fontFamily: "Georgia, serif",
  color: "#2b2118",
  padding: "40px"
};

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px"
};

const navLinks = {
  display: "flex",
  gap: "40px",
  fontSize: "14px",
  letterSpacing: "2px"
};

const logoCircle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  border: "1px solid #2b2118",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "22px"
};

const heroContainer = {
  display: "grid",
  gridTemplateColumns:
    "1.1fr 0.9fr",
  gap: "60px",
  alignItems: "center",
  maxWidth: "1400px",
  margin: "0 auto",
  minHeight: "80vh"
};

const leftHero = {
  maxWidth: "600px"
};

const mainTitle = {
  fontSize: "110px",
  lineHeight: "0.9",
  margin: 0,
  letterSpacing: "-5px"
};

const mainSubtitle = {
  fontSize: "30px",
  marginTop: "20px"
};

const description = {
  fontSize: "18px",
  lineHeight: "1.8",
  color: "#6e6257",
  marginTop: "30px"
};

const formCard = {
  marginTop: "40px",
  background:
    "rgba(255,255,255,0.5)",
  padding: "30px",
  borderRadius: "30px",
  backdropFilter: "blur(12px)",
  border:
    "1px solid rgba(0,0,0,0.08)"
};

const inputStyle = {
  width: "100%",
  padding: "18px",
  marginBottom: "16px",
  borderRadius: "18px",
  border:
    "1px solid rgba(0,0,0,0.1)",
  background:
    "rgba(255,255,255,0.7)",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none"
};

const luxuryButton = {
  width: "100%",
  padding: "18px",
  borderRadius: "999px",
  border: "none",
  background: "#2b2118",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px",
  letterSpacing: "1px",
  marginTop: "20px"
};

const artContainer = {
  height: "650px",
  position: "relative"
};

const circleOne = {
  position: "absolute",
  width: "350px",
  height: "350px",
  borderRadius: "50%",
  background: "#d8b48c",
  top: "40px",
  left: "60px",
  opacity: 0.7
};

const circleTwo = {
  position: "absolute",
  width: "280px",
  height: "280px",
  borderRadius: "50%",
  background: "#b8865d",
  bottom: "100px",
  right: "40px"
};

const circleThree = {
  position: "absolute",
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background: "#ede0cf",
  top: "220px",
  right: "120px",
  border:
    "1px solid rgba(0,0,0,0.08)"
};

const editorialCard = {
  maxWidth: "900px",
  margin: "0 auto",
  background:
    "rgba(255,255,255,0.45)",
  borderRadius: "40px",
  padding: "50px",
  backdropFilter: "blur(14px)",
  border:
    "1px solid rgba(0,0,0,0.08)"
};

const editorialTitle = {
  fontSize: "72px",
  marginBottom: "20px",
  letterSpacing: "-3px"
};

const subText = {
  color: "#7a6c60",
  marginBottom: "30px"
};

const classGrid = {
  display: "grid",
  gap: "20px"
};

const classCard = {
  padding: "30px",
  borderRadius: "26px",
  border:
    "1px solid rgba(0,0,0,0.08)",
  background:
    "rgba(255,255,255,0.6)",
  cursor: "pointer",
  textAlign: "left"
};

const classDay = {
  margin: 0,
  fontSize: "30px"
};

const classTime = {
  color: "#7a6c60"
};

const className = {
  fontSize: "18px"
};

const packageGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(240px,1fr))",
  gap: "20px"
};

const packageCard = {
  padding: "30px",
  borderRadius: "30px",
  border:
    "1px solid rgba(0,0,0,0.08)",
  background:
    "rgba(255,255,255,0.6)",
  cursor: "pointer",
  textAlign: "left"
};

const packageName = {
  fontSize: "24px"
};

const packagePrice = {
  fontSize: "42px",
  margin: "20px 0",
  color: "#a67c52"
};

const packageNote = {
  color: "#7a6c60"
};

const miniLogo = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  border: "1px solid #2b2118",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "30px",
  fontWeight: "bold"
};

const infoCard = {
  padding: "30px",
  borderRadius: "24px",
  background:
    "rgba(255,255,255,0.55)",
  border:
    "1px solid rgba(0,0,0,0.08)",
  lineHeight: "2"
};

const authGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(240px,1fr))",
  gap: "20px"
};

const authCard = {
  padding: "34px",
  borderRadius: "30px",
  border:
    "1px solid rgba(0,0,0,0.08)",
  background:
    "rgba(255,255,255,0.6)",
  cursor: "pointer",
  textAlign: "left",
  color: "#2b2118"
};

const checkRow = {
  display: "flex",
  gap: "12px",
  marginTop: "28px"
};
