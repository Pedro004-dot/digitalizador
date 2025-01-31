import React from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { RootState } from "../store/store";
import LogoutButton from "./logout";

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

  // Configuração dos links da Sidebar
  const navItems = [
    {
      label: "Home",
      href: `${baseRoute}/home`,
      icon: pathname === `${baseRoute}/home` ? "/icons/homeAzul.svg" : "/icons/homeCinza.svg",
      isActive: pathname === `${baseRoute}/home`,
    },
    {
      label: "Documentos",
      href: `${baseRoute}/documentos`,
      icon: pathname === `${baseRoute}/documentos` ? "/icons/documentoSoloAzul.svg" : "/icons/documentsCinza.svg",
      isActive: pathname === `${baseRoute}/documentos`,
    },
    {
      label: "Digitalizar",
      href: `${baseRoute}/digitalizador`,
      icon: pathname === `${baseRoute}/digitalizador` ? "/icons/digitalizarAzul.svg" : "/icons/digitalizarCinza.svg",
      isActive: pathname === `${baseRoute}/digitalizador`,
    },
  ];

  return (
    <aside className="w-[262px] h-screen bg-white shadow-lg fixed top-0 left-0">
      <div className="relative h-full p-4">
        {/* Logo */}
        <div className="absolute top-4 left-6 flex items-center space-x-4">
          <img src="/icons/logo.svg" alt="Logo" className="w-10 h-10" /> {/* Ajuste o tamanho da logo aqui */}
          <h1 className="text-xl font-bold">ITA</h1> {/* Ajuste o tamanho e o estilo do texto aqui */}
        </div>

        {/* Navegação */}
        <nav className="mt-[200px] space-y-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center space-x-4 ${
                item.isActive ? "text-main-color-2 font-bold" : "text-sub-color"
              }`}
            >
              <img src={item.icon} alt={`${item.label} Icon`} className="w-6 h-6" />
              <span className="text-xl">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-6">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;