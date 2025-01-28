import React from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { RootState } from "../store/store";
import LogoutButton from "./logout"; // Ajuste o caminho conforme necessário


const Sidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const pathname = usePathname(); // Captura a URL atual

  if (!user || !user.prefeituraId) {
    return null; // Retorna vazio se o usuário ou prefeituraId não existir
  }

  // Verifica se o prefeituraId já faz parte da URL atual
  const baseRoute = pathname.includes(user.prefeituraId)
    ? `/${user.prefeituraId}` // Se já estiver na URL, usa como base
    : `/${user.prefeituraId}`; // Caso contrário, adiciona o prefeituraId

  return (
    <aside className="w-64 bg-white shadow-lg h-full">
      <nav className="flex flex-col p-4">
        <h1 className="font-bold text-lg mb-4">Bem-vindo, {user.nome}</h1>
        <Link href={`${baseRoute}/home`}>Home</Link>
        <Link href={`${baseRoute}/documentos`}>Documentos</Link>
        <Link href={`${baseRoute}/digitalizador`}>Digitalizar</Link>
        <Link href={`${baseRoute}/logout`}>Sair</Link>
        <LogoutButton />
      </nav>
    </aside>
  );
};

export default Sidebar;