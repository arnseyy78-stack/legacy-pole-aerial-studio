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
      price: "FREE",
      amount: 0,
      credits: 5,
      type: "Class Credits",
      note: "Free testing package"
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
      amount: 0,
      credits: 1,
      type: "Practice Session",
      note: "Contact the studio for practice time schedule"
    },
    {
      name: "Private Class",
      price: "₱3,000",
      amount: 0,
      credits: 1,
      type: "Private Class",
      note: "Contact the studio for private class schedule"
    }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("paid") === "true") {
      const savedStudent =
        JSON.parse(localStorage.getItem("legacyStudent")) || {};

      const savedPackage =
        JSON.parse(localStorage.getItem("legacyPackage")) || {};

      const studentEmail = savedStudent.email || "guest";

      localStorage.setItem(
        `legacyCredits_${studentEmail}`,
        savedPackage.credits || 0
      );

      const booking = {
        student: savedStudent,
        package: savedPackage,
        class: {
          name: "Awaiting Class Booking"
        },
        creditsRemaining: savedPackage.credits || 0,
        purchaseDate: new Date().toLocaleDateString(),
        expiryDate: expiryDate(savedPackage.expiryDays)
      };

      localStorage.setItem(
        `legacyBooking_${studentEmail}`,
        JSON.stringify(booking)
      );

      sendBookingEmail(booking);
      setPage("schedule");
    }
  }, []);

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

  function saveLogin() {
    const returningStudent = {
      fullName: "Returning Student",
      email: login.email,
      phone: ""
    };

    localStorage.setItem("legacyStudent", JSON.stringify(returningStudent));
    setPage("packages");
  }

  function expiryDate(days) {
    if (!days) return "No expiry";

    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString();
  }

  function saveToHistory(studentEmail, booking, pkg) {
    const existingHistory =
      JSON.parse(localStorage.getItem(`legacyBookedClasses_${studentEmail}`)) ||
      [];

    const updatedHistory = [
      ...existingHistory,
      {
        class: booking.class,
        package: pkg,
        bookedDate: new Date().toLocaleDateString()
      }
    ];

    localStorage.setItem(
      `legacyBookedClasses_${studentEmail}`,
      JSON.stringify(updatedHistory)
    );
  }

  function sendBookingEmail(booking) {
    fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        studentName: booking.student?.fullName,
        studentEmail: booking.student?.email,
        packageName: booking.package?.name,
        className: booking.class?.name || "No class selected",
        amount: booking.package?.price,
        credits: booking.creditsRemaining,
        expiry: booking.expiryDate
      })
    }).catch((error) => {
      console.log("Email error", error);
    });
  }

  async function choosePackage(pkg) {
    setLoading(true);
    setSelectedPackage(pkg);
    localStorage.setItem("legacyPackage", JSON.stringify(pkg));

    const savedStudent =
      JSON.parse(localStorage.getItem("legacyStudent")) || student;

    const studentEmail = savedStudent.email || "guest";

    if (pkg.name === "TEST PACKAGE") {
      const booking = {
        student: savedStudent,
        package: pkg,
        class: {
          day: "Test Package",
          time: "Free Test",
          name: "Test package selected"
        },
        creditsRemaining: 5,
        creditType: pkg.type,
        purchaseDate: new Date().toLocaleDateString(),
        expiryDate: "No expiry"
      };

      localStorage.setItem(
        `legacyBooking_${studentEmail}`,
        JSON.stringify(booking)
      );

      localStorage.setItem(`legacyCredits_${studentEmail}`, 5);

      saveToHistory(studentEmail, booking, pkg);
      sendBookingEmail(booking);

      setLoading(false);
      setPage("dashboard");
      return;
    }

    if (pkg.name === "Practice Session" || pkg.name === "Private Class") {
      const booking = {
        student: savedStudent,
        package: pkg,
        class: {
          day: pkg.name,
          time: "Contact Studio",
          name:
            pkg.name === "Practice Session"
              ? "Contact the studio for practice time schedule"
              : "Contact the studio for private class time schedule"
        },
        creditsRemaining: 1,
        creditType: pkg.type,
        purchaseDate: new Date().toLocaleDateString(),
        expiryDate: "Contact studio"
      };

      localStorage.setItem(
        `legacyBooking_${studentEmail}`,
        JSON.stringify(booking)
      );

      localStorage.setItem(`legacyCredits_${studentEmail}`, 1);

      saveToHistory(studentEmail, booking, pkg);
      sendBookingEmail(booking);

      setLoading(false);
      setPage("dashboard");
      return;
    }

    localStorage.setItem(`legacyCredits_${studentEmail}`, pkg.credits);

    try {
      const response = await fetch("/api/create-checkout", {
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
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Checkout failed.");
        setLoading(false);
      }
    } catch {
      alert("Checkout error.");
      setLoading(false);
    }
  }

  async function chooseClass(classItem) {
    const savedStudent =
      JSON.parse(localStorage.getItem("legacyStudent")) || student;

    const studentEmail = savedStudent.email || "guest";

    const savedPackage =
      JSON.parse(localStorage.getItem("legacyPackage")) || selectedPackage;

    const existingCredits =
      Number(localStorage.getItem(`legacyCredits_${studentEmail}`)) || 0;

    if (existingCredits <= 0) {
      const choice = window.confirm(
        "No credits remaining.\n\nPress OK to buy a new package.\nPress Cancel to view dashboard."
      );

      if (choice) setPage("packages");
      else setPage("dashboard");

      return;
    }

    const updatedCredits = existingCredits - 1;
    localStorage.setItem(`legacyCredits_${studentEmail}`, updatedCredits);

    const booking = {
      student: savedStudent,
      package: savedPackage,
      class: classItem,
      creditsRemaining: updatedCredits,
      creditType: savedPackage?.type,
      purchaseDate: new Date().toLocaleDateString(),
      expiryDate: expiryDate(savedPackage?.expiryDays)
    };

    saveToHistory(studentEmail, booking, savedPackage);

    localStorage.setItem(
      `legacyBooking_${studentEmail}`,
      JSON.stringify(booking)
    );

    sendBookingEmail(booking);
    setPage("dashboard");
  }

  const currentStudent =
    JSON.parse(localStorage.getItem("legacyStudent")) || {};

  const currentEmail = currentStudent.email || "guest";

  const booking =
    JSON.parse(localStorage.getItem(`legacyBooking_${currentEmail}`)) || {};

  const bookingHistory =
    JSON.parse(localStorage.getItem(`legacyBookedClasses_${currentEmail}`)) ||
    [];

  const currentCredits =
    localStorage.getItem(`legacyCredits_${currentEmail}`) || 0;

  if (page === "dashboard") {
    return (
      <Shell>
        <Card>
          <SmallLabel>Student Portal</SmallLabel>
          <h1 style={title}>Dashboard</h1>

          <div style={infoBox}>
            <p><b>Name:</b> {booking.student?.fullName}</p>
            <p><b>Email:</b> {booking.student?.email}</p>
            <p><b>Package:</b> {booking.package?.name}</p>
            <p><b>Credits:</b> {currentCredits}</p>
            <p><b>Expiry:</b> {booking.expiryDate}</p>
          </div>

          <h2 style={sectionTitle}>Bookings</h2>

          <div style={infoBox}>
            {bookingHistory.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              bookingHistory.map((item, index) => (
                <p key={index}>
                  <b>{index + 1}.</b> {item.package?.name} —{" "}
                  {item.class?.name}
                </p>
              ))
            )}
          </div>

          <button style={goldButton} onClick={() => setPage("schedule")}>
            Book Class
          </button>

          <button style={darkButton} onClick={() => setPage("packages")}>
            Buy Package
          </button>
        </Card>
      </Shell>
    );
  }

  if (page === "schedule") {
    return (
      <Shell>
        <Card>
          <SmallLabel>Class Schedule</SmallLabel>
          <h1 style={title}>Choose Your Class</h1>

          <div style={grid}>
            {classes.map((item) => (
              <button
                key={item.day}
                style={luxuryCard}
                onClick={() => chooseClass(item)}
              >
                <span style={goldText}>{item.day}</span>
                <h2>{item.name}</h2>
                <p>{item.time}</p>
              </button>
            ))}
          </div>
        </Card>
      </Shell>
    );
  }

  if (page === "packages") {
    return (
      <Shell>
        <Card>
          <SmallLabel>Membership</SmallLabel>
          <h1 style={title}>Packages</h1>

          <div style={grid}>
            {packages.map((pkg) => (
              <button
                key={pkg.name}
                style={luxuryCard}
                onClick={() => choosePackage(pkg)}
              >
                <span style={goldText}>{pkg.name}</span>
                <h2>{pkg.price}</h2>
                <p>{pkg.note}</p>
              </button>
            ))}
          </div>

          {loading && <p style={muted}>Creating secure checkout...</p>}
        </Card>
      </Shell>
    );
  }

  if (page === "auth") {
    return (
      <Shell>
        <Card>
          <SmallLabel>Begin Your Journey</SmallLabel>
          <h1 style={title}>Login or Sign Up</h1>

          <button style={goldButton} onClick={() => setPage("student")}>
            New Student
          </button>

          <button style={darkButton} onClick={() => setPage("login")}>
            Returning Student
          </button>
        </Card>
      </Shell>
    );
  }

  if (page === "login") {
    return (
      <Shell>
        <Card>
          <SmallLabel>Welcome Back</SmallLabel>
          <h1 style={title}>Login</h1>

          <input
            name="email"
            placeholder="Email Address"
            style={input}
            onChange={handleLoginChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            style={input}
            onChange={handleLoginChange}
          />

          <button style={goldButton} onClick={saveLogin}>
            Continue
          </button>
        </Card>
      </Shell>
    );
  }

  if (page === "student") {
    return (
      <Shell>
        <Card>
          <SmallLabel>Student Details</SmallLabel>
          <h1 style={title}>Create Account</h1>

          <input
            name="fullName"
            placeholder="Full Name"
            style={input}
            onChange={handleStudentChange}
          />

          <input
            name="email"
            placeholder="Email"
            style={input}
            onChange={handleStudentChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            style={input}
            onChange={handleStudentChange}
          />

          <button style={goldButton} onClick={saveStudent}>
            Continue
          </button>
        </Card>
      </Shell>
    );
  }

  if (page === "waiver") {
    return (
      <Shell>
        <Card>
          <SmallLabel>Studio Waiver</SmallLabel>
          <h1 style={title}>Before You Begin</h1>

          <div style={infoBox}>
            <p>I understand pole fitness involves physical activity.</p>
            <p>I agree to participate at my own risk.</p>
          </div>

          <label style={checkRow}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>I agree to the waiver.</span>
          </label>

          <button
            disabled={!agreed}
            style={{
              ...goldButton,
              opacity: agreed ? 1 : 0.4,
              cursor: agreed ? "pointer" : "not-allowed"
            }}
            onClick={() => setPage("packages")}
          >
            Continue
          </button>
        </Card>
      </Shell>
    );
  }

  return (
    <main style={homePage}>
      <nav style={nav}>
        <div style={brand}>
          <div style={logo}>L</div>
          <div>
            <strong>LEGACY</strong>
            <span>Pole & Aerial Studio</span>
          </div>
        </div>

        <button style={navButton} onClick={() => setPage("auth")}>
          Book Now
        </button>
      </nav>

      <section style={hero}>
        <div style={heroText}>
          <p style={goldText}>WELCOME TO LEGACY</p>
          <h1 style={heroTitle}>
            Strength.
            <br />
            Elegance.
            <br />
            Legacy.
          </h1>
          <p style={heroSubtitle}>
            A luxury pole and aerial studio built for confidence, movement,
            strength, and self-expression.
          </p>

          <button style={goldButton} onClick={() => setPage("auth")}>
            Start Booking
          </button>
        </div>

        <div style={heroImage}>
          <div style={imageGlow}>L</div>
        </div>
      </section>
    </main>
  );
}

function Shell({ children }) {
  return (
    <main style={page}>
      <nav style={nav}>
        <div style={brand}>
          <div style={logo}>L</div>
          <div>
            <strong>LEGACY</strong>
            <span>Pole & Aerial Studio</span>
          </div>
        </div>
      </nav>
      {children}
    </main>
  );
}

function Card({ children }) {
  return <section style={card}>{children}</section>;
}

function SmallLabel({ children }) {
  return <p style={label}>{children}</p>;
}

const page = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, #1b1710 0%, #0b0b0b 45%, #050505 100%)",
  color: "#f7f1e8",
  padding: "28px",
  fontFamily: "Inter, Arial, sans-serif"
};

const homePage = {
  ...page,
  overflow: "hidden"
};

const nav = {
  maxWidth: "1180px",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 0"
};

const brand = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  letterSpacing: "4px",
  textTransform: "uppercase"
};

const logo = {
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  border: "1px solid #c8a96b",
  color: "#c8a96b",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Georgia, serif",
  fontSize: "22px"
};

const navButton = {
  background: "#c8a96b",
  color: "#090909",
  border: "none",
  padding: "14px 28px",
  borderRadius: "999px",
  fontWeight: "700",
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: "1px"
};

const hero = {
  maxWidth: "1180px",
  margin: "70px auto 0",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "50px",
  alignItems: "center"
};

const heroText = {
  maxWidth: "560px"
};

const heroTitle = {
  fontFamily: "Georgia, serif",
  fontSize: "86px",
  lineHeight: "0.95",
  margin: "20px 0",
  letterSpacing: "2px"
};

const heroSubtitle = {
  color: "#cfc7ba",
  fontSize: "18px",
  lineHeight: "1.8",
  marginBottom: "30px"
};

const heroImage = {
  minHeight: "520px",
  borderRadius: "40px",
  border: "1px solid rgba(200,169,107,0.3)",
  background:
    "linear-gradient(145deg, rgba(200,169,107,0.18), rgba(255,255,255,0.03)), #111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 30px 100px rgba(0,0,0,0.6)"
};

const imageGlow = {
  fontFamily: "Georgia, serif",
  fontSize: "220px",
  color: "rgba(200,169,107,0.18)"
};

const card = {
  maxWidth: "900px",
  margin: "60px auto",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(200,169,107,0.25)",
  borderRadius: "34px",
  padding: "44px",
  boxShadow: "0 30px 90px rgba(0,0,0,0.45)"
};

const title = {
  fontFamily: "Georgia, serif",
  fontSize: "54px",
  margin: "10px 0 28px"
};

const label = {
  color: "#c8a96b",
  letterSpacing: "3px",
  textTransform: "uppercase",
  fontSize: "13px"
};

const grid = {
  display: "grid",
  gap: "18px"
};

const luxuryCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(200,169,107,0.25)",
  color: "#f7f1e8",
  borderRadius: "24px",
  padding: "26px",
  textAlign: "left",
  cursor: "pointer"
};

const goldButton = {
  width: "100%",
  background: "#c8a96b",
  color: "#090909",
  border: "none",
  padding: "17px",
  borderRadius: "999px",
  fontWeight: "800",
  cursor: "pointer",
  marginTop: "18px",
  letterSpacing: "1px"
};

const darkButton = {
  ...goldButton,
  background: "transparent",
  color: "#c8a96b",
  border: "1px solid rgba(200,169,107,0.5)"
};

const input = {
  width: "100%",
  padding: "17px",
  marginBottom: "14px",
  borderRadius: "16px",
  border: "1px solid rgba(200,169,107,0.3)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  boxSizing: "border-box",
  fontSize: "16px"
};

const infoBox = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(200,169,107,0.22)",
  borderRadius: "24px",
  padding: "24px",
  lineHeight: "1.9"
};

const sectionTitle = {
  fontFamily: "Georgia, serif",
  marginTop: "34px"
};

const checkRow = {
  display: "flex",
  gap: "12px",
  marginTop: "20px",
  color: "#eee"
};

const goldText = {
  color: "#c8a96b",
  letterSpacing: "3px",
  textTransform: "uppercase"
};

const muted = {
  color: "#cfc7ba"
};
