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
    async function handlePackagePurchase(pkg) {
    setSelectedPackage(pkg);

    if (pkg.amount === 0) {
      const savedStudent =
        JSON.parse(localStorage.getItem("legacyStudent")) || {};

      localStorage.setItem(
        `legacyCredits_${savedStudent.email}`,
        pkg.credits
      );

      localStorage.setItem(
        "legacyPackage",
        JSON.stringify(pkg)
      );

      const booking = {
        student: savedStudent,
        package: pkg,
        class: {
          name: "No class selected"
        },
        creditsRemaining: pkg.credits,
        purchaseDate: new Date().toLocaleDateString(),
        expiryDate: expiryDate(pkg.expiryDays)
      };

      localStorage.setItem(
        `legacyBooking_${savedStudent.email}`,
        JSON.stringify(booking)
      );

      sendBookingEmail(booking);

      setPage("schedule");
      return;
    }

    try {
      setLoading(true);

      localStorage.setItem(
        "legacyPackage",
        JSON.stringify(pkg)
      );

      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: pkg.amount,
          description: pkg.name
        })
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.log(error);
      alert("Payment error");
    } finally {
      setLoading(false);
    }
  }

  function bookClass(selectedClass) {
    const savedStudent =
      JSON.parse(localStorage.getItem("legacyStudent")) || {};

    const savedPackage =
      JSON.parse(localStorage.getItem("legacyPackage")) || {};

    const currentCredits =
      Number(
        localStorage.getItem(
          `legacyCredits_${savedStudent.email}`
        )
      ) || 0;

    if (currentCredits <= 0) {
      alert("No credits remaining.");
      return;
    }

    const updatedCredits = currentCredits - 1;

    localStorage.setItem(
      `legacyCredits_${savedStudent.email}`,
      updatedCredits
    );

    const booking = {
      student: savedStudent,
      package: savedPackage,
      class: selectedClass,
      creditsRemaining: updatedCredits,
      bookedDate: new Date().toLocaleDateString(),
      expiryDate: expiryDate(savedPackage.expiryDays)
    };

    localStorage.setItem(
      `legacyBooking_${savedStudent.email}`,
      JSON.stringify(booking)
    );

    saveToHistory(savedStudent.email, booking, savedPackage);

    sendBookingEmail(booking);

    alert("Class booked successfully!");
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* NAVBAR */}

      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-yellow-600/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-[0.3em] text-yellow-500">
              LEGACY
            </h1>

            <p className="text-[10px] tracking-[0.4em] text-gray-400">
              POLE & AERIAL STUDIO
            </p>
          </div>

          <div className="hidden md:flex gap-10 text-sm tracking-[0.2em] uppercase">
            <button
              onClick={() => setPage("home")}
              className="hover:text-yellow-500 transition"
            >
              Home
            </button>

            <button
              onClick={() => setPage("schedule")}
              className="hover:text-yellow-500 transition"
            >
              Classes
            </button>

            <button
              onClick={() => setPage("packages")}
              className="hover:text-yellow-500 transition"
            >
              Packages
            </button>

            <button
              onClick={() => setPage("contact")}
              className="hover:text-yellow-500 transition"
            >
              Contact
            </button>
          </div>

          <button
            onClick={() => setPage("student")}
            className="bg-yellow-500 text-black px-6 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-yellow-400 transition"
          >
            Book Now
          </button>
        </div>
      </nav>

      {/* HERO */}

      {page === "home" && (
        <div className="relative min-h-screen flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20 z-10"></div>

          <img
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1974&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />

          <div className="relative z-20 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-6xl md:text-8xl font-light leading-none tracking-tight">
                STRENGTH.
                <br />
                ELEGANCE.
                <br />
                <span className="text-yellow-500">LEGACY.</span>
              </h1>

              <div className="w-24 h-[1px] bg-yellow-500 my-8"></div>

              <p className="text-gray-300 text-lg max-w-lg leading-relaxed">
                Empowering you to rise, move, and become your strongest self
                through pole and aerial artistry.
              </p>

              <button
                onClick={() => setPage("student")}
                className="mt-10 bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-full uppercase tracking-[0.25em] text-sm transition"
              >
                Book Your Class
              </button>
            </div>
                        <div className="hidden md:flex justify-center">
              <div className="relative w-[420px] h-[520px] border border-yellow-600/30 rounded-t-full overflow-hidden bg-gradient-to-b from-yellow-900/20 to-black shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[220px] text-yellow-700/10 font-serif">
                    L
                  </span>
                </div>

                <div className="absolute bottom-10 left-10 right-10 text-center">
                  <p className="tracking-[0.4em] text-yellow-500 text-xs">
                    POLE & AERIAL STUDIO
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WELCOME SECTION */}

      {page === "home" && (
        <section className="bg-black border-t border-yellow-600/30 py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="min-h-[480px] rounded-t-full border border-yellow-600/20 bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center">
              <span className="text-[180px] text-yellow-700/10 font-serif">
                L
              </span>
            </div>

            <div className="text-center md:text-left">
              <p className="text-yellow-500 tracking-[0.4em] text-sm mb-6">
                WELCOME TO
              </p>

              <h2 className="text-4xl md:text-6xl font-light font-serif mb-8">
                Legacy Pole & Aerial Studio
              </h2>

              <p className="text-gray-300 leading-loose text-lg">
                A safe, empowering, and inclusive space for every individual to
                discover strength, confidence, artistry, and movement.
              </p>

              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="border-l border-yellow-600/40 pl-5">
                  <h3 className="text-yellow-500 tracking-widest uppercase">
                    Safe
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">
                    Beginner friendly environment.
                  </p>
                </div>

                <div className="border-l border-yellow-600/40 pl-5">
                  <h3 className="text-yellow-500 tracking-widest uppercase">
                    Strong
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">
                    Build confidence and control.
                  </p>
                </div>

                <div className="border-l border-yellow-600/40 pl-5">
                  <h3 className="text-yellow-500 tracking-widest uppercase">
                    Elegant
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">
                    Movement with artistry.
                  </p>
                </div>

                <div className="border-l border-yellow-600/40 pl-5">
                  <h3 className="text-yellow-500 tracking-widest uppercase">
                    Flexible
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">
                    Classes that fit your lifestyle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STUDENT FORM */}

      {page === "student" && (
        <section className="min-h-screen pt-36 px-6 flex items-center justify-center">
          <div className="w-full max-w-xl border border-yellow-600/30 bg-neutral-950/90 p-10 rounded-3xl shadow-2xl">
            <p className="text-yellow-500 tracking-[0.4em] text-xs uppercase mb-4">
              Start Your Journey
            </p>

            <h2 className="text-5xl font-serif mb-8">Student Details</h2>

            <input
              name="fullName"
              placeholder="Full Name"
              value={student.fullName}
              onChange={handleStudentChange}
              className="w-full bg-black border border-yellow-600/30 px-5 py-4 rounded-xl mb-4 outline-none focus:border-yellow-500"
            />

            <input
              name="email"
              placeholder="Email Address"
              value={student.email}
              onChange={handleStudentChange}
              className="w-full bg-black border border-yellow-600/30 px-5 py-4 rounded-xl mb-4 outline-none focus:border-yellow-500"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={student.phone}
              onChange={handleStudentChange}
              className="w-full bg-black border border-yellow-600/30 px-5 py-4 rounded-xl mb-6 outline-none focus:border-yellow-500"
            />

            <button
              onClick={saveStudent}
              className="w-full bg-yellow-500 text-black py-4 rounded-full uppercase tracking-widest font-bold"
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {/* WAIVER */}

      {page === "waiver" && (
        <section className="min-h-screen pt-36 px-6 flex items-center justify-center">
          <div className="w-full max-w-2xl border border-yellow-600/30 bg-neutral-950 p-10 rounded-3xl">
            <p className="text-yellow-500 tracking-[0.4em] text-xs uppercase mb-4">
              Waiver
            </p>

            <h2 className="text-5xl font-serif mb-8">Before You Begin</h2>

            <div className="bg-black border border-yellow-600/20 rounded-2xl p-6 text-gray-300 leading-loose">
              <p>I understand pole fitness involves physical activity.</p>
              <p>I agree to participate at my own risk.</p>
            </div>

            <label className="flex items-center gap-3 mt-6 text-gray-300">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              I agree to the waiver.
            </label>

            <button
              disabled={!agreed}
              onClick={() => setPage("packages")}
              className={`w-full mt-8 py-4 rounded-full uppercase tracking-widest font-bold ${
                agreed
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {/* PACKAGES */}
            {page === "packages" && (
        <section className="min-h-screen pt-36 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-yellow-500 tracking-[0.4em] text-xs uppercase text-center mb-4">
              Choose Your Package
            </p>

            <h2 className="text-5xl md:text-7xl font-serif text-center mb-14">
              Studio Packages
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <button
                  key={pkg.name}
                  onClick={() => handlePackagePurchase(pkg)}
                  className="text-left border border-yellow-600/30 bg-neutral-950 hover:bg-neutral-900 transition rounded-3xl p-8 shadow-2xl"
                >
                  <p className="text-yellow-500 tracking-[0.3em] text-xs uppercase mb-4">
                    {pkg.name}
                  </p>

                  <h3 className="text-4xl font-serif mb-4">{pkg.price}</h3>

                  <p className="text-gray-400 leading-relaxed">{pkg.note}</p>
                </button>
              ))}
            </div>

            {loading && (
              <p className="text-center text-yellow-500 mt-10">
                Creating secure checkout...
              </p>
            )}
          </div>
        </section>
      )}

      {/* SCHEDULE */}

      {page === "schedule" && (
        <section className="min-h-screen pt-36 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-yellow-500 tracking-[0.4em] text-xs uppercase text-center mb-4">
              Select Your Class
            </p>

            <h2 className="text-5xl md:text-7xl font-serif text-center mb-14">
              Class Schedule
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {classes.map((item) => (
                <button
                  key={item.day}
                  onClick={() => bookClass(item)}
                  className="text-left border border-yellow-600/30 bg-neutral-950 hover:bg-neutral-900 transition rounded-3xl p-8"
                >
                  <p className="text-yellow-500 tracking-[0.3em] text-xs uppercase mb-3">
                    {item.day}
                  </p>

                  <h3 className="text-3xl font-serif">{item.name}</h3>

                  <p className="text-gray-400 mt-3">{item.time}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DASHBOARD */}

      {page === "dashboard" && (
        <section className="min-h-screen pt-36 px-6">
          <div className="max-w-5xl mx-auto border border-yellow-600/30 bg-neutral-950 rounded-3xl p-10">
            <p className="text-yellow-500 tracking-[0.4em] text-xs uppercase mb-4">
              Student Portal
            </p>

            <h2 className="text-5xl font-serif mb-8">Dashboard</h2>

            <div className="grid md:grid-cols-2 gap-6 text-gray-300 mb-10">
              <div className="bg-black border border-yellow-600/20 rounded-2xl p-6">
                <p>
                  <b>Name:</b> {currentStudent.fullName || "Student"}
                </p>
                <p>
                  <b>Email:</b> {currentStudent.email}
                </p>
              </div>

              <div className="bg-black border border-yellow-600/20 rounded-2xl p-6">
                <p>
                  <b>Credits:</b> {currentCredits}
                </p>
                <p>
                  <b>Current Package:</b>{" "}
                  {JSON.parse(localStorage.getItem("legacyPackage") || "{}")
                    .name || "None"}
                </p>
              </div>
            </div>

            <h3 className="text-3xl font-serif mb-6">Booked Classes</h3>

            <div className="space-y-4">
              {bookingHistory.length === 0 ? (
                <p className="text-gray-400">No bookings yet.</p>
              ) : (
                bookingHistory.map((item, index) => (
                  <div
                    key={index}
                    className="bg-black border border-yellow-600/20 rounded-2xl p-5"
                  >
                    <p className="text-yellow-500">{item.package?.name}</p>
                    <p className="text-gray-300">{item.class?.name}</p>
                    <p className="text-gray-500 text-sm">{item.bookedDate}</p>
                  </div>
                ))
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-10">
              <button
                onClick={() => setPage("schedule")}
                className="bg-yellow-500 text-black py-4 rounded-full uppercase tracking-widest font-bold"
              >
                Book Another Class
              </button>

              <button
                onClick={() => setPage("packages")}
                className="border border-yellow-600/50 text-yellow-500 py-4 rounded-full uppercase tracking-widest font-bold"
              >
                Buy Package
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}

      {page === "contact" && (
        <section className="min-h-screen pt-36 px-6 flex items-center justify-center">
          <div className="max-w-3xl text-center">
            <p className="text-yellow-500 tracking-[0.4em] text-xs uppercase mb-4">
              Contact
            </p>

            <h2 className="text-5xl md:text-7xl font-serif mb-8">
              Begin Your Legacy
            </h2>

            <p className="text-gray-300 leading-loose text-lg">
              For practice sessions, private classes, and special bookings,
              please contact the studio directly.
            </p>

            <p className="text-yellow-500 mt-8">
              bookings@legacypolestudio.com
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
