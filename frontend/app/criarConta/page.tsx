'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setPrefeitura } from '../store/slices/prefeituraSlice';
import { login } from '../store/slices/authSlice';

const CriarConta = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  // Estados para prefeitura
  const [prefeituraIdSelecionada, setPrefeituraIdSelecionada] = useState<string>('');
  const [prefeituras, setPrefeituras] = useState<{ id: string; cidade: string }[]>([]);

  // Estados de erro e sucesso
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verifica se as senhas são iguais
  const senhaValida = senha.length >= 6 && senha === confirmSenha;

  // Buscar prefeituras da API
  const fetchPrefeituras = async () => {
    try {
      const API_BASE_URL = process.env.PORT || 'http://127.0.0.1:3010';
      const response = await axios.get<{ id: string; cidade: string }[]>(`${API_BASE_URL}/prefeitura/allPrefeituras`);
      setPrefeituras(response.data);
    } catch (err) {
      console.error('Erro ao carregar prefeituras:', err);
    }
  };

  useEffect(() => {
    fetchPrefeituras();
  }, []);

  // Criar conta e logar automaticamente
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!senhaValida) {
      setError('As senhas não coincidem ou são muito curtas.');
      return;
    }

    try {
      const API_BASE_URL = process.env.PORT || 'http://127.0.0.1:3010';

      // Criar usuário
      await axios.post(`${API_BASE_URL}/user/create`, {
        nome,
        sobrenome,
        email,
        cpf,
        senha,
        prefeituraId: prefeituraIdSelecionada, // Agora passamos corretamente o ID
      });

      // Fazer login automático
      const response = await axios.post(`${API_BASE_URL}/user/login`, { cpf, senha });

      const { token, user } = response.data;

      // Armazenar token e dados do usuário no Redux
      localStorage.setItem('token', token);
      dispatch(login({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email, 
          sobrenome: user.sobrenome,// ✅ Agora garantimos que o e-mail será salvo no Redux
          cpf: user.cpf,
          prefeituraId: user.prefeituraId,
          cidade: user.cidade
        }
      }));

      // Obter o nome da prefeitura selecionada
      const prefeituraSelecionada = prefeituras.find(p => p.id === prefeituraIdSelecionada);

      // Salvar no Redux a prefeitura associada
      if (user.prefeituraId && prefeituraSelecionada) {
        dispatch(setPrefeitura({
          id: user.prefeituraId,
          cidade: prefeituraSelecionada.cidade, // Agora passamos a cidade corretamente
        }));
      }

      // Redirecionar para a home
      if (user?.prefeituraId) {
        router.push(`/${user.prefeituraId}/home`);
      } else {
        setError("Erro ao identificar a prefeitura do usuário.");
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Criar uma Conta</h2>
        <p className="text-center text-gray-500 mb-6">Preencha os campos abaixo para se registrar</p>

        {error && <p className="bg-red-100 text-red-600 p-2 text-center rounded-md mb-4">{error}</p>}
        {success && <p className="bg-green-100 text-green-600 p-2 text-center rounded-md mb-4">{success}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium">Nome</label>
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium">Sobrenome</label>
              <input
                type="text"
                placeholder="Seu sobrenome"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

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
            <label className="block text-gray-700 font-medium">CPF</label>
            <input
              type="text"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Campo de Seleção da Prefeitura */}
          <div>
            <label className="block text-gray-700 font-medium">Prefeitura</label>
            <select
              value={prefeituraIdSelecionada}
              onChange={(e) => setPrefeituraIdSelecionada(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
            >
              <option value="">Selecione sua prefeitura</option>
              {prefeituras.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.cidade}
                </option>
              ))}
            </select>
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

          <div>
            <label className="block text-gray-700 font-medium">Confirmar Senha</label>
            <input
              type="password"
              placeholder="Digite novamente a senha"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${
                senhaValida ? 'border-green-400 focus:ring-green-400' : 'border-red-400 focus:ring-red-400'
              }`}
            />
            {!senhaValida && senha.length > 0 && (
              <p className="text-red-500 text-sm mt-1">As senhas não coincidem ou são muito curtas.</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full font-semibold p-3 rounded-lg transition-all ${
              senhaValida && prefeituraIdSelecionada ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!senhaValida || !prefeituraIdSelecionada}
          >
            Criar Conta
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-500">
            Já tem uma conta?{" "}
            <a href="/login" className="text-blue-500 font-semibold hover:underline">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CriarConta;