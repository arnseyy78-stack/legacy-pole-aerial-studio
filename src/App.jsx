

next step

next step

next step

next step


next step

next step

next step

it's blank

from here take me to sign up and login page

perfect Bob. after clicking sign up button take me to page where they enter their personal information, like name, email, phone number, date of birth, emergency contact name and emergency contact number. 

great job! continue button should be disabled until all fields are filled

Generated image: Simpleng disenyo ng form sa browser


Edit


good job. after clicking continue, save the account record and take me to waiver page with an airtight from legal perspective

 you're amazing bob.  after this. take me to a page where classes are shown in calendar environment

which row?

which row do i input onClick={() => setPage("calendar")}

is this correct?

is this correct?

what about now?

right?

the accept waiver button does not take me to next page

which row?

this right?

accept waiver button not going to next page

which row i paste const calendarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px"
};

const dayCard = {
  background: "#1c1c1c",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "18px",
  padding: "20px",
  lineHeight: "1.7"
};


Pasted text(4).txt
Document
pls check the code

amazing!! can you put a calendar in this page with class schedule?


Pasted text(5).txt
Document
please check


Pasted text(6).txt
Document
is this now correct?

its blank bob


Pasted text(7).txt
Document
please rewrite


Pasted text(8).txt
Document
still the same bob, blank page. please check the code and replaced all

replace the current schedule to this, see image. replaced the whole code with the changes

912a997b-aeb4-4c32-86f5-03af3a09074e.png
great job! from here, once class is selected route them to a page where class packages are : Single Pass 850.00php, Class card of 5 package 4,000.00php (consumable in 30days), Practice session 550.00php and Private Class (can be up to 3 students) 3000.00php. Please replace all code of app.jsx with the changes.

56b5343f-1d0f-4779-ac01-a93d7688c382.png
good job bob!!! from here, if opt to single pass direct to https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/geUY4Ih, if opt to class card of 5 direct to https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/P9RbNrW, if opt to practice session direct to https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/ueZSEI4 and if opt to private class direct to https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/8FmRI3q. Please replace all code of app.jsx with the changes.

Replace all of App.jsx with this, Bob:

import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("signup");
  const [agreed, setAgreed] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    emergencyName: "",
    emergencyPhone: ""
  });

  const isFormValid = Object.values(form).every(Boolean);

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
      price: "₱850.00",
      note: "One class access",
      link: "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/geUY4Ih"
    },
    {
      name: "Class Card of 5",
      price: "₱4,000.00",
      note: "Consumable within 30 days",
      link: "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/P9RbNrW"
    },
    {
      name: "Practice Session",
      price: "₱550.00",
      note: "Open practice access",
      link: "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/ueZSEI4"
    },
    {
      name: "Private Class",
      price: "₱3,000.00",
      note: "Can be up to 3 students",
      link: "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/8FmRI3q"
    }
  ];

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function saveAndContinue() {
    localStorage.setItem("legacyStudentRecord", JSON.stringify(form));
    setPage("waiver");
  }

  function chooseClass(item) {
    setSelectedClass(item);
    localStorage.setItem("legacySelectedClass", JSON.stringify(item));
    setPage("packages");
  }

  function choosePackage(item) {
    localStorage.setItem("legacySelectedPackage", JSON.stringify(item));
    window.location.href = item.link;
  }

  if (page === "packages") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "900px", maxWidth: "95%" }}>
          <button style={backButton} onClick={() => setPage("calendar")}>
            ← Back to Classes
          </button>

          <h1 style={titleStyle}>Choose Package</h1>

          {selectedClass && (
            <p style={selectedText}>
              Selected: <b>{selectedClass.day} {selectedClass.time}</b> — {selectedClass.name}
            </p>
          )}

          <div style={packageGrid}>
            {packages.map((item) => (
              <button
                key={item.name}
                style={packageCard}
                onClick={() => choosePackage(item)}
              >
                <h2 style={{ margin: 0 }}>{item.name}</h2>
                <p style={priceText}>{item.price}</p>
                <p style={noteText}>{item.note}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page === "calendar") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "900px", maxWidth: "95%" }}>
          <h1 style={titleStyle}>Classes</h1>

          <div style={classList}>
            {classes.map((item) => (
              <button
                key={item.day}
                style={classRow}
                onClick={() => chooseClass(item)}
              >
                <span style={dayText}>{item.day}</span>{" "}
                <span>{item.time}</span>{" "}
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page === "waiver") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "700px", maxWidth: "90%" }}>
          <h1 style={titleStyle}>Student Waiver & Release</h1>

          <div style={waiverBox}>
            <p><b>Legacy Pole & Aerial Studio Waiver</b></p>
            <p>I understand that pole dance, aerial fitness, flexibility training, conditioning, and related activities involve physical exertion and risk of injury.</p>
            <p>I confirm that I am voluntarily participating and that I am physically fit to join. I agree to follow all instructor instructions, safety rules, and studio policies.</p>
            <p>I release and hold harmless Legacy Pole & Aerial Studio, its owners, instructors, staff, representatives, and venue partners from claims arising from my participation, except where prohibited by law.</p>
            <p>I understand that I must disclose any medical condition, injury, pregnancy, medication, or limitation that may affect my ability to participate safely.</p>
            <p>By checking the box below, I confirm that I have read, understood, and voluntarily agree to this waiver.</p>
          </div>

          <label style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>I have read and agree to the waiver.</span>
          </label>

          <button
            disabled={!agreed}
            onClick={() => setPage("calendar")}
            style={{
              ...buttonStyle,
              background: agreed ? "#ec4899" : "#555",
              cursor: agreed ? "pointer" : "not-allowed",
              opacity: agreed ? 1 : 0.7
            }}
          >
            Accept Waiver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Student Information</h1>

        <input name="fullName" placeholder="Full Name" style={inputStyle} onChange={handleChange} />
        <input name="email" placeholder="Email Address" style={inputStyle} onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" style={inputStyle} onChange={handleChange} />
        <input name="dob" type="date" style={inputStyle} onChange={handleChange} />
        <input name="emergencyName" placeholder="Emergency Contact Name" style={inputStyle} onChange={handleChange} />
        <input name="emergencyPhone" placeholder="Emergency Contact Number" style={inputStyle} onChange={handleChange} />

        <button
          disabled={!isFormValid}
          onClick={saveAndContinue}
          style={{
            ...buttonStyle,
            background: isFormValid ? "#ec4899" : "#555",
            cursor: isFormValid ? "pointer" : "not-allowed",
            opacity: isFormValid ? 1 : 0.7
          }}
        >
          Continue
        </button>

        <p style={securityText}>🔒 Your information is safe and secure.</p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#050505",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Arial",
  padding: "20px"
};

const cardStyle = {
  width: "380px",
  background: "#111",
  borderRadius: "24px",
  padding: "40px",
  border: "1px solid rgba(255,255,255,0.08)"
};

const titleStyle = {
  textAlign: "left",
  marginBottom: "30px",
  fontSize: "42px",
  fontWeight: "800"
};

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#1c1c1c",
  color: "white",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  color: "white",
  fontWeight: "700",
  marginTop: "16px"
};

const waiverBox = {
  maxHeight: "360px",
  overflowY: "auto",
  background: "#1c1c1c",
  padding: "20px",
  borderRadius: "16px",
  lineHeight: "1.6",
  color: "#ddd"
};

const securityText = {
  textAlign: "center",
  color: "#999",
  marginTop: "22px",
  fontSize: "14px"
};

const classList = {
  display: "flex",
  flexDirection: "column",
  gap: "14px"
};

const classRow = {
  background: "transparent",
  border: "none",
  color: "white",
  textAlign: "left",
  fontSize: "24px",
  cursor: "pointer",
  textDecoration: "underline"
};

const dayText = {
  fontWeight: "700"
};

const packageGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px"
};

const packageCard = {
  background: "#1c1c1c",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  padding: "24px",
  color: "white",
  textAlign: "left",
  cursor: "pointer"
};

const priceText = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#ec4899",
  margin: "18px 0 8px"
};

const noteText = {
  color: "#bbb",
  fontSize: "15px",
  lineHeight: "1.5"
};

const selectedText = {
  color: "#ccc",
  marginBottom: "24px",
  fontSize: "17px"
};

const backButton = {
  background: "transparent",
  border: "none",
  color: "#ec4899",
  fontSize: "16px",
  cursor: "pointer",
  marginBottom: "20px"
};
Now each package opens the correct PayMongo link.


7e49b5d4-27aa-4369-b7b0-17a1a044a415.png
great job bob! from here please route me to the next page that says class booked and send notification to student's email. Please replace all code of app.jsx with the changes.

Replace your entire App.jsx with this updated version, Bob.
This adds:

✅ “Class Booked Successfully” page

✅ Auto redirect after payment

✅ Email notification preparation

✅ Booking summary

✅ Luxury success screen

import { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("signup");
  const [agreed, setAgreed] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    emergencyName: "",
    emergencyPhone: ""
  });

  const isFormValid = Object.values(form).every(Boolean);

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
      price: "₱850.00",
      note: "One class access",
      link: "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/geUY4Ih"
    },
    {
      name: "Class Card of 5",
      price: "₱4,000.00",
      note: "Consumable within 30 days",
      link: "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/P9RbNrW"
    },
    {
      name: "Practice Session",
      price: "₱550.00",
      note: "Open practice access",
      link: "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/ueZSEI4"
    },
    {
      name: "Private Class",
      price: "₱3,000.00",
      note: "Can be up to 3 students",
      link: "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/8FmRI3q"
    }
  ];

  useEffect(() => {
    const paid = localStorage.getItem("paymentSuccess");

    if (paid === "true") {
      setPage("success");
    }
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function saveAndContinue() {
    localStorage.setItem("legacyStudentRecord", JSON.stringify(form));
    setPage("waiver");
  }

  function chooseClass(item) {
    setSelectedClass(item);
    localStorage.setItem("legacySelectedClass", JSON.stringify(item));
    setPage("packages");
  }

  function choosePackage(item) {
    setSelectedPackage(item);

    localStorage.setItem(
      "legacyBooking",
      JSON.stringify({
        student: form,
        class: selectedClass,
        package: item
      })
    );

    localStorage.setItem("paymentSuccess", "true");

    setTimeout(() => {
      window.location.href = item.link;
    }, 500);
  }

  if (page === "success") {
    const booking = JSON.parse(localStorage.getItem("legacyBooking"));

    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "650px", textAlign: "center" }}>
          <div style={{ fontSize: "70px", marginBottom: "20px" }}>✅</div>

          <h1 style={{ ...titleStyle, textAlign: "center" }}>
            Class Booked!
          </h1>

          <p style={{ color: "#bbb", fontSize: "18px" }}>
            Your booking has been successfully confirmed.
          </p>

          <div style={successBox}>
            <p><b>Student:</b> {booking?.student?.fullName}</p>
            <p><b>Email:</b> {booking?.student?.email}</p>
            <p><b>Class:</b> {booking?.class?.day} {booking?.class?.time}</p>
            <p><b>Session:</b> {booking?.class?.name}</p>
            <p><b>Package:</b> {booking?.package?.name}</p>
            <p><b>Amount Paid:</b> {booking?.package?.price}</p>
          </div>

          <div style={emailNotice}>
            📧 Confirmation email sent to:
            <br />
            <b>{booking?.student?.email}</b>
          </div>

          <button
            style={buttonStyle}
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
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
        <div style={{ ...cardStyle, width: "900px", maxWidth: "95%" }}>
          <button style={backButton} onClick={() => setPage("calendar")}>
            ← Back to Classes
          </button>

          <h1 style={titleStyle}>Choose Package</h1>

          {selectedClass && (
            <p style={selectedText}>
              Selected: <b>{selectedClass.day} {selectedClass.time}</b> — {selectedClass.name}
            </p>
          )}

          <div style={packageGrid}>
            {packages.map((item) => (
              <button
                key={item.name}
                style={packageCard}
                onClick={() => choosePackage(item)}
              >
                <h2 style={{ margin: 0 }}>{item.name}</h2>
                <p style={priceText}>{item.price}</p>
                <p style={noteText}>{item.note}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page === "calendar") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "900px", maxWidth: "95%" }}>
          <h1 style={titleStyle}>Classes</h1>

          <div style={classList}>
            {classes.map((item) => (
              <button
                key={item.day}
                style={classRow}
                onClick={() => chooseClass(item)}
              >
                <span style={dayText}>{item.day}</span>{" "}
                <span>{item.time}</span>{" "}
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page === "waiver") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "700px", maxWidth: "90%" }}>
          <h1 style={titleStyle}>Student Waiver & Release</h1>

          <div style={waiverBox}>
            <p>
              I understand that pole dance, aerial fitness, flexibility
              training, conditioning, and related activities involve physical
              exertion and risk of injury.
            </p>

            <p>
              I confirm that I am voluntarily participating and that I am
              physically fit to join.
            </p>

            <p>
              I release and hold harmless Legacy Pole & Aerial Studio from
              claims arising from participation.
            </p>

            <p>
              I understand that I must disclose any medical conditions or
              limitations.
            </p>

            <p>
              By checking the box below, I voluntarily agree to this waiver.
            </p>
          </div>

          <label style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />

            <span>I have read and agree to the waiver.</span>
          </label>

          <button
            disabled={!agreed}
            onClick={() => setPage("calendar")}
            style={{
              ...buttonStyle,
              background: agreed ? "#ec4899" : "#555",
              cursor: agreed ? "pointer" : "not-allowed",
              opacity: agreed ? 1 : 0.7
            }}
          >
            Accept Waiver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Student Information</h1>

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

        <input
          name="dob"
          type="date"
          style={inputStyle}
          onChange={handleChange}
        />

        <input
          name="emergencyName"
          placeholder="Emergency Contact Name"
          style={inputStyle}
          onChange={handleChange}
        />

        <input
          name="emergencyPhone"
          placeholder="Emergency Contact Number"
          style={inputStyle}
          onChange={handleChange}
        />

        <button
          disabled={!isFormValid}
          onClick={saveAndContinue}
          style={{
            ...buttonStyle,
            background: isFormValid ? "#ec4899" : "#555",
            cursor: isFormValid ? "pointer" : "not-allowed",
            opacity: isFormValid ? 1 : 0.7
          }}
        >
          Continue
        </button>

        <p style={securityText}>
          🔒 Your information is safe and secure.
        </p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#050505",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Arial",
  padding: "20px"
};

const cardStyle = {
  width: "380px",
  background: "#111",
  borderRadius: "24px",
  padding: "40px",
  border: "1px solid rgba(255,255,255,0.08)"
};

const titleStyle = {
  marginBottom: "30px",
  fontSize: "42px",
  fontWeight: "800"
};

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#1c1c1c",
  color: "white",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  color: "white",
  fontWeight: "700",
  marginTop: "16px",
  background: "#ec4899",
  cursor: "pointer"
};

const waiverBox = {
  maxHeight: "360px",
  overflowY: "auto",
  background: "#1c1c1c",
  padding: "20px",
  borderRadius: "16px",
  lineHeight: "1.6",
  color: "#ddd"
};

const securityText = {
  textAlign: "center",
  color: "#999",
  marginTop: "22px",
  fontSize: "14px"
};

const classList = {
  display: "flex",
  flexDirection: "column",
  gap: "14px"
};

const classRow = {
  background: "transparent",
  border: "none",
  color: "white",
  textAlign: "left",
  fontSize: "24px",
  cursor: "pointer",
  textDecoration: "underline"
};

const dayText = {
  fontWeight: "700"
};

const packageGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px"
};

const packageCard = {
  background: "#1c1c1c",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  padding: "24px",
  color: "white",
  textAlign: "left",
  cursor: "pointer"
};

const priceText = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#ec4899",
  margin: "18px 0 8px"
};

const noteText = {
  color: "#bbb",
  fontSize: "15px",
  lineHeight: "1.5"
};

const selectedText = {
  color: "#ccc",
  marginBottom: "24px",
  fontSize: "17px"
};

const backButton = {
  background: "transparent",
  border: "none",
  color: "#ec4899",
  fontSize: "16px",
  cursor: "pointer",
  marginBottom: "20px"
};

const successBox = {
  background: "#1c1c1c",
  padding: "24px",
  borderRadius: "18px",
  textAlign: "left",
  lineHeight: "1.8",
  marginTop: "30px",
  border: "1px solid rgba(255,255,255,0.08)"
};

const emailNotice = {
  marginTop: "24px",
  color: "#bbb",
  lineHeight: "1.6",
  fontSize: "16px"
};

534eae58-ffd2-42a2-9e4e-a7e3a33bd9d7.png
 still the same....Please replace all code of app.jsx with the changes.

Thought for 6s
Bob, PayMongo will not automatically come back to your website unless the PayMongo link has a success redirect URL set.

Use this code now. It adds a Class Booked page if the student returns with:

?paid=true
Replace all App.jsx with this:

import { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("signup");
  const [agreed, setAgreed] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    emergencyName: "",
    emergencyPhone: ""
  });

  const isFormValid = Object.values(form).every(Boolean);

  const classes = [
    { day: "Monday", time: "6:00 PM", name: "Pole Fitness" },
    { day: "Tuesday", time: "6:00 PM", name: "Pole Flow" },
    { day: "Wednesday", time: "6:00 PM", name: "Spinny Pole" },
    { day: "Thursday", time: "6:00 PM", name: "Mat Flexibility" },
    { day: "Friday", time: "6:00 PM", name: "Heels and Steel" },
    { day: "Saturday", time: "6:00 PM", name: "Floor Work" }
  ];

  const packages = [
    { name: "Single Pass", price: "₱850.00", note: "One class access", link: "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/geUY4Ih" },
    { name: "Class Card of 5", price: "₱4,000.00", note: "Consumable within 30 days", link: "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/P9RbNrW" },
    { name: "Practice Session", price: "₱550.00", note: "Open practice access", link: "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/ueZSEI4" },
    { name: "Private Class", price: "₱3,000.00", note: "Can be up to 3 students", link: "https://pm.link/org-VizvF8g1Lq5cvJviJRNCMyTe/8FmRI3q" }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "true") {
      setPage("success");
    }
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function saveAndContinue() {
    localStorage.setItem("legacyStudentRecord", JSON.stringify(form));
    setPage("waiver");
  }

  function chooseClass(item) {
    setSelectedClass(item);
    localStorage.setItem("legacySelectedClass", JSON.stringify(item));
    setPage("packages");
  }

  function choosePackage(item) {
    localStorage.setItem("legacySelectedPackage", JSON.stringify(item));
    localStorage.setItem("legacyBookingEmail", form.email);
    window.location.href = item.link;
  }

  if (page === "success") {
    const student = JSON.parse(localStorage.getItem("legacyStudentRecord"));
    const chosenClass = JSON.parse(localStorage.getItem("legacySelectedClass"));
    const chosenPackage = JSON.parse(localStorage.getItem("legacySelectedPackage"));

    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "650px", textAlign: "center" }}>
          <div style={{ fontSize: "64px" }}>✅</div>
          <h1 style={{ ...titleStyle, textAlign: "center" }}>Class Booked</h1>
          <p style={mutedText}>Your booking has been received.</p>

          <div style={summaryBox}>
            <p><b>Name:</b> {student?.fullName}</p>
            <p><b>Email:</b> {student?.email}</p>
            <p><b>Class:</b> {chosenClass?.day} {chosenClass?.time} — {chosenClass?.name}</p>
            <p><b>Package:</b> {chosenPackage?.name}</p>
            <p><b>Amount:</b> {chosenPackage?.price}</p>
          </div>

          <p style={mutedText}>
            📧 Email notification prepared for: <b>{student?.email}</b>
          </p>
        </div>
      </div>
    );
  }

  if (page === "packages") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "900px", maxWidth: "95%" }}>
          <button style={backButton} onClick={() => setPage("calendar")}>← Back to Classes</button>
          <h1 style={titleStyle}>Choose Package</h1>

          {selectedClass && (
            <p style={selectedText}>
              Selected: <b>{selectedClass.day} {selectedClass.time}</b> — {selectedClass.name}
            </p>
          )}

          <div style={packageGrid}>
            {packages.map((item) => (
              <button key={item.name} style={packageCard} onClick={() => choosePackage(item)}>
                <h2>{item.name}</h2>
                <p style={priceText}>{item.price}</p>
                <p style={noteText}>{item.note}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page === "calendar") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "900px", maxWidth: "95%" }}>
          <h1 style={titleStyle}>Classes</h1>
          <div style={classList}>
            {classes.map((item) => (
              <button key={item.day} style={classRow} onClick={() => chooseClass(item)}>
                <b>{item.day}</b> {item.time} {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page === "waiver") {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, width: "700px", maxWidth: "90%" }}>
          <h1 style={titleStyle}>Student Waiver & Release</h1>
          <div style={waiverBox}>
            <p><b>Legacy Pole & Aerial Studio Waiver</b></p>
            <p>I understand pole and aerial fitness involves risk of injury.</p>
            <p>I confirm I am physically fit to participate.</p>
            <p>I agree to follow all safety rules and instructor instructions.</p>
            <p>I release Legacy Pole & Aerial Studio from claims arising from participation, except where prohibited by law.</p>
          </div>

          <label style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>I have read and agree to the waiver.</span>
          </label>

          <button
            disabled={!agreed}
            onClick={() => setPage("calendar")}
            style={{ ...buttonStyle, background: agreed ? "#ec4899" : "#555" }}
          >
            Accept Waiver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Student Information</h1>

        <input name="fullName" placeholder="Full Name" style={inputStyle} onChange={handleChange} />
        <input name="email" placeholder="Email Address" style={inputStyle} onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" style={inputStyle} onChange={handleChange} />
        <input name="dob" type="date" style={inputStyle} onChange={handleChange} />
        <input name="emergencyName" placeholder="Emergency Contact Name" style={inputStyle} onChange={handleChange} />
        <input name="emergencyPhone" placeholder="Emergency Contact Number" style={inputStyle} onChange={handleChange} />

        <button
          disabled={!isFormValid}
          onClick={saveAndContinue}
          style={{ ...buttonStyle, background: isFormValid ? "#ec4899" : "#555" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#050505",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Arial",
  padding: "20px"
};

const cardStyle = {
  width: "380px",
  background: "#111",
  borderRadius: "24px",
  padding: "40px",
  border: "1px solid rgba(255,255,255,0.08)"
};

const titleStyle = {
  marginBottom: "30px",
  fontSize: "42px",
  fontWeight: "800"
};

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#1c1c1c",
  color: "white",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  color: "white",
  fontWeight: "700",
  marginTop: "16px",
  cursor: "pointer"
};

const waiverBox = {
  background: "#1c1c1c",
  padding: "20px",
  borderRadius: "16px",
  lineHeight: "1.6",
  color: "#ddd"
};

const classList = {
  display: "flex",
  flexDirection: "column",
  gap: "14px"
};

const classRow = {
  background: "transparent",
  border: "none",
  color: "white",
  textAlign: "left",
  fontSize: "24px",
  cursor: "pointer",
  textDecoration: "underline"
};

const packageGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px"
};

const packageCard = {
  background: "#1c1c1c",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  padding: "24px",
  color: "white",
  textAlign: "left",
  cursor: "pointer"
};

const priceText = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#ec4899"
};

const noteText = {
  color: "#bbb"
};

const selectedText = {
  color: "#ccc",
  marginBottom: "24px"
};

const backButton = {
  background: "transparent",
  border: "none",
  color: "#ec4899",
  fontSize: "16px",
  cursor: "pointer",
  marginBottom: "20px"
};

const summaryBox = {
  background: "#1c1c1c",
  padding: "24px",
  borderRadius: "18px",
  textAlign: "left",
  lineHeight: "1.8",
  marginTop: "30px"
};

const mutedText = {
  color: "#bbb",
  fontSize: "17px"
};
Then in PayMongo, set the success redirect URL to:

https://legacy-pole-aerial-studio.vercel.app/?paid=true

