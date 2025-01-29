'use client';
import React, { useState } from 'react';
import CardPastas from './cardPastas';

const PastasHome = () => {
  // Dados estáticos como exemplo
  const [folders] = useState([
    {
      id: '1',
      title: 'Documents',
      date: 'Sep 25, 2022, 13:25 PM',
      filesCount: 3985,
      icon: '/icons/documentsAzul.svg',
    },
    {
      id: '2',
      title: 'Music',
      date: 'Sep 26, 2022, 10:30 AM',
      filesCount: 567,
      icon: '/icons/documentsAzul.svg',
    },
    {
      id: '3',
      title: 'Projects',
      date: 'Sep 27, 2022, 11:00 AM',
      filesCount: 1243,
      icon: '/icons/documentsAzul.svg',
    }
  ]);

  return (
    <div className="grid grid-cols-3 gap-8 w-full">
      {folders.map((folder) => (
        <CardPastas
          key={folder.id}
          title={folder.title}
          date={folder.date}
          filesCount={folder.filesCount}
          icon={folder.icon}
        />
      ))}
    </div>
  );
};

export default PastasHome;