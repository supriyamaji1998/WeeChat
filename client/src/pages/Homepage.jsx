import React from "react";
import { useAuthStore } from "../store/useAuthStore";

function Homepage(props) {
  const { authUser, logout } = useAuthStore();
  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome, {authUser ? authUser.name : "Guest"}!
      </h1>
      <button onClick={logout} className="btn btn-primary mt-4">
        Logout
      </button>
    </div>
  );
}

export default Homepage;
