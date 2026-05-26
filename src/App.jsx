import { useState, useEffect } from "react";

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
      type: "Practice Session",
      note: "Contact the studio for practice time schedule"
    },
    {
      name: "Private Class",
      price: "₱3,000",
      amount: 300000,
      credits: 1,
      type: "Private Class",
      note: "Contact the studio for private class schedule"
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

  function saveStudent() {
    localStorage.setItem(
      "legacyStudent",
      JSON.stringify(student)
    );

    setPage("waiver");
  }

  function expiryDate(days) {
    if (!days) return "No expiry";

    const date = new Date();
    date.setDate(date.getDate() + days);

    return date.toLocaleDateString();
  }

  function saveToHistory(studentEmail, booking, pkg) {
    const existingHistory =
      JSON.parse(
        localStorage.getItem(
          `legacyBookedClasses_${studentEmail}`
        )
      ) || [];

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

    localStorage.setItem(
      "legacyPackage",
      JSON.stringify(pkg)
    );

    const savedStudent =
      JSON.parse(
        localStorage.getItem("legacyStudent")
      ) || student;

    const studentEmail =
      savedStudent.email || "guest";

    if (
      pkg.name === "Practice Session" ||
      pkg.name === "Private Class"
    ) {
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

      localStorage.setItem(
        `legacyCredits_${studentEmail}`,
        1
      );

      saveToHistory(studentEmail, booking, pkg);

      sendBookingEmail(booking);

      setLoading(false);
      setPage("dashboard");

      return;
    }

    localStorage.setItem(
      `legacyCredits_${studentEmail}`,
      pkg.credits
    );

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
      JSON.parse(
        localStorage.getItem("legacyStudent")
      ) || student;

    const studentEmail =
      savedStudent.email || "guest";

    const savedPackage =
      JSON.parse(
        localStorage.getItem("legacyPackage")
      ) || selectedPackage;

    const existingCredits =
      Number(
        localStorage.getItem(
          `legacyCredits_${studentEmail}`
        )
      ) || 0;

    const updatedCredits =
      existingCredits - 1;

    localStorage.setItem(
      `legacyCredits_${studentEmail}`,
      updatedCredits
    );

    const booking = {
      student: savedStudent,
      package: savedPackage,
      class: classItem,
      creditsRemaining: updatedCredits,
      creditType: savedPackage?.type,
      purchaseDate: new Date().toLocaleDateString(),
      expiryDate: expiryDate(
        savedPackage?.expiryDays
      )
    };

    saveToHistory(
      studentEmail,
      booking,
      savedPackage
    );

    localStorage.setItem(
      `legacyBooking_${studentEmail}`,
      JSON.stringify(booking)
    );

    sendBookingEmail(booking);

    setPage("dashboard");
  }

  const currentStudent =
    JSON.parse(
      localStorage.getItem("legacyStudent")
    ) || {};

  const currentEmail =
    currentStudent.email || "guest";

  const booking =
    JSON.parse(
      localStorage.getItem(
        `legacyBooking_${currentEmail}`
      )
    ) || {};

  const bookingHistory =
    JSON.parse(
      localStorage.getItem(
        `legacyBookedClasses_${currentEmail}`
      )
    ) || [];

  const currentCredits =
    localStorage.getItem(
      `legacyCredits_${currentEmail}`
    ) || 0;

  if (page === "dashboard") {
    return (
      <div style={pageStyle}>
        <div style={card}>
          <h1>Dashboard</h1>

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
            <b>Credits:</b>{" "}
            {currentCredits}
          </p>

          <hr />

          <h2>Bookings</h2>

          {bookingHistory.map((item, index) => (
            <p key={index}>
              {item.package?.name} —{" "}
              {item.class?.name}
            </p>
          ))}

          <button
            style={button}
            onClick={() =>
              setPage("schedule")
            }
          >
            Book Class
          </button>
        </div>
      </div>
    );
  }

  if (page === "schedule") {
    return (
      <div style={pageStyle}>
        <div style={card}>
          <h1>Schedule</h1>

          {classes.map((item) => (
            <button
              key={item.day}
              style={button}
              onClick={() =>
                chooseClass(item)
              }
            >
              {item.day} — {item.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (page === "packages") {
    return (
      <div style={pageStyle}>
        <div style={card}>
          <h1>Packages</h1>

          {packages.map((pkg) => (
            <button
              key={pkg.name}
              style={button}
              onClick={() =>
                choosePackage(pkg)
              }
            >
              {pkg.name} — {pkg.price}
            </button>
          ))}

          {loading && <p>Loading...</p>}
        </div>
      </div>
    );
  }

  if (page === "waiver") {
    return (
      <div style={pageStyle}>
        <div style={card}>
          <h1>Waiver</h1>

          <label>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) =>
                setAgreed(
                  e.target.checked
                )
              }
            />

            I agree
          </label>

          <button
            disabled={!agreed}
            style={button}
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
        <div style={card}>
          <h1>Student Information</h1>

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
            placeholder="Phone"
            style={input}
            onChange={handleStudentChange}
          />

          <button
            style={button}
            onClick={saveStudent}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={card}>
        <h1>LEGACY</h1>

        <p>Pole & Aerial Studio</p>

        <button
          style={button}
          onClick={() =>
            setPage("student")
          }
        >
          Start Booking
        </button>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#efe7dc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px",
  fontFamily: "Georgia"
};

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "30px",
  width: "100%",
  maxWidth: "700px"
};

const button = {
  width: "100%",
  padding: "16px",
  marginTop: "16px",
  borderRadius: "999px",
  border: "none",
  background: "#2d2015",
  color: "white",
  cursor: "pointer"
};

const input = {
  width: "100%",
  padding: "16px",
  marginBottom: "12px"
};
