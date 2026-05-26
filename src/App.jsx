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

      const booking = {
        student: savedStudent,
        package: savedPackage,
        class: {
          name: "Awaiting Class Booking"
        },
        creditsRemaining: savedPackage.credits,
        expiryDate: expiryDate(savedPackage.expiryDays)
      };

      

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

    localStorage.setItem(
      "legacyPackage",
      JSON.stringify(pkg)
    );

    const savedStudent =
      JSON.parse(localStorage.getItem("legacyStudent")) ||
      student;

    const studentEmail =
      savedStudent.email || "guest";

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

      localStorage.setItem(
        `legacyBooking_${studentEmail}`,
        JSON.stringify(booking)
      );

      localStorage.setItem(
        `legacyCredits_${studentEmail}`,
        5
      );

      

      setLoading(false);
      setPage("schedule");

      return;
    }

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
      JSON.parse(localStorage.getItem("legacyStudent")) ||
      student;

    const studentEmail =
      savedStudent.email || "guest";

    const savedPackage =
      JSON.parse(localStorage.getItem("legacyPackage")) ||
      selectedPackage;

    const existingCredits =
      Number(
        localStorage.getItem(
          `legacyCredits_${studentEmail}`
        )
      ) || 0;

    if (existingCredits <= 0) {
      const choice = window.confirm(
        "No credits remaining.\n\nPress OK to buy a new package.\nPress Cancel to view dashboard."
      );

      if (choice) setPage("packages");
      else setPage("dashboard");

      return;
    }

    const updatedCredits = existingCredits - 1;

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
      expiryDate: expiryDate(savedPackage?.expiryDays)
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

    

    setPage("dashboard");
  }

  const currentStudent =
    JSON.parse(localStorage.getItem("legacyStudent")) ||
    {};

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
    const isContactSchedule =
      booking.package?.name === "Practice Session" ||
      booking.package?.name === "Private Class";

    return <div>Dashboard Working</div>;
  }

  return <div>Legacy Studio</div>;
}
