import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { logout } from "../store/slices/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login"); // Redireciona para a página de login
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;