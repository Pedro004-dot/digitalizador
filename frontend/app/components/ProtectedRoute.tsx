"use client";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  // console.log("Token no Redux:", token);
  // console.log("Usuário no Redux:", user);

  useEffect(() => {
    if (!token || !user) {
      router.push("/login");
      return;
    }
    const urlSegments = pathname.split("/");
    const urlPrefeituraId = urlSegments[1]; // '7cd718f9-d73b-4fcf-b8f4-3f460391191d'

    // console.log("URL PrefeituraId:", urlPrefeituraId);
    // console.log("Usuário PrefeituraId:", user.prefeituraId);

    if (urlPrefeituraId && user.prefeituraId !== urlPrefeituraId) {
      router.push("/acessoNegado"); // Redireciona para uma página de acesso negado
      return;
    }
  }, [token, user, pathname, router]);

  return <>{children}</>;
};

export default ProtectedRoute;