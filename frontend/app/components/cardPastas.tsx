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
  className="relative w-full max-w-[440px] h-[200px] bg-white rounded-[20px] shadow-md flex flex-col justify-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] p-6"
  onClick={handleClick}
>
  {/* Ícone e Texto lado a lado */}
  <div className="flex items-center gap-4">
    <img src="/icons/documentsAzul.svg" alt="Documento Icon" className="w-12 h-12" />
    <h3 className="font-semibold text-[#0061FF] text-lg">{title}</h3>
  </div>

  {/* Subtítulo abaixo */}
  {subtitle && (
    <p className="mt-2 text-sm text-[#0061FF] text-left">{subtitle}</p>
  )}

  {/* Informações adicionais */}
  {filesCount !== undefined && (
    <div className="absolute bottom-4 right-4 bg-[#ebf2ff] rounded-[10px] border-2 border-white px-4 py-2">
      <span className="font-semibold text-blue-600 text-[14px]">
        {filesCount.toLocaleString()} arquivos
      </span>
    </div>
  )}
</div>
  );
};

export default CardPastas;