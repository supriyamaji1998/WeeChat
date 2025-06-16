import { create } from "zustand";
import axiosApi from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isCheckingAuth: true,
  isAuthenticated: false,
  isemailVerified: false,
  loading: true,
  isSigningUp: false,
  isLogingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
 socket: null,
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
        get().connectSocket()
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
      get().disconnectSocket();
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
              get().connectSocket()

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
        get().connectSocket()

        return response.data;
      })
      .catch((error) => {
        console.error("Error during sign up:", error);
        set({ isSigningUp: false });
        toast.error("Sign up failed - " + (error.response?.data?.message || "Please try again later."));
      })
    return res;
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    const res = await axiosApi.put("/auth/update-profile", data)
      .then((response) => {
        set({ authUser: response.data, isUpdatingProfile: false });
        toast.success("Profile updated successfully!");
        return response.data;
      })
      .catch((error) => {
        console.error("Error during profile update:", error);
        set({ isUpdatingProfile: false });
        toast.error("Profile update failed - " + (error.response?.data?.message || "Please try again later."));
      });
    return res;
  },

   connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

}));
