import { create } from "zustand";
import axiosApi from "../lib/axios.js";
import toast from "react-hot-toast";
export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isAuthenticated: false,
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
  signUp:async (data)=>{
    set({ isSigningUp: true });
    const res= await axiosApi.post("/auth/signup", data)
      .then((response) => {
        set({ authUser: response.data.user, isSigningUp: false });
        toast.success("Sign up successful! Please log in.");
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
