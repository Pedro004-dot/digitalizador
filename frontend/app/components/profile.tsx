import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store'; // Ajuste para o caminho correto do seu store

interface UserProfileProps {
  params: {
    prefeituraId: string;
    cidade: string;
  };
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const userName = useSelector((state: RootState) => state.auth.user?.nome); 
  const cidade = useSelector((state: RootState) => state.auth.user?.cidade);


  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h1>Perfil do Usuário</h1>
      <p><strong>Nome:</strong> {userName}</p>
      <p><strong>Cidade:</strong> {cidade}</p>
    </div>
  );
};

export default UserProfile;