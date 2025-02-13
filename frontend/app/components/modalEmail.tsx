import React, { useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai"; // Exemplo de ícone (npm install react-icons)

interface ModalSendEmailProps {
  fileName: string;
  onClose: () => void; // Callback para fechar o modal
}

const API_URL = process.env.PORT || "http://localhost:3010";

const ModalSendEmail: React.FC<ModalSendEmailProps> = ({ fileName, onClose }) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendEmail = async () => {
    if (!email) {
      setMessage("Por favor, insira um e-mail.");
      return;
    }

    setSending(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_URL}/aws/send-email`, {
        email,
        fileName,
      });
      setMessage(response.data.message || "E-mail enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar o e-mail:", error);
      setMessage("Erro ao enviar o e-mail.");
    } finally {
      setSending(false);
    }
  };

  // Exemplos de heurística simples para cor de mensagem:
  const isError = message?.toLowerCase().includes("erro") || message?.toLowerCase().includes("por favor");

  return (
    <div 
    
      className="
        fixed 
        inset-0 
        
        backdrop-blur-sm 
        flex 
        items-center 
        justify-center 
        z-50 
        transition-opacity 
        duration-300
      "
    >
      <div 
      id="whiteForm"
        className="
          bg-white 
          rounded-lg 
          p-6 
          shadow-lg 
          w-full 
          max-w-md 
          mx-4 
          sm:mx-0 
          relative 
          transform 
          transition-all
        "
      >
        {/* Botão de fechar no canto superior */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <AiOutlineClose size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Enviar arquivo por e-mail
        </h2>

        <p className="text-gray-600 mb-4">
          Deseja enviar o arquivo <strong className="text-gray-800">{fileName}</strong> para:
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite o e-mail"
          className="
            w-full 
            p-2 
            border 
            rounded-md 
            mb-4 
            text-gray-800 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500 
            focus:border-transparent
          "
        />

        {message && (
          <p 
            className={`
              text-sm 
              mb-4
              ${isError ? "text-red-500" : "text-green-500"}
            `}
          >
            {message}
          </p>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="
              px-4 
              py-2 
              bg-gray-300 
              text-gray-800 
              rounded-md 
              hover:bg-gray-400 
              transition-colors
            "
            disabled={sending}
          >
            Cancelar
          </button>

          <button
            onClick={handleSendEmail}
            className={`
              px-4 
              py-2 
              text-white 
              rounded-md 
              transition-colors
              ${sending ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"}
            `}
            disabled={sending}
          >
            {sending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSendEmail;