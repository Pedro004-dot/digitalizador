'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

interface CardPastasProps {
  title: string;
  subtitle?: string;
  filesCount?: number;
  path?: string; // Caminho para navegação
}

const CardPastas: React.FC<CardPastasProps> = ({
  title,
  subtitle,
  filesCount,
  path,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (path) {
      router.push(path); // Navega para a URL desejada
    }
  };

  return (
    <div
      className="relative bg-white rounded-[20px] shadow-md flex flex-col justify-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] p-4 
      lg:w-50 lg:h-[120px] md:w-44 md:h-24 sm:w-36 sm:h-28 xs:w-24 xs:h-14"
      style={{
        background: 'rgba(255,255,255,0.8)',
        boxShadow: '0px 2px 30px 0px rgba(0,0,0,0.06)',
      }}
      onClick={handleClick}
    >

      {/* Ícone e Texto lado a lado */}
    <div className="flex items-center gap-3 lg:gap-2 md:gap-1 sm:gap-0.5 xs:gap-0">
      <img
        src="/icons/folder.svg"
        className="w-8 h-8 lg:w-7 lg:h-7 md:w-6 md:h-6 sm:w-5 sm:h-5 xs:w-4 xs:h-4"
      />
      <h3 className="font-semibold text-[#000000] text-lg lg:text-md md:text-md sm:text-md xs:text-[9px]">
        {title}
      </h3>
    </div>


      {/* Informações adicionais */}
      {filesCount !== undefined && (
        <div className="absolute bottom-2 right-2 bg-[#ebf2ff] rounded-[10px] border-2 border-white px-3 py-1 sm:px-2 sm:py-0.5 xs:px-1 xs:py-0">
          <span className="font-semibold text-black-600 text-[14px] sm:text-[12px] xs:text-[10px]">
            {filesCount.toLocaleString()} arquivos
          </span>
        </div>
      )}
    </div>
  );
};

export default CardPastas;
