import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");

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

  function saveStudentInfo() {
    localStorage.setItem("legacyStudent", JSON.stringify(student));
    setPage("waiver")
  }

  function savePassword() {
    localStorage.setItem("legacyStudent", JSON.stringify(student));
    setPage("booking");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050505",
        color: "#f5f1ea",
        fontFamily: "Georgia, serif"
      }}
    >
      {/* NAVBAR */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "30px 60px",
          borderBottom: "1px solid rgba(200,169,107,0.2)"
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#c8a96b",
              letterSpacing: "8px",
              fontSize: "34px",
              fontWeight: "300"
            }}
          >
            LEGACY
          </h1>

          <p
            style={{
              margin: 0,
              color: "#777",
              letterSpacing: "4px",
              fontSize: "11px"
            }}
          >
            POLE & AERIAL STUDIO
          </p>
        </div>

        <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          <button onClick={() => setPage("home")} style={navButton}>
            HOME
          </button>

          <button onClick={() => setPage("booking")} style={navButton}>
            PACKAGES
          </button>

          <button onClick={() => setPage("authChoice")} style={goldButton}>
            BOOK NOW
          </button>
        </div>
      </div>
            {/* HOME PAGE */}

      {page === "home" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              minHeight: "85vh"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "80px"
              }}
            >
              <p style={goldSmallText}>WELCOME TO LEGACY</p>

              <h1
                style={{
                  fontSize: "92px",
                  lineHeight: "0.95",
                  margin: "20px 0",
                  fontWeight: "300"
                }}
              >
                Strength.
                <br />
                Elegance.
                <br />
                Legacy.
              </h1>

              <div
                style={{
                  width: "120px",
                  height: "1px",
                  background: "#c8a96b",
                  margin: "30px 0"
                }}
              />

              <p
                style={{
                  color: "#b8b8b8",
                  fontSize: "18px",
                  lineHeight: "1.8",
                  maxWidth: "520px"
                }}
              >
                A luxury pole and aerial studio designed for confidence,
                movement, empowerment, and artistry.
              </p>

              <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
                <button
                  onClick={() => setPage("student")}
                  style={goldButtonLarge}
                >
                  BOOK YOUR CLASS
                </button>

                <button onClick={() => setPage("booking")} style={outlineButton}>
                  VIEW PACKAGES
                </button>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, rgba(200,169,107,0.12), rgba(0,0,0,0.95))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at center, rgba(200,169,107,0.25), transparent 55%)"
                }}
              />

              <div
                style={{
                  width: "430px",
                  height: "560px",
                  borderRadius: "260px 260px 40px 40px",
                  border: "1px solid rgba(200,169,107,0.35)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(200,169,107,0.05), rgba(0,0,0,0.9))",
                  boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}
              >
                <span
                  style={{
                    fontSize: "230px",
                    color: "rgba(200,169,107,0.16)",
                    fontWeight: "300"
                  }}
                >
                  L
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "100px 70px",
              borderTop: "1px solid rgba(200,169,107,0.25)",
              background: "#080808"
            }}
          >
            <div
              style={{
                maxWidth: "1180px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "0.9fr 1.1fr",
                gap: "70px",
                alignItems: "center"
              }}
            >
              <div style={archedPanel}>
                <span style={{ fontSize: "180px", color: "rgba(200,169,107,0.12)" }}>
                  L
                </span>
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
          </div>
        </>
      )}
            {/* STUDENT INFO */}

      {page === "student" && (
        <div
          style={{
            minHeight: "85vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "700px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(200,169,107,0.25)",
              borderRadius: "34px",
              padding: "50px"
            }}
          >
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
        </div>
      )}
{/* WAIVER */}

{page === "waiver" && (
  <div
    style={{
      minHeight: "85vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "60px"
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(200,169,107,0.25)",
        borderRadius: "34px",
        padding: "50px"
      }}
    >
      <p style={goldSmallText}>STUDIO WAIVER</p>

      <h2 style={sectionHeading}>
        Liability Waiver
      </h2>

      <div
        style={{
          maxHeight: "420px",
          overflowY: "scroll",
          padding: "25px",
          border: "1px solid rgba(200,169,107,0.2)",
          borderRadius: "20px",
          background: "#080808",
          color: "#b8b8b8",
          lineHeight: "1.9",
          fontSize: "15px"
        }}
      >
        <p>
          I understand that participation in pole fitness, aerial arts,
          flexibility training, dance, conditioning, and related physical
          activities involves inherent risks including but not limited to:
          falls, physical injury, muscle strain, bruising, spinal injury,
          paralysis, permanent disability, or death.
        </p>

        <p>
          I voluntarily assume all risks associated with participation in any
          activity conducted by Legacy Pole & Aerial Studio.
        </p>

        <p>
          I certify that I am physically fit and capable of participating in
          these activities and that I have consulted a medical professional if
          necessary.
        </p>

        <p>
          I agree to immediately disclose any injuries, pregnancy, medical
          conditions, or physical limitations to the studio prior to
          participation.
        </p>

        <p>
          I release and discharge Legacy Pole & Aerial Studio, its owners,
          instructors, staff, contractors, and affiliates from any and all
          liability, claims, demands, damages, actions, or causes of action
          arising out of participation in studio activities.
        </p>

        <p>
          I understand that all purchases are non-refundable unless otherwise
          required by law.
        </p>

        <p>
          I acknowledge that unauthorized recording, photography, harassment,
          unsafe conduct, intoxication, or disruptive behavior may result in
          immediate removal from the premises without refund.
        </p>

        <p>
          I grant permission for photographs or videos taken during classes to
          be used for promotional and marketing purposes unless I notify the
          studio in writing.
        </p>

        <p>
          By proceeding, I confirm that I have read, understood, and voluntarily
          agree to this waiver and release of liability.
        </p>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "25px",
          color: "#ddd"
        }}
      >
        <input type="checkbox" />
        I agree to the Liability Waiver
      </label>

      <button
        onClick={() => setPage("createPassword")}
        style={{
          ...goldButtonLarge,
          width: "100%",
          marginTop: "25px"
        }}
      >
        CONTINUE
      </button>
    </div>
  </div>
)}
      {/* LOGIN OR SIGN UP */}

      {page === "authChoice" && (
        <div
          style={{
            minHeight: "85vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "650px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(200,169,107,0.25)",
              borderRadius: "34px",
              padding: "50px"
            }}
          >
            <p style={goldSmallText}>ACCOUNT SETUP</p>

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
        </div>
      )}

      {/* CREATE PASSWORD */}

      {page === "createPassword" && (
        <div
          style={{
            minHeight: "85vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "650px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(200,169,107,0.25)",
              borderRadius: "34px",
              padding: "50px"
            }}
          >
            <p style={goldSmallText}>ACCOUNT SECURITY</p>

            <h2 style={sectionHeading}>Create Password</h2>

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
        </div>
      )}
            {/* LOGIN */}

      {page === "login" && (
        <div style={centerPage}>
          <div style={formCard}>
            <p style={goldSmallText}>WELCOME BACK</p>

            <h2 style={sectionHeading}>Login</h2>

            <input
              placeholder="Email Address"
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              style={inputStyle}
            />

            <button
              onClick={() => setPage("booking")}
              style={{
                ...goldButtonLarge,
                width: "100%",
                marginTop: "10px"
              }}
            >
              LOGIN
            </button>
          </div>
        </div>
      )}

      {/* PACKAGES */}

      {page === "booking" && (
        <div style={centerPage}>
          <div
            style={{
              ...formCard,
              maxWidth: "950px"
            }}
          >
            <p style={goldSmallText}>CHOOSE YOUR PACKAGE</p>

            <h2 style={sectionHeading}>Studio Packages</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "24px"
              }}
            >
              {[
                ["Single Pass", "₱850", "One class access"],
                ["Class Card of 5", "₱4,000", "Five class credits"],
                ["Practice Session", "₱550", "Contact studio for time"],
                ["Private Class", "₱3,000", "Personal coaching"]
              ].map((pkg) => (
                <button
                  key={pkg[0]}
                  style={packageCard}
                >
                  <p style={goldSmallText}>{pkg[0]}</p>

                  <h3
                    style={{
                      fontSize: "34px",
                      fontWeight: "300",
                      margin: "18px 0"
                    }}
                  >
                    {pkg[1]}
                  </h3>

                  <p style={{ color: "#999", lineHeight: "1.6" }}>
                    {pkg[2]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}

      <div
        style={{
          padding: "60px",
          borderTop: "1px solid rgba(200,169,107,0.2)",
          background: "#050505",
          textAlign: "center"
        }}
      >
        <h2
          style={{
            color: "#c8a96b",
            letterSpacing: "8px",
            fontWeight: "300",
            marginBottom: "12px"
          }}
        >
          LEGACY
        </h2>

        <p
          style={{
            color: "#777",
            letterSpacing: "3px",
            fontSize: "12px"
          }}
        >
          POLE & AERIAL STUDIO
        </p>

        <p style={{ color: "#999", marginTop: "25px" }}>
          bookings@legacypolestudio.com
        </p>
      </div>
    </div>
  );
}

/* STYLES */

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

const goldSmallText = {
  color: "#c8a96b",
  letterSpacing: "5px",
  fontSize: "13px",
  textTransform: "uppercase"
};

const sectionHeading = {
  fontSize: "58px",
  fontWeight: "300",
  margin: "15px 0 30px"
};

const paragraph = {
  color: "#b8b8b8",
  fontSize: "18px",
  lineHeight: "1.9"
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

const packageCard = {
  background: "rgba(255,255,255,0.035)",
  border: "1px solid rgba(200,169,107,0.25)",
  color: "#f5f1ea",
  borderRadius: "26px",
  padding: "28px",
  textAlign: "left",
  cursor: "pointer"
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
