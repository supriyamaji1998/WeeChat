import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import bcrypt from "bcryptjs";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showOtpInput, setShowOtpInput] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState("");
  const [pendingUser, setPendingUser] = React.useState("");
  const [error, setError] = React.useState("");
  const [tempOTP, setTempOTP] = React.useState("");
  const { forgetPassword, reSetNewPass, login, checkAuth } = useAuthStore();
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const navigate = useNavigate();

  const inputStyle = {
    width: "100%",
    padding: "0.7rem",
    borderRadius: "6px",
    border: "1.2px solid #43e97b",
    background: "#2c2f34",
    color: "#fff",
    fontSize: "1.1rem",
    marginBottom: "1rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.7rem",
    background: "linear-gradient(90deg, #43e97b 0%, #f7971e 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
  };

  // On mount, check if email is remembered
  React.useEffect(() => {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      setEmail(remembered);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    if (remember) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
    const loginData = await login({ email, password });
    console.log("Login data:", loginData);

    if (loginData) {
      console.log("Login successful:", loginData);
    }
    setEmail("");
    setPassword("");
    setRemember(false);
  };

  const verifyOtp = async () => {
    console.log("Verifying OTP:", otp);
    console.log("Temporary OTP:", tempOTP.otp);
    const isValidOtp = await bcrypt.compare(otp, tempOTP.otp);
    console.log("Is OTP valid?", isValidOtp);
    setOtp("");
    return isValidOtp;
  };

  const finalCheck = async () => {
    try {
      console.log("Final Check - OTP:", otp);
      if (otp) {
        const isValidOtp = await verifyOtp();
        console.log("Is OTP valid?", isValidOtp);

        if (!isValidOtp) {
          setError("OTP verification failed. Please enter the correct OTP.");
          return;
        }

        if (isValidOtp && newPassword && confirmPassword) {
          if (newPassword !== confirmPassword) {
            setError("Passwords do not match. Please try again.");
            return;
          }

          if (newPassword === confirmPassword) {
            console.log("Resetting password for user:", tempOTP.email);
            const resetResponse = await reSetNewPass({
              email: tempOTP.email,
              newPassword: newPassword,
            });
          }
          // Call the API to reset the password
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

  // Handle "Forgot password?" click
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email to reset password.");
      return;
    }
    const tempOTP = await forgetPassword({ email });
    console.log("Otp sent successfully:", tempOTP);
    setTempOTP(tempOTP);
    setShowOtpInput(true);
    // alert(`Password reset link sent to ${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
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
          <button
            onClick={() => {
              setShowOtpInput(false);
              setOtp("");
              setNewPassword("");
              setConfirmPassword("");
              setOtpError("");
              setError("");
            }}
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "1.5rem",
              cursor: "pointer",
              zIndex: 1100,
            }}
            aria-label="Close OTP Modal"
          >
            &times;
          </button>
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOtpSubmit();
              }}
            >
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError("");
                }}
                style={inputStyle}
                maxLength={6}
                autoFocus
                placeholder="Enter OTP"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
                placeholder="New Password"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                placeholder="Confirm Password"
              />
              <button type="submit" style={buttonStyle}>
                Submit OTP
              </button>
            </form>
            {otpError && (
              <div style={{ color: "#e57373", marginTop: "0.5rem" }}>
                {otpError}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl rounded-lg shadow-lg flex overflow-hidden">
        {/* Left panel */}
        <div className="w-1/2 bg-gradient-to-br from-purple-600 to-pink-400 p-10 text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to website</h1>
          <p className="text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat.
          </p>
        </div>

        {/* Right panel */}
        <div
          className="w-1/2 p-10"
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
          <h2
            className="text-2xl font-semibold text-center mb-6"
            style={{ color: "#43e97b" }}
          >
            USER LOGIN
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
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
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
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
            />
            <div className="flex justify-between items-center text-sm">
              <label
                className="inline-flex items-center"
                style={{
                  color: "#43e97b",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="mr-2"
                />
                Remember
              </label>
              <a
                href="#"
                className="text-purple-500 hover:underline"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </a>
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded shadow hover:from-purple-600 hover:to-pink-600"
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
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
