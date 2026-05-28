import { useEffect, useState } from "react";
import { supabase } from "./supabase";
export default function App() {
  const [page, setPage] = useState("home");
  useEffect(() => {
  loadBookings();
loadStudentBookings();

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
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedSlots, setBookedSlots] = useState({});
  const [studentBookings, setStudentBookings] = useState([]);
const [credits, setCredits] = useState(0);
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
async function loadStudentBookings() {
const studentData = JSON.parse(
  localStorage.getItem("legacyStudent")
);

if (!studentData) return;
console.log(studentData);
  const { data, error } = await supabase
    .from("Bookings")
    .select("*")
    .eq("Student_email", studentData.email)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setStudentBookings(data || []);
}


function saveStudentInfo() {
  localStorage.setItem("legacyStudent", JSON.stringify(student));
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

setStudentBookings([]);

const savedCredits =
  Number(localStorage.getItem(`legacyCredits_${data.email}`)) || 0;

setCredits(savedCredits);

alert("Login successful!");
setPage("chooseClass");
loadStudentBookings();
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
      expiry: "No expiry"
    })
  });

const packageCredits = pkg.credits || 0;

setCredits(packageCredits);
localStorage.setItem(`legacyCredits_${studentData.email}`, packageCredits);

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
          <h1 style={logoText}>LEGACY</h1>
          <p style={logoSubText}>POLE & AERIAL STUDIO</p>
        </div>

        <div style={navLinks}>
          <button onClick={() => setPage("home")} style={navButton}>
            HOME
          </button>

          <button onClick={() => setPage("packages")} style={navButton}>
            PACKAGES
          </button>

          <button onClick={() => setPage("authChoice")} style={goldButton}>
            BOOK NOW
          </button>
        </div>
      </div>

      {/* HOME */}
      {page === "home" && (
        <>
          <section style={hero}>
            <div style={heroLeft}>
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

            <div style={heroRight}>
              <div style={glowCircle}>
                <span style={bigLetter}>L</span>
              </div>
            </div>
          </section>

          <section style={aboutSection}>
            <div style={aboutGrid}>
              <div style={archedPanel}>
                <span style={bigLetterSmall}>L</span>
              </div>

              <div>
                <p style={goldSmallText}>WELCOME TO</p>

                <h2 style={sectionHeading}>
                  Legacy Pole &<br />
                  Aerial Studio
                </h2>

                <p style={paragraph}>
                  A safe, empowering and elegant space for every student to
                  discover strength, confidence, artistry and movement.
                </p>
              </div>
            </div>
          </section>
        </>
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
{/* CHOOSE CLASS */}
{page === "chooseClass" && (
  <section style={centerPage}>
    <div style={{ ...formCard, maxWidth: "950px" }}>
      <h2 style={sectionHeading}>Schedule</h2>
<div style={dashboardBox}>
  <p style={goldSmallText}>STUDENT DASHBOARD</p>

  <h3 style={{ color: "#fff", fontSize: "30px", margin: "10px 0" }}>
    Credits Remaining: {credits}
  </h3>

  <p style={{ color: "#999" }}>
    Use 1 credit per class booking
  </p>
  <div style={{ marginTop: "20px" }}>
  <p style={goldSmallText}>BOOKED CLASSES</p>

  {studentBookings.length === 0 ? (
    <p style={{ color: "#999" }}>No classes booked yet.</p>
  ) : (
    studentBookings.map((booking) => (
      <div
        key={booking.id}
        style={{
          borderTop: "1px solid rgba(200,169,107,0.2)",
          paddingTop: "12px",
          marginTop: "12px"
        }}
      >
        <p style={{ color: "#fff", margin: 0 }}>
          {booking.Class_name}
        </p>

        <p style={{ color: "#999", margin: "6px 0 0" }}>
          {booking.Booking_date} · 6:00 PM
        </p>
      </div>
    ))
  )}
</div>
</div>
      <div style={calendarBox}>
        <h3 style={{ color: "#c8a96b", textAlign: "center" }}>May 2026</h3>

        <div style={calendarGrid}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
            <strong
  key={d}
  style={{ color: "#777" }}
>
  {d}
</strong>
          ))}

          {[...Array(31)].map((_, i) => {
const day = i + 1;
const isSunday = day % 7 === 0;

const disabledDays =
  day < 25 || isSunday;

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
            Available classes for May {selectedDate}
          </h3>

          <div style={packageGrid}>
            {(() => {
  const weekday = selectedDate % 7;

  const classes = {
    1: [["6:00 PM", "Pole Fitness"]],
    2: [["6:00 PM", "Pole Flow"]],
    3: [["6:00 PM", "Spinny Pole"]],
    4: [["6:00 PM", "Intro to Pole"]],
    5: [["6:00 PM", "Exo"]],
    6: [["6:00 PM", "Floor Work"]],
    0: []
  };

  return classes[weekday] || [];
})().map((item) => (
              <button
                key={item[0]}
                style={packageCard}
                onClick={async () => {
  const bookingKey =
    `May-${selectedDate}-${item[1]}`;

  const currentBooked =
    bookedSlots[bookingKey] || 0;

  if (currentBooked >= 5) {
    alert("This class is fully booked.");
    return;
  }
if (credits <= 0) {
  alert("You do not have enough credits. Please choose a package first.");
  setPage("packages");
  return;
}
const studentData =
  JSON.parse(localStorage.getItem("legacyStudent")) || student;

const { data: existingBooking } = await supabase
  .from("Bookings")
  .select("*")
  .eq("Student_email", studentData.email)
  .eq("Class_name", item[1])
  .eq("Booking_date", `May-${selectedDate}`)
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
      Booking_date: `May-${selectedDate}`,
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
    expiry: `May ${selectedDate}, 2026 at ${item[0]}`
  })
});

const newCredits = credits - 1;

setCredits(newCredits);
localStorage.setItem(`legacyCredits_${studentData.email}`, newCredits);

alert(
  `${item[1]} booked for May ${selectedDate}`
);

loadBookings();
loadStudentBookings();

}}
              >
                <p style={goldSmallText}>{item[0]}</p>
                <h3 style={packagePrice}>{item[1]}</h3>
                <p style={{ color: "#999" }}>Tap to book this class</p>
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
        `May-${selectedDate}-${item[1]}`
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
      {/* PACKAGES */}
      {page === "packages" && (
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
    expiry: "30 Days"
  },

{
  name: "Class Card",
  price: "₱4,100",
  description: "Five class credits",
  amount: 0,
  credits: 5,
  expiry: "30 Days",
  isTest: true
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

      {/* FOOTER */}
      <footer style={footer}>
        <h2 style={footerLogo}>LEGACY</h2>

        <p style={footerSub}>POLE & AERIAL STUDIO</p>

        <p style={{ color: "#999", marginTop: "25px" }}>
          Bookings@legacypolestudio.com
        </p>
      </footer>
    </div>
  );
}

/* STYLES */
const dashboardBox = {
  border: "1px solid rgba(200,169,107,0.25)",
  background: "rgba(255,255,255,0.035)",
  borderRadius: "24px",
  padding: "24px",
  marginBottom: "28px"
};
const app = {
  minHeight: "100vh",
  backgroundColor: "#050505",
  color: "#f5f1ea",
  fontFamily: "Georgia, serif"
};

const navbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "30px 60px",
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
  minHeight: "85vh"
};

const heroLeft = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "80px"
};

const heroRight = {
  position: "relative",
  overflow: "hidden",
  background:
    "linear-gradient(135deg, rgba(200,169,107,0.12), rgba(0,0,0,0.95))",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const glowCircle = {
  width: "430px",
  height: "560px",
  borderRadius: "260px 260px 40px 40px",
  border: "1px solid rgba(200,169,107,0.35)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(200,169,107,0.05), rgba(0,0,0,0.9))",
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
  width: "120px",
  height: "1px",
  background: "#c8a96b",
  margin: "30px 0"
};

const paragraph = {
  color: "#b8b8b8",
  fontSize: "18px",
  lineHeight: "1.9"
};

const aboutSection = {
  padding: "100px 70px",
  borderTop: "1px solid rgba(200,169,107,0.25)",
  background: "#080808"
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
  minHeight: "85vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "60px"
};

const formCard = {
  width: "100%",
  maxWidth: "700px",
  background: "rgba(255,255,255,0.04)",
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
  background: "rgba(255,255,255,0.035)",
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
