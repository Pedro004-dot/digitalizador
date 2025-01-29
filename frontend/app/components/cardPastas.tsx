'use client';
import React from 'react';

interface CardPastasProps {
  title: string;
  date: string;
  filesCount: number;
  icon: string; // URL ou caminho do ícone
}

const CardPastas: React.FC<CardPastasProps> = ({ title, date, filesCount, icon }) => {
  return (
    <div className="relative w-full h-[220px] max-w-[440px] mx-auto">
      <div className="absolute w-full h-full bg-white rounded-[20px] shadow-[0px_2px_30px_#0000000f]">
        {/* Título e Data */}
        <div className="absolute top-[38px] left-[20px]">
          <div className="font-medium text-[#0f1728] text-lg leading-[18px]">
            {title}
          </div>
          <p className="mt-2 font-medium text-[#667084] text-sm leading-5">
            {date}
          </p>
        </div>

        {/* Ícone da pasta */}
        <div className="absolute top-[38px] left-[20px]">
          <img src={icon} alt={`${title} Icon`} className="w-12 h-12" />
        </div>

        {/* Seção inferior */}
        <div className="absolute bottom-[20px] right-[20px]">
          <div className="font-medium text-[#667084] text-sm text-center">
            Inside Files
          </div>
          <div className="mt-2 bg-[#ebf2ff] rounded-[10px] border-2 border-white px-6 py-2">
            <span className="font-semibold text-brand-color text-[14px]">
              {filesCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPastas;