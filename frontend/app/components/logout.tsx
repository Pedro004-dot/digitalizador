"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation"; // Import correto para a `app directory`
import { logout } from "../store/slices/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout()); 
    localStorage.removeItem("token"); 
    router.push("/login"); 
  };

  return (
    <button
    onClick={() => {
      handleLogout();
    }}
    className="w-full mt-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-transform hover:scale-95"
  >
    <p id="textWhite">Sair</p>
  </button>
  );
};

export default LogoutButton;