import React, { useState } from 'react';
import axios from 'axios';

interface ModalSendEmailProps {
  fileName: string;
  onClose: () => void; // Callback para fechar o modal
}

const API_URL = process.env.PORT || 'http://localhost:3010';

const ModalSendEmail: React.FC<ModalSendEmailProps> = ({ fileName, onClose }) => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendEmail = async () => {
    if (!email) {
      setMessage('Por favor, insira um e-mail.');
      return;
    }

    setSending(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_URL}/aws/send-email`, {
        email,
        fileName,
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error('Erro ao enviar o e-mail:', error);
      setMessage('Erro ao enviar o e-mail.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Enviar arquivo por e-mail</h2>
        <p className="text-gray-600 mb-4">Deseja enviar o arquivo <strong>{fileName}</strong> para:</p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite o e-mail"
          className="w-full p-2 border rounded-md mb-4"
        />

        {message && <p className="text-sm text-red-500 mb-4">{message}</p>}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
            disabled={sending}
          >
            Cancelar
          </button>
          <button
            onClick={handleSendEmail}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={sending}
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSendEmail;