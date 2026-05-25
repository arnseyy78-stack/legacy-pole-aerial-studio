import { useEffect, useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");
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
      credits: 1,
      type: "Test Credit",
      note: "Test checkout only"
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
      note: "Consumable within 30 days"
    }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("paid") === "true") {
      setPage("dashboard");
    }
  }, []);

  function handleChange(e) {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  }

  function continueToClasses() {
    localStorage.setItem("legacyStudent", JSON.stringify(student));
    setPage("classes");
  }

  function chooseClass(item) {
    setSelectedClass(item);
    localStorage.setItem("legacyClass", JSON.stringify(item));
    setPage("packages");
  }

  async function choosePackage(pkg) {
    setLoading(true);

    localStorage.setItem(
      "legacyBooking",
      JSON.stringify({
        student,
        class: selectedClass,
        package: pkg
      })
    );

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          packageName: pkg.name,
          amount: pkg.amount,
          studentName: student.fullName,
          studentEmail: student.email,
          className: `${selectedClass.day} ${selectedClass.time} - ${selectedClass.name}`
        })
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Checkout failed.");
      }
    } catch {
      alert("Checkout error.");
    }

    setLoading(false);
  }

  const booking =
    JSON.parse(localStorage.getItem("legacyBooking")) || {};

  if (page === "dashboard") {
    return (
      <div style={pageStyle}>
        <div style={editorialCard}>
          <div style={miniLogo}>L</div>

          <h1 style={editorialTitle}>Class Booked</h1>

          <div style={infoCard}>
            <p><b>Name:</b> {booking.student?.fullName}</p>
            <p><b>Email:</b> {booking.student?.email}</p>
            <p>
              <b>Class:</b>{" "}
              {booking.class?.day} {booking.class?.time} —{" "}
              {booking.class?.name}
            </p>
            <p><b>Package:</b> {booking.package?.name}</p>
            <p><b>Amount:</b> {booking.package?.price}</p>
          </div>

          <button
            style={luxuryButton}
            onClick={() => setPage("classes")}
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
        <div style={editorialCard}>
          <div style={miniLogo}>L</div>

          <h1 style={editorialTitle}>Packages</h1>

          <p style={subText}>
            {selectedClass.day} {selectedClass.time} —{" "}
            {selectedClass.name}
          </p>

          <div style={packageGrid}>
            {packages.map((pkg) => (
              <button
                key={pkg.name}
                style={packageCard}
                onClick={() => choosePackage(pkg)}
              >
                <h2 style={packageName}>{pkg.name}</h2>

                <h1 style={packagePrice}>{pkg.price}</h1>

                <p style={packageNote}>{pkg.note}</p>
              </button>
            ))}
          </div>

          {loading && (
            <p style={subText}>Creating secure checkout...</p>
          )}
        </div>
      </div>
    );
  }

  if (page === "classes") {
    return (
      <div style={pageStyle}>
        <div style={editorialCard}>
          <div style={miniLogo}>L</div>

          <h1 style={editorialTitle}>Classes</h1>

          <div style={classGrid}>
            {classes.map((item) => (
              <button
                key={item.day}
                style={classCard}
                onClick={() => chooseClass(item)}
              >
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

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <div style={logoCircle}>L</div>

        <div style={navLinks}>
          <span>ABOUT</span>
          <span>CONTACT</span>
        </div>
      </nav>

      <div style={heroContainer}>
        <div style={leftHero}>
          <h1 style={mainTitle}>LEGACY</h1>

          <p style={mainSubtitle}>
            Pole & Aerial Studio
          </p>

          <p style={description}>
            Premium movement experience blending strength,
            confidence, elegance, and feminine energy.
          </p>

          <div style={formCard}>
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

            <button
              style={luxuryButton}
              onClick={continueToClasses}
            >
              Start Booking
            </button>
          </div>
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
  gridTemplateColumns: "1.1fr 0.9fr",
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
  background: "rgba(255,255,255,0.5)",
  padding: "30px",
  borderRadius: "30px",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(0,0,0,0.08)"
};

const inputStyle = {
  width: "100%",
  padding: "18px",
  marginBottom: "16px",
  borderRadius: "18px",
  border: "1px solid rgba(0,0,0,0.1)",
  background: "rgba(255,255,255,0.7)",
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
  letterSpacing: "1px"
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
  border: "1px solid rgba(0,0,0,0.08)"
};

const editorialCard = {
  maxWidth: "900px",
  margin: "0 auto",
  background: "rgba(255,255,255,0.45)",
  borderRadius: "40px",
  padding: "50px",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(0,0,0,0.08)"
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
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.6)",
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
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "20px"
};

const packageCard = {
  padding: "30px",
  borderRadius: "30px",
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.6)",
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
  background: "rgba(255,255,255,0.55)",
  border: "1px solid rgba(0,0,0,0.08)",
  lineHeight: "2"
};
