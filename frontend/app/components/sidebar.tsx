import React, { useState } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { RootState } from "../store/store";
import LogoutButton from "./logout";

const Sidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const pathname = usePathname(); // Captura a URL atual
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar a visibilidade do sidebar

  if (!user || !user.prefeituraId) {
    return null; // Retorna vazio se o usuário ou prefeituraId não existir
  }

  const baseRoute = pathname.includes(user.prefeituraId)
    ? `/${user.prefeituraId}`
    : `/${user.prefeituraId}`;

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
    <>
      {/* Botão para telas pequenas */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} id="whiteForm"
        className="fixed  top-20 left-2 z-50 p-2  sm:mt-0 bg-white rounded-lg shadow-md lg:hidden"

      >
        <img
          src="/icons/menu.svg"
          alt="Menu"
          className="w-6 h-6"
        />
      </button>

      {/* Sidebar */}
      <aside
        className={`w-[262px] h-full bg-white  fixed top-0 left-0 z-[100] !bg-opacity-100 transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="relative h-full p-4">
          {/* Logo */}
          <div className="absolute top-4 left-6 flex items-center space-x-4">
            <img src="/icons/logo.svg" alt="Logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold">ITA</h1>
          </div>

          {/* Navegação */}
          <nav className="mt-[200px] space-y-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`relative flex items-center space-x-4 p-3 rounded-lg transition-all duration-200
                  ${item.isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"}
                `}
              >
                {/* Ícone à esquerda do item ativo */}
                {item.isActive && (
                  <span className="absolute left-[-16px] bg-blue-500 w-2 h-8 rounded-r-lg"></span>
                )}

                {/* Ícone principal */}
                <img src={item.icon} alt={`${item.label} Icon`} className="w-6 h-6" />
                <span className="text-xl">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay para telas pequenas */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;