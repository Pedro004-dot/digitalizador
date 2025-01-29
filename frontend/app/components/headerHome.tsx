'use client';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HeaderHome = () => {
  const pathname = usePathname();
  const prefeitura = useSelector((state: RootState) => state.prefeitura);
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || !user.prefeituraId) {
    return null;
  }

  const baseRoute = pathname.includes(user.prefeituraId)
    ? `/${user.prefeituraId}`
    : `/${user.prefeituraId}`;

  return (
    <div className="w-full flex justify-between items-center  py-6 px-8 ">
      {/* Título e saudação */}
      <div>
        <h1 className="text-3xl font-bold text-black">Prefeitura {prefeitura.cidade}</h1>
        <p className="text-lg text-gray-500">Bem vindo, {user?.nome} 👋</p>
      </div>

      {/* Barra de busca e botão */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src="/icons/lupaCinza.svg"
            alt="Lupa Icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
          />
          <input
            type="text"
            placeholder="Pesquise algum documento"
            className="border border-gray-300 rounded-lg pl-12 py-3 pr-6 w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Link
          href={`${baseRoute}/digitalizador`}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg text-center"
        >
          + Novo arquivo
        </Link>
      </div>
    </div>
  );
};

export default HeaderHome;