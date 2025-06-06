import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff } from "lucide-react";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signUp, isSigningUp } = useAuthStore();
  const { emailVerification } = useAuthStore();
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showOtpInput, setShowOtpInput] = React.useState(false);
  const [pendingUser, setPendingUser] = React.useState(""); // store form data for O
  const [otp, setOtp] = React.useState("");
  const navigate = useNavigate();

  const [otpError, setOtpError] = React.useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const verifyOtp = async () => {
    console.log("Verifying OTP:", otp, pendingUser);
    const isValidOtp = await bcrypt.compare(otp, pendingUser);
    console.log("Is OTP valid?", isValidOtp);
    setOtp("");
    return isValidOtp;
  };

  const finalCheck = async () => {
    try {
      console.log("Final Check - OTP:", otp, "Pending User:", pendingUser);
      if (otp) {
        const isValidOtp = await verifyOtp();
        console.log("Is OTP valid?", isValidOtp);
        if (!isValidOtp) {
          setError("OTP verification failed. Please enter the correct OTP.");
          return;
        }
        let isAccountCreated = await signUp(form);
        if (isAccountCreated) {
          console.log("Back Response:", isAccountCreated);
          setSuccess("Signup successful! Please log in.");
          setForm({ name: "", email: "", password: "", confirmPassword: "" });
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      }
    } catch (err) {
      console.error("Error during final check:", err);
      setError(
        err.response?.data?.message || "An error occurred during signup."
      );
    }
  };
  const handleOtpSubmit = () => {
    setOtpError("");
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      console.log("Submitting OTP:", otp);
      setShowOtpInput(false);
      finalCheck();
    } catch (err) {
      setOtpError(err.response?.data?.message || "OTP verification failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Form Data:", form);
    let emaildata = await emailVerification(form);
    console.log("Email Verification Data:", emaildata);
    if (emaildata.otp) {
      console.log("enabling otp input", emaildata);
      setShowOtpInput(true);
      setPendingUser(emaildata.otp); // Save form for OTP verification
    }
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Motivational quotes array
  const quotes = [
    "Communication is the key to connection.",
    "Great things begin with a simple hello.",
    "Every conversation is a new opportunity.",
    "Connect, share, and grow together.",
    "Your words can inspire someone today.",
  ];
  // Pick a random quote
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        background:
          "linear-gradient(135deg, #232526 0%, #414345 40%, #232526 100%)",
        padding: "0 5vw",
      }}
    >
      {showOtpInput && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#232526",
              padding: "2rem",
              borderRadius: "10px",
              boxShadow: "0 2px 12px #0008",
              minWidth: "320px",
            }}
          >
            <h3 style={{ color: "#43e97b", marginBottom: "1rem" }}>
              Enter OTP
            </h3>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setOtpError("");
              }}
              style={{
                width: "100%",
                padding: "0.7rem",
                borderRadius: "6px",
                border: "1.2px solid #43e97b",
                background: "#2c2f34",
                color: "#fff",
                fontSize: "1.1rem",
                marginBottom: "1rem",
              }}
              maxLength={6}
              autoFocus
            />
            <button
              type="button"
              onClick={handleOtpSubmit}
              style={{
                width: "100%",
                padding: "0.7rem",
                background: "linear-gradient(90deg, #43e97b 0%, #f7971e 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Submit OTP
            </button>
            {otpError && (
              <div style={{ color: "#e57373", marginTop: "0.5rem" }}>
                {otpError}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Signup form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#232526",
          padding: "1.5rem 1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.33)",
          minWidth: "260px",
          width: "100%",
          maxWidth: "320px",
          marginLeft: "4vw",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <span style={{ color: "#43e97b", marginRight: "0.5rem" }}>
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
            </svg>
          </span>
          <h2
            style={{
              textAlign: "center",
              color: "#43e97b",
              letterSpacing: 1,
              fontSize: "1.35rem",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Create New Account
          </h2>
        </div>
        {error && (
          <div
            style={{
              color: "#e57373",
              marginBottom: "0.75rem",
              textAlign: "center",
              fontSize: "0.95rem",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              color: "#43e97b",
              marginBottom: "0.75rem",
              textAlign: "center",
              fontSize: "0.95rem",
            }}
          >
            {success}
          </div>
        )}
        <div style={{ marginBottom: "0.75rem", position: "relative" }}>
          <label
            style={{
              display: "block",
              marginBottom: ".35rem",
              fontWeight: 500,
              color: "#f7971e",
              fontSize: "0.98rem",
            }}
          >
            Name
          </label>
          <span
            style={{
              position: "absolute",
              left: "10px",
              top: "38px",
              color: "#43e97b",
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
            </svg>
          </span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: ".6rem .6rem .6rem 2.2rem",
              borderRadius: "6px",
              border: "1.2px solid #43e97b",
              outline: "none",
              background: "#2c2f34",
              color: "#fff",
              fontSize: "1rem",
            }}
            placeholder="Your Name"
            autoComplete="name"
          />
        </div>
        <div style={{ marginBottom: "0.75rem", position: "relative" }}>
          <label
            style={{
              display: "block",
              marginBottom: ".35rem",
              fontWeight: 500,
              color: "#f7971e",
              fontSize: "0.98rem",
            }}
          >
            Email
          </label>
          <span
            style={{
              position: "absolute",
              left: "10px",
              top: "38px",
              color: "#43e97b",
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16v16H4V4zm0 0l8 8 8-8"></path>
            </svg>
          </span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: ".6rem .6rem .6rem 2.2rem",
              borderRadius: "6px",
              border: "1.2px solid #43e97b",
              outline: "none",
              background: "#2c2f34",
              color: "#fff",
              fontSize: "1rem",
            }}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div style={{ marginBottom: "0.75rem", position: "relative" }}>
          <label
            style={{
              display: "block",
              marginBottom: ".35rem",
              fontWeight: 500,
              color: "#f7971e",
              fontSize: "0.98rem",
            }}
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: ".6rem 2.2rem .6rem 0.8rem",
              borderRadius: "6px",
              border: "1.2px solid #43e97b",
              outline: "none",
              background: "#2c2f34",
              color: "#fff",
              fontSize: "1rem",
              paddingRight: "2.2rem",
            }}
            placeholder="Password"
            autoComplete="new-password"
          />
          <span
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: "absolute",
              right: "10px",
              top: "2.5rem",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: "#43e97b",
            }}
            tabIndex={0}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        <div style={{ marginBottom: "1.1rem", position: "relative" }}>
          <label
            style={{
              display: "block",
              marginBottom: ".35rem",
              fontWeight: 500,
              color: "#f7971e",
              fontSize: "0.98rem",
            }}
          >
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: ".6rem 2.2rem .6rem 0.8rem",
              borderRadius: "6px",
              border: "1.2px solid #43e97b",
              outline: "none",
              background: "#2c2f34",
              color: "#fff",
              fontSize: "1rem",
              paddingRight: "2.2rem",
            }}
            placeholder="Confirm Password"
            autoComplete="new-password"
          />
          <span
            onClick={() => setShowConfirmPassword((v) => !v)}
            style={{
              position: "absolute",
              right: "10px",
              top: "2.5rem",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: "#43e97b",
            }}
            tabIndex={0}
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: ".65rem",
            background: "linear-gradient(90deg, #43e97b 0%, #f7971e 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s",
            boxShadow: "0 2px 8px rgba(67,233,123,0.18)",
            marginBottom: "0.6rem",
          }}
        >
          Sign Up
        </button>
        <div
          style={{ textAlign: "center", fontSize: "0.97rem", color: "#bbb" }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#43e97b",
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            Sign In
          </a>
        </div>
      </form>
      {/* Vertical divider */}
      <div
        style={{
          width: "3px",
          background: "linear-gradient(180deg, #43e97b 0%, #f7971e 100%)",
          height: "80vh",
          alignSelf: "center",
          margin: "0 20vw",
          borderRadius: "2px",
          boxShadow: "0 0 8px #43e97b44",
        }}
      />
      {/* Quote area moved to the left */}

      <style>
        {`
          @keyframes quoteJump {
            0% { transform: translateY(0);}
            10% { transform: translateY(-10px);}
            20% { transform: translateY(-18px);}
            30% { transform: translateY(-10px);}
            40% { transform: translateY(0);}
            100% { transform: translateY(0);}
          }
        `}
      </style>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingRight: "2vw",
          maxWidth: "auto",
          animation: "quoteJump 1s ease-in-out infinite",
        }}
      >
        <div
          style={{
            background: "rgba(44,47,52,0.85)",
            borderRadius: "12px",
            padding: "2.2rem 2.2rem 2.2rem 2.2rem",
            boxShadow: "0 2px 12px rgba(67,233,123,0.08)",
            borderRight: "4px solid #43e97b",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            {/* Quote icon */}
            <span style={{ color: "#f7971e", marginRight: "0.7rem" }}>
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M7 17c-1.657 0-3-1.343-3-3V7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H7v2c0 .552.448 1 1 1h2v2H7zm10 0c-1.657 0-3-1.343-3-3V7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-2v2c0 .552.448 1 1 1h2v2h-2z" />
              </svg>
            </span>
            <h2
              style={{
                color: "#f7971e",
                fontWeight: 700,
                fontSize: "1.3rem",
                margin: 0,
                letterSpacing: 1,
              }}
            >
              Motivation to Connect
            </h2>
          </div>
          <p
            style={{
              color: "#fff",
              fontSize: "1.1rem",
              fontStyle: "italic",
              marginBottom: 0,
            }}
          >
            "{quote}"
          </p>
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "2.5vh",
          right: "2vw",
          display: "flex",
          flexDirection: "column",
          gap: "1.1rem",
          alignItems: "flex-end",
          zIndex: 10,
        }}
      >
        {/* About Us */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(44,47,52,0.92)",
            borderRadius: "8px",
            padding: "0.7rem 1.2rem",
            boxShadow: "0 2px 8px rgba(67,233,123,0.10)",
            borderRight: "3px solid #43e97b",
            minWidth: "180px",
            transform: "translateX(0)",
            animation:
              "slideInRight 0.7s cubic-bezier(.68,-0.55,.27,1.55) forwards, vibrate 0.4s 0.7s 1",
            cursor: "pointer",
          }}
          tabIndex={0}
          onMouseEnter={(e) => {
            e.currentTarget.style.animation = "jump 0.4s";
            setTimeout(() => {
              e.currentTarget.style.animation = "none";
            }, 400);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animation = "none";
          }}
          onClick={(e) => {
            e.currentTarget.style.animation = "jump 0.4s";
            setTimeout(() => {
              e.currentTarget.style.animation = "none";
            }, 400);
          }}
        >
          <span style={{ color: "#43e97b", marginRight: "0.7rem" }}>
            {/* Info icon */}
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </span>
          <div>
            <div
              style={{ color: "#f7971e", fontWeight: 600, fontSize: "1.05rem" }}
            >
              About Us
            </div>
            <div style={{ color: "#fff", fontSize: "0.97rem" }}>
              WeeChat is a modern chat platform to connect, share, and grow
              together.
            </div>
          </div>
        </div>
        <style>
          {`
            @keyframes slideInRight {
          0% { transform: translateX(120%); opacity: 0; }
          60% { transform: translateX(-10%); opacity: 1; }
          80% { transform: translateX(5%); }
          100% { transform: translateX(0); }
            }
            @keyframes vibrate {
          0% { transform: translateX(0); }
          20% { transform: translateX(-3px); }
          40% { transform: translateX(3px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
          100% { transform: translateX(0); }
            }
            @keyframes jump {
          0% { transform: translateY(0);}
          30% { transform: translateY(-10px);}
          50% { transform: translateY(-18px);}
          70% { transform: translateY(-10px);}
          100% { transform: translateY(0);}
            }
          `}
        </style>
        {/* Contact Us */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(44,47,52,0.92)",
            borderRadius: "8px",
            padding: "0.7rem 1.2rem",
            boxShadow: "0 2px 8px rgba(247,151,30,0.10)",
            borderRight: "3px solid #f7971e",
            minWidth: "180px",
            transform: "translateX(0)",
            animation:
              "slideInRight 0.7s cubic-bezier(.68,-0.55,.27,1.55) forwards, vibrate 0.4s 0.7s 1",
            cursor: "pointer",
          }}
          tabIndex={0}
          onMouseEnter={(e) => {
            e.currentTarget.style.animation = "jump 0.4s";
            setTimeout(() => {
              e.currentTarget.style.animation = "none";
            }, 400);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animation = "none";
          }}
          onClick={(e) => {
            e.currentTarget.style.animation = "jump 0.4s";
            setTimeout(() => {
              e.currentTarget.style.animation = "none";
            }, 400);
          }}
        >
          <span style={{ color: "#f7971e", marginRight: "0.7rem" }}>
            {/* Mail icon */}
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <polyline points="3 7 12 13 21 7" />
            </svg>
          </span>
          <div>
            <div
              style={{ color: "#43e97b", fontWeight: 600, fontSize: "1.05rem" }}
            >
              Contact Us
            </div>
            <div style={{ color: "#fff", fontSize: "0.97rem" }}>
              Email:{" "}
              <a
                href="mailto:support@weechat.com"
                style={{ color: "#43e97b", textDecoration: "underline" }}
              >
                support@weechat.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
