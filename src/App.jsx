import { useEffect, useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");
  const [agreed, setAgreed] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [student, setStudent] = useState({ fullName: "", email: "", phone: "" });
  const [login, setLogin] = useState({ email: "", password: "" });

  const classes = [
    { day: "Monday", time: "6:00 PM", name: "Pole Fitness" },
    { day: "Tuesday", time: "6:00 PM", name: "Pole Flow" },
    { day: "Wednesday", time: "6:00 PM", name: "Spinny Pole" },
    { day: "Thursday", time: "6:00 PM", name: "Mat Flexibility" },
    { day: "Friday", time: "6:00 PM", name: "Heels and Steel" },
    { day: "Saturday", time: "6:00 PM", name: "Floor Work" }
  ];

  const packages = [
    { name: "TEST PACKAGE", price: "FREE", amount: 0, credits: 5, type: "Class Credits", note: "Free testing package" },
    { name: "Single Pass", price: "₱850", amount: 85000, credits: 1, type: "Class Credit", note: "One class access" },
    { name: "Class Card of 5", price: "₱4,000", amount: 400000, credits: 5, type: "Class Credits", note: "Consumable within 30 days", expiryDays: 30 },
    { name: "Practice Session", price: "₱550", amount: 0, credits: 1, type: "Practice Session", note: "Contact the studio for practice time schedule" },
    { name: "Private Class", price: "₱3,000", amount: 0, credits: 1, type: "Private Class", note: "Contact the studio for private class schedule" }
  ];

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("paid") === "true") {

    const savedStudent =
      JSON.parse(localStorage.getItem("legacyStudent")) || {};

    const savedPackage =
      JSON.parse(localStorage.getItem("legacyPackage")) || {};

    const booking = {
      student: savedStudent,
      package: savedPackage,
      class: {
        name: "Awaiting Class Booking"
      },
      creditsRemaining: savedPackage.credits,
      expiryDate: expiryDate(savedPackage.expiryDays)
    };

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
      JSON.parse(localStorage.getItem(`legacyBookedClasses_${studentEmail}`)) || [];

    const updatedHistory = [
      ...existingHistory,
      {
        class: booking.class,
        package: pkg,
        bookedDate: new Date().toLocaleDateString()
      }
      async function sendBookingEmail(booking) {
  try {
    await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        studentName: booking.student?.fullName,
        studentEmail: booking.student?.email,
        packageName: booking.package?.name,
        className:
          booking.class?.name || "No class selected",
        amount: booking.package?.price,
        credits: booking.creditsRemaining,
        expiry: booking.expiryDate
      })
    });
  } catch (error) {
    console.log("Email error", error);
  }
}
    ];

    localStorage.setItem(
      `legacyBookedClasses_${studentEmail}`,
      JSON.stringify(updatedHistory)
    );
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
        class: null,
        creditsRemaining: 5,
        creditType: pkg.type,
        purchaseDate: new Date().toLocaleDateString(),
        expiryDate: "No expiry"
      };

      localStorage.setItem(`legacyBooking_${studentEmail}`, JSON.stringify(booking));
      localStorage.setItem(`legacyCredits_${studentEmail}`, 5);

      setLoading(false);
      setPage("schedule");
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

      localStorage.setItem(`legacyBooking_${studentEmail}`, JSON.stringify(booking));
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
        headers: { "Content-Type": "application/json" },
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
    JSON.parse(localStorage.getItem(`legacyBookedClasses_${currentEmail}`)) || [];

  const currentCredits =
    localStorage.getItem(`legacyCredits_${currentEmail}`) || 0;

  if (page === "dashboard") {
    const isContactSchedule =
      booking.package?.name === "Practice Session" ||
      booking.package?.name === "Private Class";

    return (
      <div style={pageStyle}>
        <div style={editorialCard}>
          <div style={miniLogo}>L</div>
          <h1 style={editorialTitle}>Student Dashboard</h1>

          <div style={infoCard}>
            <p><b>Name:</b> {booking.student?.fullName}</p>
            <p><b>Email:</b> {booking.student?.email}</p>
            <p><b>Package:</b> {booking.package?.name}</p>
            <p><b>Remaining Credits:</b> {currentCredits}</p>
            <p><b>Expiry:</b> {booking.expiryDate}</p>

            {isContactSchedule && (
              <p><b>Schedule:</b> Contact the studio for time schedule.</p>
            )}
          </div>

          <h2 style={{ marginTop: "40px" }}>Booked Packages & Classes</h2>

          <div style={infoCard}>
            {bookingHistory.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              bookingHistory.map((item, index) => (
                <p key={index}>
                  <b>{index + 1}.</b> {item.package?.name} — {item.class.day}{" "}
                  {item.class.time} — {item.class.name}
                </p>
              ))
            )}
          </div>

          <button
            style={luxuryButton}
            onClick={() => isContactSchedule ? setPage("packages") : setPage("schedule")}
          >
            {isContactSchedule ? "Buy Another Package" : "Book Another Class"}
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
          <h1 style={editorialTitle}>Class Schedule</h1>

          <div style={classGrid}>
            {classes.map((item) => (
              <button key={item.day} style={classCard} onClick={() => chooseClass(item)}>
                <h2 style={classDay}>{item.day}</h2>
                <p style={classTime}>{item.time}</p>
                <p style={className}>{item.name}</p>
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
          <h1 style={editorialTitle}>Packages</h1>

          <div style={packageGrid}>
            {packages.map((pkg) => (
              <button key={pkg.name} style={packageCard} onClick={() => choosePackage(pkg)}>
                <h2 style={packageName}>{pkg.name}</h2>
                <h1 style={packagePrice}>{pkg.price}</h1>
                <p style={packageNote}>{pkg.note}</p>
              </button>
            ))}
          </div>

          {loading && <p>Creating secure checkout...</p>}
        </div>
      </div>
    );
  }

  if (page === "auth") {
    return (
      <div style={pageStyle}>
        <div style={editorialCard}>
          <div style={miniLogo}>L</div>
          <h1 style={editorialTitle}>Login / Sign Up</h1>

          <div style={authGrid}>
            <button style={authCard} onClick={() => setPage("student")}>
              <h2>Sign Up</h2>
            </button>

            <button style={authCard} onClick={() => setPage("login")}>
              <h2>Login</h2>
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
          <h1 style={editorialTitle}>Login</h1>

          <input
            name="email"
            placeholder="Email Address"
            style={inputStyle}
            onChange={handleLoginChange}
          />

          <input type="password" placeholder="Password" style={inputStyle} />

          <button style={luxuryButton} onClick={saveLogin}>
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
          <h1 style={editorialTitle}>Waiver</h1>

          <div style={infoCard}>
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
            style={luxuryButton}
            onClick={() => setPage("packages")}
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
          <h1 style={editorialTitle}>Student Information</h1>

          <input
            name="fullName"
            placeholder="Full Name"
            style={inputStyle}
            onChange={handleStudentChange}
          />

          <input
            name="email"
            placeholder="Email"
            style={inputStyle}
            onChange={handleStudentChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            style={inputStyle}
            onChange={handleStudentChange}
          />

          <button style={luxuryButton} onClick={saveStudent}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={heroContainer}>
        <div>
          <div style={logoCircle}>L</div>
          <h1 style={mainTitle}>LEGACY</h1>
          <p style={mainSubtitle}>Pole & Aerial Studio</p>

          <button style={luxuryButton} onClick={() => setPage("auth")}>
            Start Booking
          </button>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#efe7dc",
  padding: "40px",
  fontFamily: "Georgia, serif",
  color: "#2d2015"
};

const heroContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh"
};

const editorialCard = {
  maxWidth: "900px",
  margin: "0 auto",
  background: "#f8f4ee",
  borderRadius: "40px",
  padding: "50px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.06)"
};

const editorialTitle = {
  fontSize: "68px",
  marginBottom: "30px"
};

const luxuryButton = {
  width: "100%",
  padding: "18px",
  borderRadius: "999px",
  border: "none",
  background: "#2d2015",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "30px"
};

const inputStyle = {
  width: "100%",
  padding: "18px",
  marginBottom: "16px",
  borderRadius: "20px",
  border: "1px solid #ddd",
  fontSize: "16px",
  boxSizing: "border-box"
};

const packageGrid = {
  display: "grid",
  gap: "20px"
};

const packageCard = {
  padding: "30px",
  borderRadius: "30px",
  background: "white",
  border: "1px solid #ddd",
  cursor: "pointer",
  textAlign: "left"
};

const packageName = {
  fontSize: "28px"
};

const packagePrice = {
  fontSize: "40px",
  color: "#9b6b43"
};

const packageNote = {
  color: "#666"
};

const classGrid = {
  display: "grid",
  gap: "20px"
};

const classCard = {
  padding: "30px",
  borderRadius: "30px",
  background: "white",
  border: "1px solid #ddd",
  cursor: "pointer",
  textAlign: "left"
};

const classDay = {
  fontSize: "40px"
};

const classTime = {
  color: "#777"
};

const className = {
  fontSize: "20px"
};

const authGrid = {
  display: "grid",
  gap: "20px"
};

const authCard = {
  padding: "40px",
  borderRadius: "30px",
  background: "white",
  border: "1px solid #ddd",
  cursor: "pointer"
};

const infoCard = {
  padding: "30px",
  borderRadius: "30px",
  background: "white",
  border: "1px solid #ddd",
  lineHeight: "2"
};

const logoCircle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  border: "1px solid #2d2015",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "bold",
  marginBottom: "20px"
};

const mainTitle = {
  fontSize: "120px",
  margin: 0
};

const mainSubtitle = {
  fontSize: "28px",
  marginBottom: "40px"
};

const miniLogo = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  border: "1px solid #2d2015",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "20px"
};

const checkRow = {
  display: "flex",
  gap: "10px",
  marginTop: "20px"
};
