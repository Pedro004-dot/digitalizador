'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import LogoutButton from "./logout";

const HeaderHome = () => {
  const pathname = usePathname();
  const prefeitura = useSelector((state: RootState) => state.prefeitura);
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false); 
  const [activeTab, setActiveTab] = useState("info"); 
  const [notificationsOpen, setNotificationsOpen] = useState(false); 

  if (!user || !user.prefeituraId) {
    return null;
  }

  const baseRoute = `/${user.prefeituraId}`;

  return (
    <>
      {/* Header */}
      <div id="header" className="bg-white shadow-md bg-opacity-95 py-2 sm:py-4 px-4 sm:px-8 flex justify-between items-center fixed top-0 lg:left-[262px] left-0 lg:w-[calc(100%-262px)] w-full text-sm sm:text-base">

{/* Título e saudação */}
<div>
  <h1 className="text-lg sm:text-2xl font-bold text-[#0061FF] ml-0 sm:ml-5">
    Prefeitura {prefeitura.cidade}
  </h1>
  <p className="text-sm sm:text-lg text-gray-500 ml-0 sm:ml-5">
    Bem-vindo, {user?.nome} 👋
  </p>
</div>

{/* Barra de busca e botões */}
<div className="flex items-center space-x-4 sm:space-x-6">
  {/* Barra de pesquisa */}
  <button
    onClick={() => router.push(`${baseRoute}/pesquisa`)}
    className="border border-gray-300 rounded-lg p-2 sm:p-3 w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center hover:bg-gray-100 transition"
  >
    <img src="/icons/lupaCinza.svg" alt="Ícone de busca" className="w-5 sm:w-6 h-5 sm:h-6 text-gray-400" />
  </button>

  {/* Ícone de notificação */}
  {/* <button
    className="relative"
    onClick={() => setNotificationsOpen(!notificationsOpen)}
  >
    <img src="/icons/bell.png" alt="Notificações" className="w-5 sm:w-6 h-5 sm:h-6" />
    <span className="absolute -top-2 -right-2 bg-red-500 text-white font-bold text-[10px] sm:text-xs rounded-full flex items-center justify-center w-4 sm:w-5 h-4 sm:h-5">
      2
    </span>
  </button> */}

  {/* Aba de notificações */}
  {notificationsOpen && (
    <div id="whiteForm" className="absolute right-0 top-14 mt-10 sm:mt-0 border border-gray-300 shadow-lg rounded-lg w-64 sm:w-72 p-3 sm:p-4 z-50 text-xs sm:text-sm">
      <h3 className="font-semibold text-base sm:text-lg mb-2">Notificações</h3>
      <ul className="space-y-1 sm:space-y-2">
        <li className="text-gray-700">Nova mensagem recebida.</li>
        <li className="text-gray-700">Alerta de sistema.</li>
        <li className="text-gray-700">Novo comentário no seu post.</li>
      </ul>
    </div>
  )}

  {/* Foto do usuário (abre o side menu) */}
  <div
    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border border-gray-300 cursor-pointer flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-xs sm:text-lg"
    onClick={() => setIsOpen(true)}
  >
    {user?.avatar ? (
      <img src={user.avatar} alt="Foto do usuário" className="w-full h-full object-cover rounded-full" />
    ) : (
      <span>{user?.nome?.charAt(0).toUpperCase()}</span>
    )}
  </div>
</div>
</div>


      {/* Overlay escuro quando o menu está aberto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-100 shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Botão de fechar */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        <div className="p-6">
          {/* Foto e nome do usuário */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Foto do usuário"
                  className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-gray-300 bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-3xl">
                  {user?.nome?.charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className="text-xl font-bold mt-4">{user?.nome}</h2>
            </div>
          </div>

          {/* Abas */}
          <div className="mt-6 flex space-x-4">
            <button id='textWhite'
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === "info"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("info")}
            >
              Info
            </button>
            <button  id='textWhite'
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === "login"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
          </div>

          {/* Conteúdo das abas */}
          <div className="mt-6">
            {activeTab === "info" ? (
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-3">
                  <img src="/icons/mail.svg" alt="Email" className="w-6 h-6" />
                  <span className="text-gray-800">{user?.email || "Não informado"}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <img src="/icons/phone-call.svg" alt="Telefone" className="w-6 h-6" />
                  <span className="text-gray-800">{user?.telefone || "Não informado"}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <img src="/icons/cellphone-call.svg" alt="Telefone" className="w-6 h-6" />
                  <span className="text-gray-800">{user?.telefone || "Não informado"}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <img src="/icons/homeCinza.svg" alt="Cidade" className="w-6 h-6" />
                  <span className="text-gray-800">{prefeitura?.cidade || "Não informado"}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Alterar informações de login</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Senha</label>
                    <input
                      type="password"
                      placeholder="Nova senha"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cidade</label>
                    <input
                      type="text"
                      defaultValue={user?.cidade}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit" id="textWhite"
                    className="w-full mt-4 py-2 bg-blue-500  font-bold rounded-lg hover:bg-blue-600 transition-transform hover:scale-95"
                  >
                    Salvar alterações
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Botão de logout */}
          <button className="w-full mt-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-transform hover:scale-95">
            <LogoutButton />
          </button>
        </div>
      </div>
    </>
  );
};

export default HeaderHome;
