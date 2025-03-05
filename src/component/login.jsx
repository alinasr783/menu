import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./login.css";

// مكون التحميل
function CircularIndeterminate() {
  return (
    <Box sx={{ display: "flex", color: "#fff" }}>
      <CircularProgress sx={{ color: "white" }} size={25} />
    </Box>
  );
}

export default function Login() {
  useEffect(() => {
    window.scrollTo(0, 0); 
    fetchGreetings();
  }, []);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [img, setImg] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      // البحث عن المستخدم في قاعدة البيانات
      const { data, error } = await supabase
        .from("menu")
        .select("email, password")
        .eq("email", email)
        .single();

      if (error) throw error;

      if (!data || data.password !== password) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      // ✅ حفظ بيانات المستخدم في localStorage
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);

      navigate("/"); // توجيه المستخدم بعد تسجيل الدخول الناجح
    } catch (err) {
      console.error("Error logging in:", err.message);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGreetings = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("setting").select("*").single();
      if (error) throw error;
      if (data?.login_img) {
        setImg(data.login_img);
      }
    } catch (error) {
      console.error("Error fetching greetings:", error.message);
    }
  }, []);

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="login">
      <div className="login-content">
        <div className="login-content-img">
          <img src="https://i.ibb.co/vDZcMPF/photo-1574182245530-967d9b3831af.jpg" alt="Login" />
        </div>
        <div className="login-content-title">Your Rouver</div>
        <div className="login-content-des">
        We need to verify your identity 
        </div>
        <div className="login-content-inputs">
          <div className="login-content-inputs-input-email">
            <div className="login-content-inputs-input-title">Email</div>
            <input
              className={`${error ? "error" : ""}`}
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <div className="login-content-inputs-input-error">
              {error && error.includes("email") ? error : ""}
            </div>
          </div>
          <div className="login-content-inputs-input-password">
            <div className="login-content-inputs-input-title">Password</div>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="login-content-inputs-input-error">
              {error && error.includes("password") ? error : ""}
            </div>
          </div>
        </div>
        <button className="login-content-button" onClick={handleSubmit}>
          {loading ? <CircularIndeterminate /> : "Login"}
        </button>
      </div>
    </div>
  );
}