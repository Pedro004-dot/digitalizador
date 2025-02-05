'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import axios from 'axios';
import Header from '@/app/components/header';
const API_URL = process.env.PORT || "http://localhost:3010";
const DigitalizarPage = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const router = useRouter();

  // Controle de passos: 1 = selecionar arquivo; 2 = pré-visualizar/confirmar upload
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validação: permite somente arquivos PDF (pode ser ajustado conforme necessidade)
      if (file.type !== 'application/pdf') {
        alert('Por favor, selecione um arquivo PDF.');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Nenhum arquivo selecionado.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    // Opcional: enviar parâmetros para organizar o arquivo no S3
    formData.append('folder', 'Licitacoes');
    formData.append('year', new Date().getFullYear().toString());
    formData.append('filename', selectedFile.name);

    try {
      const response = await axios.post(`${API_URL}/aws/files/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        // Permite o envio de arquivos grandes
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });

      setSuccess('Upload concluído com sucesso.');
      setError(null);
    } catch (err: any) {
      console.error('Erro no upload:', err);
      setError(err.response?.data?.error || 'Erro ao fazer upload.');
      setSuccess(null);
    }
  };



  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-[592px] p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-bold text-blue-600 mb-6 text-center">
              Upload de Documento
            </h1>
            {currentStep === 1 && (
             <div>
             {/* Input de arquivo oculto */}
             <input
               type="file"
               accept="application/pdf"
               ref={fileInputRef}
               style={{ display: 'none' }}
               onChange={handleFileSelect}
             />
       
             {/* Ícone SVG que dispara o input ao ser clicado */}
             <div onClick={handleIconClick} style={{ cursor: 'pointer', display: 'inline-block' }}>
               <svg width="48" height="48" viewBox="0 0 24 24">
                 <path fill="#000" d="M5 20h14v-2H5v2zm7-18l-5 5h3v6h4v-6h3l-5-5z" />
               </svg>
               <p>Clique aqui para selecionar um arquivo</p>
             </div>
       
             {/* Pré-visualização do PDF */}
             {previewUrl && (
               <div>
                 <h3>Pré-visualização do PDF:</h3>
                 <iframe src={previewUrl} title="Preview" width="100%" height="400px"></iframe>
               </div>
             )}
       
             {/* Botão para realizar o upload */}
             {selectedFile && (
               <button onClick={handleUpload}>
                 Enviar arquivo
               </button>
             )}
       
             {/* Exibição do progresso e mensagens */}
             {uploadProgress > 0 && <p>Progresso: {uploadProgress}%</p>}
             {error && <p style={{ color: 'red' }}>{error}</p>}
             {success && <p style={{ color: 'green' }}>{success}</p>}
           </div>
            )}
            {currentStep === 2 && (
              <div>
                <p className="mb-4">Pré-visualização do documento:</p>
                {previewUrl && (
                  <iframe
                    src={previewUrl}
                    title="Pré-visualização do PDF"
                    width="100%"
                    height="400px"
                  />
                )}
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                    onClick={() => setCurrentStep(1)}
                  >
                    Voltar
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={handleUpload}
                  >
                    Confirmar Upload
                  </button>
                </div>
              </div>
            )}
            {loading && (
              <p className="mt-4">Enviando... {uploadProgress}%</p>
            )}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {success && <p className="mt-4 text-green-500">{success}</p>}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DigitalizarPage;