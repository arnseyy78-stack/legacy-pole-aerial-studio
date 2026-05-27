import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");

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

        <div
          style={{
            display: "flex",
            gap: "40px",
            alignItems: "center"
          }}
        >
          <button style={navButton}>HOME</button>
          <button style={navButton}>CLASSES</button>
          <button style={navButton}>PACKAGES</button>

          <button
            onClick={() => setPage("booking")}
            style={goldButton}
          >
            BOOK NOW
          </button>
        </div>
      </div>

      {/* HERO SECTION */}

      {page === "home" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "85vh"
          }}
        >
          {/* LEFT SIDE */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "80px"
            }}
          >
            <p
              style={{
                color: "#c8a96b",
                letterSpacing: "6px",
                fontSize: "13px"
              }}
            >
              WELCOME TO LEGACY
            </p>

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

            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "40px"
              }}
            >
              <button
                onClick={() => setPage("booking")}
                style={goldButtonLarge}
              >
                BOOK YOUR CLASS
              </button>

              <button style={outlineButton}>
                VIEW SCHEDULE
              </button>
            </div>
          </div>
                    {/* RIGHT SIDE IMAGE STYLE */}

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

              <div
                style={{
                  position: "absolute",
                  bottom: "45px",
                  textAlign: "center"
                }}
              >
                <p
                  style={{
                    color: "#c8a96b",
                    letterSpacing: "5px",
                    fontSize: "12px"
                  }}
                >
                  MOVE WITH POWER
                </p>

                <p
                  style={{
                    color: "#aaa",
                    fontSize: "14px"
                  }}
                >
                  Luxury movement studio experience
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT SECTION */}

      {page === "home" && (
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
            <div
              style={{
                height: "520px",
                borderRadius: "300px 300px 40px 40px",
                border: "1px solid rgba(200,169,107,0.3)",
                background:
                  "linear-gradient(180deg, rgba(200,169,107,0.15), rgba(0,0,0,1))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span
                style={{
                  fontSize: "180px",
                  color: "rgba(200,169,107,0.12)"
                }}
              >
                L
              </span>
            </div>

            <div>
              <p
                style={{
                  color: "#c8a96b",
                  letterSpacing: "6px",
                  fontSize: "13px"
                }}
              >
                WELCOME TO
              </p>

              <h2
                style={{
                  fontSize: "60px",
                  fontWeight: "300",
                  lineHeight: "1.05",
                  margin: "20px 0"
                }}
              >
                Legacy Pole &<br />
                Aerial Studio
              </h2>

              <p
                style={{
                  color: "#b8b8b8",
                  fontSize: "18px",
                  lineHeight: "1.9"
                }}
              >
                A safe, empowering and elegant space for every student to
                discover strength, confidence, artistry and movement.
              </p>
                            <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "30px",
                  marginTop: "45px"
                }}
              >
                {[
                  ["SAFE", "Beginner friendly environment"],
                  ["STRONG", "Build confidence and control"],
                  ["ELEGANT", "Move with artistry"],
                  ["PRIVATE", "Secure studio experience"]
                ].map((item) => (
                  <div
                    key={item[0]}
                    style={{
                      borderLeft: "1px solid #c8a96b",
                      paddingLeft: "20px"
                    }}
                  >
                    <h3
                      style={{
                        color: "#c8a96b",
                        letterSpacing: "3px",
                        fontSize: "14px"
                      }}
                    >
                      {item[0]}
                    </h3>

                    <p
                      style={{
                        color: "#888",
                        fontSize: "14px"
                      }}
                    >
                      {item[1]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING PAGE SAMPLE */}

      {page === "booking" && (
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
              padding: "50px",
              boxShadow: "0 30px 90px rgba(0,0,0,0.5)"
            }}
          >
            <p
              style={{
                color: "#c8a96b",
                letterSpacing: "5px",
                fontSize: "13px",
                textTransform: "uppercase"
              }}
            >
              Begin Your Journey
            </p>

            <h2
              style={{
                fontSize: "58px",
                fontWeight: "300",
                margin: "15px 0 30px"
              }}
            >
              Choose Your Experience
            </h2>

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
                  style={{
                    background: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(200,169,107,0.25)",
                    color: "#f5f1ea",
                    borderRadius: "26px",
                    padding: "28px",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  <p
                    style={{
                      color: "#c8a96b",
                      letterSpacing: "3px",
                      fontSize: "12px",
                      textTransform: "uppercase"
                    }}
                  >
                    {pkg[0]}
                  </p>

                  <h3
                    style={{
                      fontSize: "34px",
                      fontWeight: "300",
                      margin: "18px 0"
                    }}
                  >
                    {pkg[1]}
                  </h3>

                  <p
                    style={{
                      color: "#999",
                      lineHeight: "1.6"
                    }}
                  >
                    {pkg[2]}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage("home")}
              style={{
                ...outlineButton,
                width: "100%",
                marginTop: "35px"
              }}
            >
              BACK TO HOME
            </button>
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

        <p
          style={{
            color: "#999",
            marginTop: "25px"
          }}
        >
          bookings@legacypolestudio.com
        </p>
      </div>
    </div>
  );
}

/* BUTTON STYLES */

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
