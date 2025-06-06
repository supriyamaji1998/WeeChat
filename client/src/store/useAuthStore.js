import { create } from "zustand";
import axiosApi from "../lib/axios.js";
import toast from "react-hot-toast";
import { data } from "react-router-dom";
export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isAuthenticated: false,
  isemailVerified: false,
  loading: true,
  isSigningUp: false,
  isLogingIn: false,
  isUpdatingProfile: false,
  checkAuth:async () => {
    try {
      const response = await axiosApi.get("/auth/checkAuth"); 
      set({
        authUser: response.data.user
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
