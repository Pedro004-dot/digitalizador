

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:3001/user/login', { cpf, senha });
      const { token, user } = response.data;

      dispatch(login({ token: response.data.token, user: response.data.user }));
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro no login');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-semibold text-center">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="w-full p-2 mt-4 border rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 mt-4 border rounded"
        />
        <button type="submit" className="w-full mt-6 p-2 bg-blue-500 text-white rounded">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;