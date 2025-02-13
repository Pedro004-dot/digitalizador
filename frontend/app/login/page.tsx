'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { setPrefeitura } from '../store/slices/prefeituraSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpa os erros anteriores
  
    try {
      const API_BASE_URL = process.env.PORT || "http://127.0.0.1:3010";
  
      // 🔹 1. Autenticar usuário com email e senha
      const loginResponse = await axios.post(`${API_BASE_URL}/user/login`, { email, senha });
  
      if (!loginResponse.data) throw new Error("Erro na autenticação. Confira os dados do login.");
  
      const { token, user } = loginResponse.data;
  
      if (!token || !user?.email) {
        throw new Error("Falha na autenticação. Tente novamente.");
      }
  
      // 🔹 2. Buscar os dados completos do usuário pelo email
      const encodedEmail = encodeURIComponent(user.email); // 🔹 Evita problemas com '@' na URL
      const userResponse = await axios.get(`${API_BASE_URL}/user/email/${encodedEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const fullUserData = userResponse.data;
  
      if (!fullUserData || !fullUserData.id) {
        throw new Error("Erro ao carregar os dados do usuário.");
      }
  
      // 🔹 3. Armazena o token com segurança
      localStorage.setItem("token", token);
  
      // 🔹 4. Dispara Redux para salvar o usuário autenticado
      dispatch(
        login({
          token,
          user: {
            id: fullUserData.id,
            nome: fullUserData.nome,
            sobrenome: fullUserData.sobrenome,
            email: fullUserData.email,
            cpf: fullUserData.cpf,
            prefeituraId: fullUserData.prefeituraId,
            cidade: fullUserData.prefeitura?.cidade || "Não informado",
          },
        })
      );
  
      // 🔹 5. Salvar Prefeitura no Redux
      if (fullUserData.prefeituraId && fullUserData.prefeitura?.cidade) {
        dispatch(
          setPrefeitura({
            id: fullUserData.prefeituraId,
            cidade: fullUserData.prefeitura.cidade,
          })
        );
      }
  
      // 🔹 6. Redirecionamento após login
      router.push(`/${fullUserData.prefeituraId}/home`);
    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.response?.data?.message || "Erro no login. Confira os dados.");
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Bem-vindo 👋</h2>
        <p className="text-center text-gray-500 mb-6">Faça login para continuar</p>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 text-center rounded-md mb-4 animate-fade-in">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition-all"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 text-center">
          {/* <p className="text-gray-500">
            Ainda não tem conta?{" "}
            <a href="/criarConta" className="text-blue-500 font-semibold hover:underline">
              Criar conta
            </a>
          </p> */}
          <p className="text-gray-500 mt-2">
            Esqueceu sua senha?{" "}
            <a href="/forgot-password" className="text-blue-500 font-semibold hover:underline">
              Recuperar senha
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;