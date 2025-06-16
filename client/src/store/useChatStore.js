import { create } from "zustand";   
import toast from "react-hot-toast";
import axiosApi from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
export const useChatStore = create((set, get) => ({
  chatMessages: [],
  users: [],
  selectedUser: null,
  isChatLoading: false,
  isUserLoading: false,
  error: null,

  getUsers: async () => {
    set({ isUserLoading: true});
    try {
      const response = await axiosApi.get("/messages/users");
      set({ users: response.data.data, isUserLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ error: error.message, isUserLoading: false });
      toast.error("Failed to fetch users - " + (error.response?.data?.message || "Please try again later."));
    }
  },
  getChatMessages: async (userId) => {
        set({ isChatLoading: true});
        try {
        const response = await axiosApi.get(`/messages/${userId}`);
        set({ chatMessages: response.data, isChatLoading: false });
        } catch (error) {
        console.error("Error fetching chat messages:", error);
        set({ error: error.message, isChatLoading: false });
        toast.error("Failed to fetch chat messages - " + (error.response?.data?.message || "Please try again later."));
        }
    },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  sendMessages: async (messageData) => {
    const { selectedUser, chatMessages } = get();

    try {
      const response = await axiosApi.post(`/messages/send/${selectedUser._id}`, messageData);
      set((state) => ({
        chatMessages: [...chatMessages, response.data.data],
      }));
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message - " + (error.response?.data?.message || "Please try again later."));
    }
  },



  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      set({
        chatMessages: [...get().chatMessages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },


}));