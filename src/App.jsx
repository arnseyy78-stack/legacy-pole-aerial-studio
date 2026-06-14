import { useEffect, useState } from "react";
import { supabase } from "./supabase";
export default function App() {
const [page, setPage] = useState("home");
const [slideIndex, setSlideIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setSlideIndex((prev) => (prev + 1) % 3);
  }, 4000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  loadBookings();
  loadStudentBookings();
  loadStudentWaitlist();
  loadAdminWaitlist();
  loadTotalStudents();

  async function handlePaymentSuccess() {
    const params = new URLSearchParams(window.location.search);

    if (params.get("paid") !== "true") return;

    const studentData = JSON.parse(localStorage.getItem("legacyStudent"));
    const selectedPackage = JSON.parse(localStorage.getItem("legacySelectedPackage"));

    if (!studentData || !selectedPackage) return;

    const packageCredits = selectedPackage.credits || 0;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const { data: freshStudent, error: studentError } = await supabase
      .from("students")
      .select("credits")
      .eq("email", studentData.email)
      .single();

    if (studentError) {
      console.log(studentError);
      return;
    }

    const updatedCredits =
      (Number(freshStudent?.credits) || 0) + packageCredits;

    const { error: updateError } = await supabase
      .from("students")
      .update({ credits: updatedCredits })
      .eq("email", studentData.email);

    if (updateError) {
      console.log(updateError);
      alert("Payment received, but credits were not updated. Please contact admin.");
      return;
    }

    setCredits(updatedCredits);

    localStorage.setItem(
      `legacyCredits_${studentData.email}`,
      updatedCredits
    );

    localStorage.setItem(
      `legacyExpiry_${studentData.email}`,
      expiryDate.toISOString()
    );

    localStorage.removeItem("legacySelectedPackage");

    alert(`${selectedPackage.name} confirmed. ${packageCredits} credits added.`);

    window.history.replaceState({}, document.title, window.location.pathname);
    setPage("chooseClass");
  }

  // handlePaymentSuccess();
  const channel = supabase
    .channel("Bookings-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "Bookings"
      },
      () => {
        loadBookings();
        loadStudentBookings();
        loadStudentWaitlist();
        loadAdminWaitlist();
        loadTotalStudents();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
  const [waiverAgreed, setWaiverAgreed] = useState(false);
const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem("legacyStudent")
);
  const [lastActivity, setLastActivity] = useState(Date.now());
  useEffect(() => {

  if (window.location.hash === "#legacy-admin") {
    localStorage.setItem("legacyAdminDevice", "true");
    setShowAdminLogin(true);
  }

  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  window.addEventListener("mousemove", updateActivity);
  window.addEventListener("keydown", updateActivity);
  window.addEventListener("click", updateActivity);
  window.addEventListener("scroll", updateActivity);

  return () => {
    window.removeEventListener("mousemove", updateActivity);
    window.removeEventListener("keydown", updateActivity);
    window.removeEventListener("click", updateActivity);
    window.removeEventListener("scroll", updateActivity);
  };
}, []);
  useEffect(() => {
  const interval = setInterval(() => {
    const inactiveTime = Date.now() - lastActivity;

    if (
  inactiveTime > 1800000 &&
  (localStorage.getItem("legacyStudent") || localStorage.getItem("legacyAdmin"))
) {
      localStorage.removeItem("legacyStudent");
      localStorage.removeItem("legacyAdmin");

setIsLoggedIn(false);
setStudentBookings([]);
setAdminBookings([]);
setCredits(0);

      alert("Session expired due to inactivity.");
      setPage("home");
    }
  }, 10000);

  return () => clearInterval(interval);
}, [lastActivity]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
  const [bookedSlots, setBookedSlots] = useState({});
  const [studentBookings, setStudentBookings] = useState([]);
  const [adminBookings, setAdminBookings] = useState([]);
  const [studentWaitlist, setStudentWaitlist] = useState([]);
const [adminWaitlist, setAdminWaitlist] = useState([]);

const [totalStudents, setTotalStudents] = useState(0);

const [credits, setCredits] = useState(0);

  const today = new Date();
  const [adminView, setAdminView] = useState("upcoming");
const [studentView, setStudentView] = useState("upcoming");
  const [showAdminLogin, setShowAdminLogin] = useState(
  localStorage.getItem("legacyAdminDevice") === "true"
);
const displayedDate = new Date(
  today.getFullYear(),
  today.getMonth() + calendarMonthOffset,
  1
);

const currentMonthName = displayedDate.toLocaleString("default", {
  month: "long"
});

const currentYear = displayedDate.getFullYear();

const daysInCurrentMonth = new Date(
  currentYear,
  displayedDate.getMonth() + 1,
  0
).getDate();

const firstDayOfMonth = new Date(
  currentYear,
  displayedDate.getMonth(),
  1
).getDay();

const adjustedFirstDay =
  firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const [student, setStudent] = useState({
    fullName: "",
    email: "",
    phone: "",
    emergencyPerson: "",
    emergencyPhone: "",
    password: ""
  });

function handleStudentChange(e) {
  setStudent({
    ...student,
    [e.target.name]: e.target.value
  });
}

async function loadBookings() {
  const { data, error } = await supabase
    .from("Bookings")
    .select("*");

  if (error) {
    console.log(error);
    return;
  }

  const slotMap = {};

  data.forEach((booking) => {
    const key = `${booking.Booking_date}-${booking.Class_name}`;

    slotMap[key] = (slotMap[key] || 0) + 1;
  });

  setBookedSlots(slotMap);
}
  async function loadTotalStudents() {
  const { count, error } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.log(error);
    return;
  }

  setTotalStudents(count || 0);
}
async function loadAdminBookings() {
  const { data, error } = await supabase
    .from("Bookings")
    .select("*");

  if (error) {
    console.log(error);
    return;
  }

  const monthOrder = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
  };

  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentDay = today.getDate();

  const futureBookings = (data || []).filter((booking) => {
    const [month, day] = booking.Booking_date.split("-");
    const bookingMonthNumber = monthOrder[month];
    const currentMonthNumber = monthOrder[currentMonth];

    return (
      bookingMonthNumber > currentMonthNumber ||
      (bookingMonthNumber === currentMonthNumber && Number(day) >= currentDay)
    );
  });

  futureBookings.sort((a, b) => {
    const [monthA, dayA] = a.Booking_date.split("-");
    const [monthB, dayB] = b.Booking_date.split("-");

    if (monthOrder[monthA] !== monthOrder[monthB]) {
      return monthOrder[monthA] - monthOrder[monthB];
    }

    return Number(dayA) - Number(dayB);
  });

  setAdminBookings(futureBookings);
}

async function loadStudentBookings(emailOverride = null) {
  const studentData = JSON.parse(localStorage.getItem("legacyStudent"));
  const email = emailOverride || studentData?.email;

  if (!email) {
    setStudentBookings([]);
    return;
  }

  const { data, error } = await supabase
    .from("Bookings")
    .select("*")
    .eq("Student_email", email);

  if (error) {
    console.log(error);
    setStudentBookings([]);
    return;
  }

  const monthOrder = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
  };

  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentDay = today.getDate();

  const upcomingBookings = (data || []).filter((booking) => {
    const [month, day] = booking.Booking_date.split("-");
    const bookingMonthNumber = monthOrder[month];
    const currentMonthNumber = monthOrder[currentMonth];

    return (
      bookingMonthNumber > currentMonthNumber ||
      (bookingMonthNumber === currentMonthNumber && Number(day) >= currentDay)
    );
  });

  upcomingBookings.sort((a, b) => {
    const [monthA, dayA] = a.Booking_date.split("-");
    const [monthB, dayB] = b.Booking_date.split("-");

    if (monthOrder[monthA] !== monthOrder[monthB]) {
      return monthOrder[monthA] - monthOrder[monthB];
    }

    return Number(dayA) - Number(dayB);
  });

setStudentBookings(upcomingBookings);
}

async function loadStudentWaitlist(emailOverride = null) {
  const studentData = JSON.parse(localStorage.getItem("legacyStudent"));
  const email = emailOverride || studentData?.email;

  if (!email) {
    setStudentWaitlist([]);
    return;
  }

  const { data, error } = await supabase
    .from("Waitlist")
    .select("*")
    .eq("Student_email", email);

  if (error) {
    console.log(error);
    setStudentWaitlist([]);
    return;
  }

  setStudentWaitlist(data || []);
}
async function loadAdminWaitlist() {
  const { data, error } = await supabase
    .from("Waitlist")
    .select("*");

  if (error) {
    console.log(error);
    return;
  }

  setAdminWaitlist(data || []);
}
function saveStudentInfo() {
  setPage("waiver");
}

async function savePassword() {
  if (!student.password) {
    alert("Please create a password.");
    return;
  }

const { error } = await supabase
  .from("students")
  .insert([
    {
      full_name: student.fullName,
      email: student.email,
      phone: student.phone,
      emergency_person: student.emergencyPerson,
      emergency_phone: student.emergencyPhone,
      password: student.password
    }
  ]);

if (error) {
  console.log(error);
  alert("Account could not be created.");
  return;
}

localStorage.setItem("legacyStudent", JSON.stringify(student));
  setIsLoggedIn(true);
setPage("packages");
}

async function loginStudent() {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("email", loginEmail)
    .single();

  if (error || !data) {
    alert("No account found. Please sign up first.");
    return;
  }

  if (loginPassword !== data.password) {
    alert("Incorrect password.");
    return;
  }
localStorage.removeItem("legacyStudent");
setStudentBookings([]);
setCredits(0);
  localStorage.setItem(
    "legacyStudent",
    JSON.stringify({
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      emergencyPerson: data.emergency_person,
      emergencyPhone: data.emergency_phone
    })
  );
setIsLoggedIn(true);
setStudentBookings([]);
const savedCredits = Number(data.credits) || 0;

const savedExpiry = localStorage.getItem(`legacyExpiry_${data.email}`);

if (savedExpiry && new Date(savedExpiry) < new Date()) {
  localStorage.setItem(`legacyCredits_${data.email}`, 0);
  localStorage.removeItem(`legacyExpiry_${data.email}`);
  setCredits(0);
  localStorage.setItem(
    "legacyExpiryWarning",
    "Your package has expired. Please purchase a new package."
  );
} else {
  setCredits(savedCredits);
}

await loadStudentBookings(data.email);
await loadStudentWaitlist(data.email);
alert("Login successful!");
  const expiryWarning = localStorage.getItem("legacyExpiryWarning");

if (expiryWarning) {
  setTimeout(() => {
    alert(expiryWarning);
    localStorage.removeItem("legacyExpiryWarning");
  }, 1500);
}
setPage("chooseClass");
}
  function checkPackageExpiry(email) {
  const savedExpiry = localStorage.getItem(`legacyExpiry_${email}`);

  if (savedExpiry && new Date(savedExpiry) < new Date()) {
    localStorage.setItem(`legacyCredits_${email}`, 0);
    localStorage.removeItem(`legacyExpiry_${email}`);
    setCredits(0);
    alert("Your package has expired. Please purchase a new package.");
    setPage("packages");
    return true;
  }

  return false;
}
  async function buyPackage(pkg) {
  try {
  if (pkg.isTest) {
  const studentData =
    JSON.parse(localStorage.getItem("legacyStudent")) || student;

  await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      studentName: studentData.fullName,
      studentEmail: studentData.email,
      packageName: pkg.name,
      className: "Test package selected",
      amount: "FREE",
      credits: pkg.credits,
      expiry: "30 Days"
    })
  });

const packageCredits = pkg.credits || 0;

const expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + 30);

setCredits(packageCredits);

localStorage.setItem(
  `legacyCredits_${studentData.email}`,
  packageCredits
);

localStorage.setItem(
  `legacyExpiry_${studentData.email}`,
  expiryDate.toISOString()
);

alert(`${pkg.name} confirmed. ${packageCredits} credits added.`);
setPage("chooseClass");
return;
}
    const studentData =
      JSON.parse(localStorage.getItem("legacyStudent")) || student;

    localStorage.setItem("legacySelectedPackage", JSON.stringify(pkg));

    const response = await fetch("/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        packageName: pkg.name,
        amount: pkg.amount,
        studentName: studentData.fullName,
        studentEmail: studentData.email
      })
    });

    const data = await response.json();

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      alert("Checkout failed. Please try again.");
    }
  } catch (error) {
    console.log(error);
    alert("Payment error. Please try again.");
  }
}
  return (    <div style={app}>
      {/* NAVBAR */}
      <div style={navbar}>
        <div>
<img
  src="/1.4.png"
  alt="Legacy Pole & Aerial Studio"
  style={{
    height: "80px",
    width: "auto",
    objectFit: "contain"
  }}
/>
</div>

        <div style={navLinks}>
          <button onClick={() => setPage("home")} style={navButton}>
            HOME
          </button>
          <button onClick={() => setPage("gallery")} style={navButton}>
  GALLERY
</button>
<button onClick={() => setPage("contact")} style={navButton}>
  CONTACT US
</button>
          {isLoggedIn && (
  <button onClick={() => setPage("packages")} style={navButton}>
    PACKAGES
  </button>
)}

          <button onClick={() => setPage("authChoice")} style={goldButton}>
            BOOK NOW
          </button>
        </div>
      </div>
{["home", "authChoice", "student", "login", "createPassword", "adminLogin"].includes(page) && (
  <div
    style={{
      width: "100%",
      maxWidth: "1400px",
      margin: "30px auto",
      padding: "20px",
      boxSizing: "border-box"
    }}
  >
    <img
      src={["/mermaid.jpg", "/xtian-chair.jpg", "/ace-floor.jpg"][slideIndex]}
      style={{
        width: "100%",
        height: "650px",
        objectFit: "cover",
        borderRadius: "20px",
        transition: "all 0.5s ease"
      }}
    />
  </div>
)}
      {/* HOME */}
{page === "home" && (
  <div>


    <section style={{ ...hero, gridTemplateColumns: "1fr", textAlign: "center" }}>
      <div style={{ ...heroLeft, alignItems: "center" }}>
        <p style={goldSmallText}>WELCOME TO LEGACY</p>

        <h1 style={heroTitle}>
          Strength.
          <br />
          Elegance.
          <br />
          Legacy.
        </h1>

        <div style={goldLine} />

        <p style={paragraph}>
          A luxury pole and aerial studio designed for confidence,
          movement, empowerment, and artistry.
        </p>

        <button
          onClick={() => setPage("authChoice")}
          style={goldButtonLarge}
        >
          BOOK YOUR CLASS
        </button>
      </div>
    </section>
  </div>
)}
            {/* LOGIN / SIGN UP CHOICE */}
    
      {page === "authChoice" && (
        <section style={centerPage}>
          <div style={formCard}>
            <p style={goldSmallText}>BEGIN YOUR JOURNEY</p>

            <h2 style={sectionHeading}>Login / Sign Up</h2>

            <button
              onClick={() => setPage("student")}
              style={{
                ...goldButtonLarge,
                width: "100%"
              }}
            >
              SIGN UP
            </button>

            <button
              onClick={() => setPage("login")}
              style={{
                ...outlineButton,
                width: "100%",
                marginTop: "20px"
              }}
            >
              LOGIN
            </button>
            {showAdminLogin && (
  <button
    onClick={() => setPage("adminLogin")}
    style={{
      ...outlineButton,
      width: "100%",
      marginTop: "20px",
      border: "1px solid rgba(255,255,255,0.2)",
      color: "#fff"
    }}
  >
    ADMIN LOGIN
  </button>
)}
          </div>
        </section>
      )}

      {/* STUDENT INFO */}
      {page === "student" && (
        <section style={centerPage}>
          <div style={formCard}>
            <p style={goldSmallText}>STUDENT INFORMATION</p>

            <h2 style={sectionHeading}>Create Account</h2>

            <input
              name="fullName"
              placeholder="Full Name"
              value={student.fullName}
              onChange={handleStudentChange}
              style={inputStyle}
            />

            <input
              name="email"
              placeholder="Email Address"
              value={student.email}
              onChange={handleStudentChange}
              style={inputStyle}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={student.phone}
              onChange={handleStudentChange}
              style={inputStyle}
            />

            <input
              name="emergencyPerson"
              placeholder="Emergency Person"
              value={student.emergencyPerson}
              onChange={handleStudentChange}
              style={inputStyle}
            />

            <input
              name="emergencyPhone"
              placeholder="Emergency Contact Number"
              value={student.emergencyPhone}
              onChange={handleStudentChange}
              style={inputStyle}
            />

            <button
              onClick={saveStudentInfo}
              style={{
                ...goldButtonLarge,
                width: "100%",
                marginTop: "10px"
              }}
            >
              CONTINUE
            </button>
          </div>
        </section>
      )}
            {/* WAIVER */}
      {page === "waiver" && (
        <section style={centerPage}>
          <div
            style={{
              ...formCard,
              maxWidth: "900px"
            }}
          >
            <p style={goldSmallText}>STUDIO WAIVER</p>

            <h2 style={sectionHeading}>Liability Waiver</h2>

            <div style={waiverBox}>
              <p>
                I understand that participation in pole fitness, aerial arts,
                dance, flexibility training, strength conditioning, and related
                physical activities involves inherent risks including but not
                limited to falls, bruising, muscle injury, paralysis,
                disability, or death.
              </p>

              <p>
                I voluntarily assume all risks associated with participation in
                activities conducted by Legacy Pole & Aerial Studio.
              </p>

              <p>
                I certify that I am physically fit and capable of participating
                and that I have consulted a medical professional where
                necessary.
              </p>

              <p>
                I agree to disclose any injuries, pregnancy, medical condition,
                or physical limitation prior to participating.
              </p>

              <p>
                I release and discharge Legacy Pole & Aerial Studio, its owners,
                instructors, employees, contractors, and affiliates from all
                liability, claims, damages, or actions arising from
                participation in studio activities.
              </p>

              <p>
                I understand that all purchases are non-refundable unless
                otherwise required by law.
              </p>

              <p>
                I acknowledge that unsafe conduct, intoxication, harassment, or
                disruptive behavior may result in immediate removal from the
                premises without refund.
              </p>

              <p>
                I grant permission for photographs or videos taken during
                classes to be used for promotional purposes unless I notify the
                studio in writing.
              </p>

              <p>
                By proceeding, I confirm that I have read, understood, and
                voluntarily agree to this waiver and release of liability.
              </p>
            </div>

            <label style={checkboxLabel}>
              <input
                type="checkbox"
                checked={waiverAgreed}
                onChange={(e) => setWaiverAgreed(e.target.checked)}
              />

              I agree to the Liability Waiver
            </label>

            <button
              disabled={!waiverAgreed}
              onClick={() => setPage("createPassword")}
              style={{
                ...goldButtonLarge,
                width: "100%",
                marginTop: "25px",
                opacity: waiverAgreed ? 1 : 0.5,
                cursor: waiverAgreed ? "pointer" : "not-allowed"
              }}
            >
              CONTINUE
            </button>
          </div>
        </section>
      )}

      {/* CREATE PASSWORD */}
      {page === "createPassword" && (
        <section style={centerPage}>
          <div style={formCard}>
            <p style={goldSmallText}>ACCOUNT SECURITY</p>

            <h2 style={sectionHeading}>Create Username + Password</h2>

            <input
              value={student.email}
              readOnly
              style={inputStyle}
            />

            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={student.password}
              onChange={handleStudentChange}
              style={inputStyle}
            />

            <button
              onClick={savePassword}
              style={{
                ...goldButtonLarge,
                width: "100%",
                marginTop: "10px"
              }}
            >
              CONTINUE
            </button>
          </div>
        </section>
      )}
            {/* LOGIN */}
      {page === "login" && (
        <section style={centerPage}>
          <div style={formCard}>
            <p style={goldSmallText}>WELCOME BACK</p>

            <h2 style={sectionHeading}>Login</h2>

<input
  placeholder="Email Address"
  value={loginEmail}
  onChange={(e) => setLoginEmail(e.target.value)}
  style={inputStyle}
/>

<input
  type="password"
  placeholder="Password"
  value={loginPassword}
  onChange={(e) => setLoginPassword(e.target.value)}
  style={inputStyle}
/>

<button
  onClick={loginStudent}
              style={{
                ...goldButtonLarge,
                width: "100%",
                marginTop: "10px"
              }}
            >
              LOGIN
            </button>
          </div>
        </section>
      )}
    {/* ADMIN LOGIN */}
{page === "adminLogin" && (
  <section style={centerPage}>
    <div style={formCard}>
      <p style={goldSmallText}>ADMIN ACCESS</p>

      <h2 style={sectionHeading}>Admin Login</h2>

      <input
        placeholder="Admin Password"
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        style={inputStyle}
      />

      <button
        onClick={async () => {
const response = await fetch("/api/admin-login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    password: loginPassword
  })
});

const result = await response.json();

if (result.success) {
  localStorage.setItem("legacyAdmin", "true");
loadAdminBookings();
loadAdminWaitlist();
setPage("adminDashboard");
} else {
  alert("Incorrect admin password.");
}
        }}
        style={{
          ...goldButtonLarge,
          width: "100%",
          marginTop: "10px"
        }}
      >
        LOGIN
      </button>
    </div>
  </section>
)}
{/* CHOOSE CLASS */}
{page === "chooseClass" && isLoggedIn && (
  <section style={centerPage}>
    <div style={{ ...formCard, maxWidth: "950px" }}>
      <h2 style={sectionHeading}>Schedule</h2>
<div style={dashboardBox}>
  <p style={goldSmallText}>STUDENT DASHBOARD</p>

  <h3 style={{ color: "#fff", fontSize: "30px", margin: "10px 0" }}>
    Credits Remaining: {credits}
  </h3>

  <p style={{ color: "#999" }}>Use 1 credit per class booking</p>

  <select
    value={studentView}
    onChange={(e) => setStudentView(e.target.value)}
    style={{ ...inputStyle, marginBottom: "20px" }}
  >
    <option value="upcoming">Upcoming Classes</option>
    <option value="waitlist">Waitlist</option>
  </select>

  {studentView === "upcoming" && (
    <div style={{ marginTop: "20px" }}>
      <p style={goldSmallText}>UPCOMING CLASSES</p>

      {studentBookings.length === 0 ? (
        <p style={{ color: "#999" }}>No classes booked yet.</p>
      ) : (
        studentBookings.map((booking) => (
          <div key={booking.id} style={{
            borderTop: "1px solid rgba(200,169,107,0.2)",
            paddingTop: "12px",
            marginTop: "12px"
          }}>
            <p style={{ color: "#fff", margin: 0 }}>{booking.Class_name}</p>
            <p style={{ color: "#999", margin: "6px 0 0" }}>
              {booking.Booking_date} · 6:00 PM
            </p>
            {new Date(booking.Booking_date) < new Date() && (
  <a
    href="https://g.page/r/CW_TupV6xyxtEAI/review"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "#c8a96b",
      textDecoration: "none",
      fontWeight: "bold",
      display: "inline-block",
      marginTop: "8px"
    }}
  >
    ⭐ Leave a Review
  </a>
)}
          </div>
        ))
      )}
    </div>
  )}

  {studentView === "waitlist" && (
    <div style={{ marginTop: "20px" }}>
      <p style={goldSmallText}>WAITLIST</p>

      {studentWaitlist.length === 0 ? (
        <p style={{ color: "#999" }}>No waitlist classes.</p>
      ) : (
        studentWaitlist.map((item) => (
          <div key={item.id} style={{
            borderTop: "1px solid rgba(200,169,107,0.2)",
            paddingTop: "12px",
            marginTop: "12px"
          }}>
            <p style={{ color: "#fff", margin: 0 }}>{item.Class_name}</p>
            <p style={{ color: "#999", margin: "6px 0 0" }}>
              {item.Booking_date} · Waitlisted
            </p>
          </div>
        ))
      )}
    </div>
  )}
</div>
      <div style={calendarBox}>
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
          {calendarMonthOffset > 0 && (
  <button
    onClick={async () => {
      setSelectedDate(null);
      setCalendarMonthOffset(calendarMonthOffset - 1);
    }}
    style={{
  ...outlineButton,
  background: "#050505",
  color: "#c8a96b",
  border: "1px solid rgba(200,169,107,0.35)"
}}
  >
    BACK
  </button>
)}
  <h3 style={{ color: "#c8a96b", textAlign: "center" }}>
    {currentMonthName} {currentYear}
  </h3>

  <button
    onClick={async () => {
      setSelectedDate(null);
      setCalendarMonthOffset(calendarMonthOffset + 1);
    }}
    style={{
  ...outlineButton,
  background: "#050505",
  color: "#c8a96b",
  border: "1px solid rgba(200,169,107,0.35)"
}}
  >
    NEXT
  </button>
</div>

        <div style={calendarGrid}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
            <strong
  key={d}
  style={{ color: "#777" }}
>
  {d}
</strong>
          ))}

          {[
  ...Array(adjustedFirstDay).fill(null),
  ...Array(daysInCurrentMonth)
].map((_, i) => {

if (i < adjustedFirstDay) {
  return <div key={`empty-${i}`}></div>;
}

const day = i - adjustedFirstDay + 1;


const todayDate = new Date().getDate();

const actualDate = new Date(
  currentYear,
  displayedDate.getMonth(),
  day
);

const isSunday = actualDate.getDay() === 0;

const isCurrentDisplayedMonth =
  calendarMonthOffset === 0;

const disabledDays =
  (isCurrentDisplayedMonth && day < todayDate) || isSunday;

return (
  <button
    disabled={disabledDays}
                key={day}
                onClick={() => setSelectedDate(day)}
               style={{
  ...dateButton,
  background: disabledDays
    ? "rgba(0,0,0,0.08)"
    : selectedDate === day
    ? "#c8a96b"
    : "rgba(255,255,255,0.45)",

  color: disabledDays ? "#999" : "#050505",
  cursor: disabledDays ? "not-allowed" : "pointer",
  opacity: disabledDays ? 0.45 : 1
}}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <>
          <h3 style={{ color: "#fff", marginTop: "35px" }}>
            Available classes for {currentMonthName} {selectedDate}
          </h3>

          <div style={packageGrid}>
            {(() => {
  const actualSelectedDate = new Date(
  currentYear,
  displayedDate.getMonth(),
  selectedDate
);

const weekday = actualSelectedDate.getDay();

const classes = {
  1: [["6:00 PM 1hr", "Pole Fitness", "/crossknee.jpg"]],
  2: [["6:00 PM 1hr", "Pole Flow", "/xtian-pole.jpg"]],
  3: [["6:00 PM 1hr", "Spinny Pole", "/climb.jpg"]],
  4: [["6:00 PM 1hr", "Intro to Pole", "/ace-pole.jpg"]],
  5: [["6:00 PM 1hr", "Exo", "/floor.jpg"]],
  6: [["6:00 PM 1hr", "Floor Work", "/ace-floor.jpg"]],
  0: []
};

  if (calendarMonthOffset > 1) {
  return [];
}

return classes[weekday] || [];
})().map((item) => (
              <button
                key={item[0]}
                style={packageCard}
                onClick={async () => {
const bookingDate = `${currentMonthName}-${selectedDate}`;

const bookingKey =
  `${bookingDate}-${item[1]}`;

  const currentBooked =
    bookedSlots[bookingKey] || 0;

  if (currentBooked >= 5) {
  const studentData =
    JSON.parse(localStorage.getItem("legacyStudent")) || student;

  const { data: existingWaitlist } = await supabase
    .from("Waitlist")
    .select("*")
    .eq("Student_email", studentData.email)
    .eq("Class_name", item[1])
    .eq("Booking_date", bookingDate)
    .maybeSingle();

if (existingWaitlist) {
  const newWaitlistItem = {
  id: Date.now(),
  Student_name: studentData.fullName,
  Student_email: studentData.email,
  Class_name: item[1],
  Booking_date: bookingDate
};

setStudentWaitlist((prev) => [...prev, newWaitlistItem]);

await loadStudentWaitlist(studentData.email);

alert("This class is full. You have been added to the waitlist.");
return;
}

  const { error } = await supabase
    .from("Waitlist")
    .insert([
      {
        Student_name: studentData.fullName,
        Student_email: studentData.email,
        Class_name: item[1],
        Booking_date: bookingDate
      }
    ]);

  if (error) {
    console.log(error);
    alert("Could not join waitlist. Please try again.");
    return;
  }

await loadStudentWaitlist(studentData.email);

    await fetch("/api/send-email", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    type: "waitlist",
    studentName: studentData.fullName,
    studentEmail: studentData.email,
    className: item[1],
    expiry: bookingDate
  })
});
alert("This class is full. You have been added to the waitlist.");
return;
}
                  const studentData =
  JSON.parse(localStorage.getItem("legacyStudent")) || student;

if (checkPackageExpiry(studentData.email)) {
  return;
}

if (credits <= 0) {
  alert("You do not have enough credits. Please choose a package first.");
  setPage("packages");
  return;
}


const { data: existingBooking } = await supabase
  .from("Bookings")
  .select("*")
  .eq("Student_email", studentData.email)
  .eq("Class_name", item[1])
  .eq("Booking_date", bookingDate)
  .maybeSingle();

if (existingBooking) {
  alert("You have already booked this class.");
  return;
}


const { error } = await supabase
  .from("Bookings")
  .insert([
    {
      Student_name: studentData.fullName,
      Student_email: studentData.email,
      Class_name: item[1],
      Booking_date: bookingDate,
      Slots: 1
    }
  ]);

if (error) {
  console.log(error);
  alert("Booking failed. Please try again.");
  return;
}

await fetch("/api/send-email", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    studentName: studentData.fullName,
    studentEmail: studentData.email,
    packageName: "Class Booking",
    className: item[1],
    amount: "Booked",
    credits: "1 credit used",
    expiry: `${bookingDate}, 2026 at ${item[0]}`
  })
});

const newCredits = credits - 1;

setCredits(newCredits);
                  const { error: creditUpdateError } = await supabase
  .from("students")
  .update({ credits: newCredits })
  .eq("email", studentData.email);

if (creditUpdateError) {
  console.log("Credit update error:", creditUpdateError);
}
localStorage.setItem(`legacyCredits_${studentData.email}`, newCredits);

loadBookings();
loadStudentBookings();
loadStudentWaitlist();
loadAdminWaitlist();

setPage("bookingConfirmed");

}}
              >
<img
  src={item[2]}
  style={{
    width: "100%",
    height: "400px",
    objectFit: "contain",
    borderRadius: "18px",
    marginBottom: "18px",
    backgroundColor: "#111"
  }}
/>
                <p style={goldSmallText}>{item[0]}</p>
                <h3 style={packagePrice}>{item[1]}</h3>
                <p style={{ color: "#999", lineHeight: "1.6" }}>
  {{
    "Pole Fitness": "Build strength, confidence and body control. Wear short shorts.",
    "Pole Flow": "Learn graceful transitions, movement and expression. Wear leggings, knee pads and socks.",
    "Spinny Pole": "Master spinning pole techniques and combinations. Wear short shorts.",
    "Intro to Pole": "Perfect starting point for complete beginners. Wear short shorts.",
    "Exo": "Sensual movement, confidence, and floor transitions. Wear knee pads and pleaser heels.",
    "Floor Work": "Flexibility, flow and choreography on the floor. Wear leggings, knee pads, socks and heels (optional)."
  }[item[1]]}
</p>
                <p style={{ color: "#c8a96b", fontSize: "13px", letterSpacing: "2px" }}>
  Instructor: London
</p>
                <p
  style={{
    color: "#c8a96b",
    marginTop: "12px"
  }}
>
Slots remaining: {
  5 -
  (
bookedSlots[
  `${currentMonthName}-${selectedDate}-${item[1]}`
] || 0
  )
}/5
</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  </section>
)}
{/* ADMIN DASHBOARD */}
{page === "adminDashboard" &&
  localStorage.getItem("legacyAdmin") === "true" && (
    <section style={centerPage}>
      <div style={{ ...formCard, maxWidth: "1100px" }}>
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  }}
>
  <div>
    <p style={goldSmallText}>ADMIN DASHBOARD</p>
    <h2 style={sectionHeading}>Upcoming Class Bookings</h2>
    <div
  style={{
    border: "1px solid rgba(200,169,107,0.25)",
    borderRadius: "12px",
    padding: "12px 20px",
    marginTop: "15px",
    display: "inline-block"
  }}
>
  <div style={{ color: "#c8a96b", fontSize: "12px" }}>
    TOTAL STUDENTS
  </div>
  <div style={{ color: "#fff", fontSize: "28px", fontWeight: "bold" }}>
    {totalStudents}
  </div>
</div>
  </div>

  <button
    onClick={() => {
      loadAdminBookings();
      loadAdminWaitlist();
    }}
    style={{
      ...outlineButton,
      padding: "8px 16px",
      fontSize: "12px"
    }}
  >
    ↻ Refresh Data
  </button>
</div>
<select
  value={adminView}
  onChange={(e) => setAdminView(e.target.value)}
  style={{
    ...inputStyle,
    marginBottom: "20px"
  }}
>
  <option value="today">Today's Classes</option>
  <option value="upcoming">Upcoming Classes</option>
  <option value="waitlist">Waitlist</option>
</select>
        
{adminView === "today" && (
  <>
    {adminBookings
      .filter((booking) => {
        const today = new Date();
        const month = today.toLocaleString("default", {
          month: "long"
        });
        const day = today.getDate();

        return booking.Booking_date === `${month}-${day}`;
      })
      .map((booking) => (
        <div
          key={booking.id}
          style={{
            borderTop: "1px solid rgba(200,169,107,0.25)",
            paddingTop: "15px",
            marginTop: "15px"
          }}
        >
          <p style={{ color: "#fff", margin: 0 }}>
            {booking.Student_name}
          </p>

          <p style={{ color: "#777", margin: "5px 0" }}>
            {booking.Student_email}
          </p>

          <p style={{ color: "#c8a96b", margin: 0 }}>
            {booking.Class_name}
          </p>
        </div>
      ))}
  </>
)}
        {adminView === "upcoming" && (
  <>
    {adminBookings.length === 0 ? (
      <p style={{ color: "#999" }}>No bookings yet.</p>
    ) : (
      Object.entries(
        adminBookings.reduce((groups, booking) => {
          const key = `${booking.Booking_date}-${booking.Class_name}`;
          if (!groups[key]) groups[key] = [];
          groups[key].push(booking);
          return groups;
        }, {})
      ).map(([groupKey, bookings]) => (
        <div
          key={groupKey}
          style={{
            borderTop: "1px solid rgba(200,169,107,0.25)",
            paddingTop: "22px",
            marginTop: "22px"
          }}
        >
          <p style={goldSmallText}>{bookings[0].Booking_date}</p>

          <h3 style={{ color: "#fff", margin: "10px 0" }}>
            {bookings[0].Class_name} · 6:00 PM 
          </h3>

          <p style={{ color: "#c8a96b" }}>
            Slots Filled: {bookings.length}/5
          </p>

          {bookings.map((student) => (
            <div
              key={student.id}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              <p style={{ color: "#fff", margin: 0 }}>
                {student.Student_name}
              </p>

              <p style={{ color: "#777", margin: "5px 0 0" }}>
                {student.Student_email}
              </p>
            </div>
          ))}
        </div>
      ))
    )}
  </>
)}
        {adminView === "waitlist" && (
  <>
    <div style={{ marginTop: "50px" }}>
          <p style={goldSmallText}>WAITLIST</p>

          {adminWaitlist.length === 0 ? (
            <p style={{ color: "#999" }}>No waitlist entries.</p>
          ) : (
            adminWaitlist.map((item) => (
              <div key={item.id} style={{
                borderTop: "1px solid rgba(200,169,107,0.25)",
                paddingTop: "15px",
                marginTop: "15px"
              }}>
                <p style={{ color: "#fff", margin: 0 }}>{item.Student_name}</p>
                <p style={{ color: "#777", margin: "5px 0" }}>{item.Student_email}</p>
                <p style={{ color: "#c8a96b", margin: 0 }}>
                  {item.Class_name} · {item.Booking_date}
                </p>
              </div>
                        ))
                      )}
          </div>
        </>
      )}
    </div>
  </section>
)}
    {/* GALLERY */}
{page === "gallery" && (
  <section style={centerPage}>
    <div style={{ ...formCard, maxWidth: "1200px" }}>
      <p style={goldSmallText}>LEGACY GALLERY</p>

      <h2 style={sectionHeading}>Studio Gallery</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px"
        }}
      >
        {[
          "/1.jpeg",
          "/2.jpeg",
          "/3.jpeg",
          "/4.jpeg",
          "/5.jpeg",
          "/6.jpeg",
          "/7.jpeg",
          "/8.jpeg",
        "/9.jpeg",
        "/10.jpeg",
        "/11.jpeg",
        "/12.jpeg",
        "/13.jpeg",
        "/14.jpeg",
          "/15.jpeg"
        ].map((img) => (
          <img
            key={img}
            src={img}
            style={{
              width: "100%",
              height: "350px",
              objectFit: "cover",
              borderRadius: "20px",
              border: "1px solid rgba(200,169,107,0.25)"
            }}
          />
        ))}
      </div>
    </div>
  </section>
)}
    {/* BOOKING CONFIRMATION */}
{page === "bookingConfirmed" && (
  <section style={centerPage}>
    <div style={{ ...formCard, maxWidth: "900px" }}>
      <p style={goldSmallText}>BOOKING CONFIRMED ✓</p>

      <h2 style={sectionHeading}>Class Reminder</h2>

      <div style={waiverBox}>
        <h3 style={{ color: "#c8a96b" }}>✅ Before Class</h3>

        <p>✔ Arrive 10-15 minutes early. If you missed warm up you can no longer attend the class. This is for your safety. To avoid injuries.</p>
        <p>✔ Wear short shorts. Do not apply body lotion before class.</p>
        <p>✔ Bring water and towel.</p>
        <p>✔ Also bring hold holder, so you can film your progress.</p>
        <p>✔ Advise your instructor of any injuries or pregnancy.</p>

        <br />

        <h3 style={{ color: "#c8a96b" }}>🔄 Rebooking Policy</h3>

        <p>✔ Cancel at least 48 hours before class</p>
        <p>✔ Late cancellations may forfeit credits</p>
        <p>✔ No-shows will forfeit class credits</p>
        <p>✔ Credits are non-transferable</p>
        <p>✔ Package credits expire after 30 days</p>
      </div>

      <button
        onClick={() => setPage("chooseClass")}
        style={{
          ...goldButtonLarge,
          width: "100%",
          marginTop: "25px"
        }}
      >
        CONTINUE TO DASHBOARD
      </button>
    </div>
  </section>
)}
    {/* CONTACT */}
{page === "contact" && (
  <section style={centerPage}>
    <div style={{ ...formCard, maxWidth: "900px" }}>
      <p style={goldSmallText}>VISIT LEGACY</p>

      <h2 style={sectionHeading}>Contact Us</h2>

      <div style={{ marginBottom: "30px" }}>
        <p style={goldSmallText}>ADDRESS</p>
        <p style={paragraph}>
          Legacy Pole & Aerial Dance Studio 
          Unit 1, 2nd Flr, RCPJC Compound A, Antero Soriano Hwy,
          General Trias, 4107 Cavite
        </p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <p style={goldSmallText}>PHONE</p>
        <p style={paragraph}>
          +63 905 336 6544 / +63 906 378 2296
        </p>
      </div>

      <a
        href="https://share.google/AFqMpoBqHNcfTIXGf"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...goldButtonLarge,
          display: "inline-block",
          textDecoration: "none",
          marginBottom: "30px"
        }}
      >
        OPEN GOOGLE MAP
      </a>

      <iframe
        title="Legacy Pole & Aerial Studio Google Map"
        src="https://www.google.com/maps?q=Unit%201%2C%202nd%20Flr%2C%20RCPJC%20Compound%20A%2C%20Antero%20Soriano%20Hwy%2C%20General%20Trias%2C%204107%20Cavite&output=embed"
        width="100%"
        height="380"
        style={{
          border: "1px solid rgba(200,169,107,0.25)",
          borderRadius: "24px",
          marginTop: "10px"
        }}
        loading="lazy"
      ></iframe>
    </div>
  </section>
)}
      {/* PACKAGES */}
      {page === "packages" && isLoggedIn && (
        <section style={centerPage}>
          <div
            style={{
              ...formCard,
              maxWidth: "950px"
            }}
          >
            
            <h2 style={sectionHeading}>Pricing</h2>
<button
  onClick={() => setPage("chooseClass")}
  style={{
    ...outlineButton,
    marginBottom: "25px"
  }}
>
  DASHBOARD
</button>
            <div style={packageGrid}>
              {[
{
  name: "Single Pass",
  price: "₱870",
  description: "One class access",
  amount: 87000,
  credits: 1,
  expiry: "30 Days"
},

{
  name: "Class Card",
  price: "₱4,100",
  description: "Five class credits",
  amount: 410000,
  credits: 5,
  expiry: "30 Days",
  
},

  {
    name: "Practice Session",
    price: "₱550",
    description: "Contact studio for time",
    amount: 55000,
    expiry: "30 Days"
  },

  {
    name: "Private Class",
    price: "₱3,100",
    description: "Personal coaching",
    amount: 310000,
    expiry: "30 Days"
  }
].map((pkg) => (
                <button
  key={pkg.name}
  style={packageCard}
  onClick={() => buyPackage(pkg)}
>
  <p style={goldSmallText}>{pkg.name}</p>

  <h3 style={packagePrice}>{pkg.price}</h3>

  <p style={{ color: "#999", lineHeight: "1.6" }}>
    {pkg.description}
  </p>
</button>
              ))}
            </div>
          </div>
        </section>
      )}
<a
  href="https://wa.me/639053366544"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    position: "fixed",
    bottom: "22px",
    right: "22px",
    background: "#25D366",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: "bold",
    zIndex: 9999,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)"
  }}
>
  Chat with us
</a>
      {/* FOOTER */}
      <footer style={footer}>
        <h2 style={footerLogo}>LEGACY</h2>

        <p style={footerSub}>POLE & AERIAL STUDIO</p>

        <p style={{ color: "#999", marginTop: "25px" }}>
          bookings@legacypolestudio.com
        </p>
      </footer>
    </div>
  );
}

/* STYLES */
const dashboardBox = {
  border: "1px solid rgba(200,169,107,0.25)",
  background: "rgba(0,0,0,0.70)",
  borderRadius: "24px",
  padding: "24px",
  marginBottom: "28px"
};
const app = {
  minHeight: "100vh",
  backgroundImage: "url('/studio-bg.jpeg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  color: "#f5f1ea",
  fontFamily: "Georgia, serif"
};

const navbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 60px",
  minHeight: "90px",
  borderBottom: "1px solid rgba(200,169,107,0.2)"
};

const logoText = {
  margin: 0,
  color: "#c8a96b",
  letterSpacing: "8px",
  fontSize: "34px",
  fontWeight: "300"
};

const logoSubText = {
  margin: 0,
  color: "#777",
  letterSpacing: "4px",
  fontSize: "11px"
};

const navLinks = {
  display: "flex",
  gap: "40px",
  alignItems: "center"
};

const navButton = {
  background: "transparent",
  border: "none",
  color: "#aaa",
  letterSpacing: "3px",
  fontSize: "12px",
  cursor: "pointer"
};

const goldButton = {
  background: "#c8a96b",
  color: "#050505",
  border: "none",
  padding: "14px 28px",
  borderRadius: "999px",
  letterSpacing: "3px",
  fontWeight: "700",
  cursor: "pointer"
};

const goldButtonLarge = {
  background: "#c8a96b",
  color: "#050505",
  border: "none",
  padding: "18px 34px",
  borderRadius: "999px",
  letterSpacing: "3px",
  fontWeight: "700",
  cursor: "pointer"
};

const outlineButton = {
  background: "transparent",
  color: "#c8a96b",
  border: "1px solid rgba(200,169,107,0.6)",
  padding: "18px 34px",
  borderRadius: "999px",
  letterSpacing: "3px",
  fontWeight: "700",
  cursor: "pointer"
};

const hero = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  minHeight: "auto"
};

const heroLeft = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "20px"
};

const heroRight = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden"
};

const glowCircle = {
  width: "430px",
  height: "560px",
  borderRadius: "260px 260px 40px 40px",
  border: "1px solid rgba(200,169,107,0.35)",
  boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const bigLetter = {
  fontSize: "230px",
  color: "rgba(200,169,107,0.16)",
  fontWeight: "300"
};

const bigLetterSmall = {
  fontSize: "180px",
  color: "rgba(200,169,107,0.12)"
};

const heroTitle = {
  fontSize: "92px",
  lineHeight: "0.95",
  margin: "20px 0",
  fontWeight: "300"
};

const goldSmallText = {
  color: "#c8a96b",
  letterSpacing: "5px",
  fontSize: "13px",
  textTransform: "uppercase"
};

const goldLine = {
  width: "390px",
  height: "2px",
  background:
    "linear-gradient(90deg, rgba(200,169,107,1) 0%, rgba(200,169,107,0.4) 100%)",
  marginTop: "32px",
  marginBottom: "32px"
};

const paragraph = {
  color: "#b8b8b8",
  fontSize: "18px",
  lineHeight: "1.9"
};

const aboutSection = {
  padding: "100px 70px",
  borderTop: "1px solid rgba(200,169,107,0.25)",
  background: "#000"
};

const aboutGrid = {
  maxWidth: "1180px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "0.9fr 1.1fr",
  gap: "70px",
  alignItems: "center"
};

const archedPanel = {
  height: "520px",
  borderRadius: "300px 300px 40px 40px",
  border: "1px solid rgba(200,169,107,0.3)",
  background:
    "linear-gradient(180deg, rgba(200,169,107,0.15), rgba(0,0,0,1))",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const sectionHeading = {
  fontSize: "58px",
  fontWeight: "300",
  margin: "15px 0 30px"
};

const centerPage = {
  minHeight: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px"
};

const formCard = {
  width: "100%",
  maxWidth: "700px",
  background: "rgba(0,0,0,0.78)",
backdropFilter: "blur(6px)",
  border: "1px solid rgba(200,169,107,0.25)",
  borderRadius: "34px",
  padding: "50px"
};

const inputStyle = {
  width: "100%",
  padding: "18px",
  marginBottom: "16px",
  borderRadius: "14px",
  border: "1px solid rgba(200,169,107,0.35)",
  background: "#070707",
  color: "#fff",
  fontSize: "16px",
  boxSizing: "border-box"
};

const waiverBox = {
  maxHeight: "420px",
  overflowY: "scroll",
  padding: "25px",
  border: "1px solid rgba(200,169,107,0.2)",
  borderRadius: "20px",
  background: "#080808",
  color: "#b8b8b8",
  lineHeight: "1.9",
  fontSize: "15px"
};

const checkboxLabel = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginTop: "25px",
  color: "#ddd"
};

const packageGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "24px"
};

const packageCard = {
  background: "rgba(0,0,0,0.70)",
  border: "1px solid rgba(200,169,107,0.25)",
  color: "#f5f1ea",
  borderRadius: "26px",
  padding: "28px",
  textAlign: "left",
  cursor: "pointer"
};

const packagePrice = {
  fontSize: "34px",
  fontWeight: "300",
  margin: "18px 0"
};

const footer = {
  padding: "60px",
  borderTop: "1px solid rgba(200,169,107,0.2)",
  background: "#050505",
  textAlign: "center"
};

const footerLogo = {
  color: "#c8a96b",
  letterSpacing: "8px",
  fontWeight: "300",
  marginBottom: "12px"
};

const footerSub = {
  color: "#777",
  letterSpacing: "3px",
  fontSize: "12px"
};
const calendarBox = {
  background: "#efe3c8",
  borderRadius: "30px",
  padding: "30px",
  marginTop: "20px"
};

const calendarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "14px",
  textAlign: "center"
};

const dateButton = {
  border: "none",
  borderRadius: "999px",
  padding: "16px",
  fontSize: "16px",
  cursor: "pointer"
};
