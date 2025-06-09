import { create } from "zustand";
import axiosApi from "../lib/axios.js";
import toast from "react-hot-toast";
export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isAuthenticated: false,
  isemailVerified: false,
  loading: true,
  isSigningUp: false,
  isLogingIn: false,
  isUpdatingProfile: false,
  forgetPassword: async (data) => {
      const response = await axiosApi.post("/auth/forget-password-otp-verfication",data)
       .then((response) => {
        console.log("OTP has been sent to email. ", response.data);
        toast.success("OTP has been sent to email!");
        return response.data;
      })
      .catch((error) => {
        console.error("Error during OTP verification. ", error);
        toast.error("OTP verification failed - " + (error.response?.data?.message || "Please try again later."));
      });
      return response;
  },
  reSetNewPass: async (data) => {
    const response = await axiosApi.put("/auth/reset-password", data)
      .then((response) => {
        console.log("Password reset successful:", response.data);  
         toast.success("Password reset successful:!");
        return response.data;   
      });
    return response;
    },
    
  login: async (data) => {
    set({ isLogingIn: true });     
    const res = await axiosApi.post("/auth/login", data)
      .then((response) => {
        set({ authUser: response.data });         
        toast.success("Login successful!");
         response.data;
      })
      .catch((error) => {   
        console.error("Error during login:", error);
        set({ isLogingIn: false });
        toast.error("Login failed - " + (error.response?.data?.message || "Please try again later."));
      })
      set({ isLoggingIn: false });
    return res;
  },
  logout: async () => { 
    try {
      const response = await axiosApi.post("/auth/logout");
      set({ authUser: null});
      toast.success("Logout successful!");
      return response.data;
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed - " + (error.response?.data?.message || "Please try again later."));
    }
  },

  checkAuth:async () => {
    try {
      const response = await axiosApi.get("/auth/checkAuth"); 
      set({
        authUser: response.data
      });
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ authUser: null});
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  emailVerification: async (data) => {
      const res = await axiosApi.post("/auth/verify-email",data)
      .then((response) => {
        console.log("Email verification successful:", response.data);
        toast.success("Email verified successfully!");
        return response.data;
      })
      .catch((error) => {
        console.error("Error during email verification:", error);
        toast.error("Email verification failed - " + (error.response?.data?.message || "Please try again later."));
      });
      return res;
    },
  signUp:async (data)=>{
    set({ isSigningUp: true });
    const res= await axiosApi.post("/auth/signup", data)
      .then((response) => {
        set({ authUser: response.data.user, isSigningUp: false });
        toast.success("Sign up successful! Please log in.");
        toast("Redirecting you to login page...", { icon: "➡️" });
        return response.data;
      })
      .catch((error) => {
        console.error("Error during sign up:", error);
        set({ isSigningUp: false });
        toast.error("Sign up failed - " + (error.response?.data?.message || "Please try again later."));
      })
    return res;
  }
}));
