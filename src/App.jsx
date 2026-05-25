// PART 1

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

    const savedStudent =
      JSON.parse(localStorage.getItem("legacyStudent")) || student;

    const studentEmail = savedStudent.email;

    // TEST PACKAGE FREE
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

    if (pkg.name === "Class Card of 5") {
      localStorage.setItem(
        `legacyCredits_${studentEmail}`,
        5
      );
    }

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
