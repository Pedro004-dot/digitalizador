"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation"; // Import correto para a `app directory`
import { logout } from "../store/slices/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout()); 
    console.log("saindo")
    localStorage.removeItem("token"); 
    router.push("/login"); 
  };

  return (
  <button
    onClick={()=>{handleLogout}}
    className="focus:outline-none"
  >
    <p id="textWhite">Sair</p>
  </button>
  );
};

export default LogoutButton;