'use client';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import axios from 'axios';
import HeaderHome from '@/app/components/headerHome';

const API_URL = process.env.PORT || "http://localhost:3010";
const DigitalizarPage = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [folder, setFolder] = useState('');
  const [year, setYear] = useState('');
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
      if (file.type !== 'application/pdf') {
        alert('Por favor, selecione um arquivo PDF.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !folder || !year) {
      alert('Preencha todos os campos antes de enviar.');
      return;
    }
  
    // Define um prefixo para o nome do arquivo, dependendo da pasta
    let prefix = 'documento';
    if (folder === 'Licitações') {
      prefix = 'licitacao';
    } else if (folder === 'Diversos') {
      prefix = 'diverso';
    } else if (folder === 'Empenhos') {
      prefix = 'empenho';
    }
  
    // Extrai a extensão do arquivo original (se quiser manter .pdf somente, pode fixar '.pdf')
    const originalName = selectedFile.name;
    const hasExtension = originalName.lastIndexOf('.') !== -1;
    const extension = hasExtension ? originalName.slice(originalName.lastIndexOf('.')) : '.pdf';
  
    // Monta o novo nome com prefixo + uuid + extensão
    const newFileName = `${prefix}-${uuidv4()}${extension}`;
  
    const formData = new FormData();
    formData.append('file', selectedFile);    // Arquivo em si
    formData.append('folder', folder);        // Pasta
    formData.append('year', year);            // Ano
    formData.append('filename', newFileName); // <-- Substituímos o selectedFile.name pelo nome gerado
  
    try {
      await axios.post(`${API_URL}/aws/files/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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

  const handleReset = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setError(null);
    setSuccess(null);
    setFolder('');
    setYear('');
    setCurrentStep(1);
  };
  const currentYear = new Date().getFullYear();
  const years = []; 
  for (let y = 2010; y <= currentYear; y++) {
    years.push(y);
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <HeaderHome />
        <div className="p-10 mt-20">
          <h1 className="text-2xl text-[#0061FF] mt-20 lg:mt-5">Digitalizar um novo documento</h1>
        </div>
        <div className="m-5 flex flex-1 items-start justify-center">
          <div id="whiteForm" className="w-[800px] h-[400px] p-8 rounded-lg shadow-md relative">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div id="textWhite" className={`px-3 py-1 rounded-full text-white ${currentStep === 1 ? 'bg-blue-500' : 'bg-green-300'}`}>1</div>
              <span className="font-semibold">Catalogar</span>
              <span>&gt;</span>
              <div id="textWhite" className={`px-3 py-1 rounded-full text-white ${currentStep === 2 ? 'bg-blue-500' : 'bg-gray-300'}`}>2</div>
              <span className="font-semibold">Upload</span>
            </div>
            <div className="m-10 border-t border-gray-300"></div>
            {currentStep === 1 && (
              <div>
              <label className="block mb-2 text-sm font-medium">Pasta</label>
              <select
                className="
                  w-full 
                  p-2 
                  border 
                  rounded 
                  text-gray-900 
                  placeholder-gray-400 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500 
                  focus:border-blue-500
                  bg-white
                  appearance-none
                "
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
              >
                <option value="">Selecione a pasta</option>
                <option value="Licitações">Licitações</option>
                <option value="Diversos">Diversos</option>
                <option value="Empenhos">Empenhos</option>
              </select>
          
              <label className="block mt-4 mb-2 text-sm font-medium">Ano</label>
              <select
                className="
                  w-full 
                  p-2 
                  border 
                  rounded 
                  text-gray-900 
                  placeholder-gray-400 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500 
                  focus:border-blue-500
                  bg-white
                  appearance-none
                "
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">Selecione o ano</option>
                {years.map((ano) => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
          
              <button
                id="textWhite"
                className="absolute font-bold bottom-4 left-8 r-0 py-2 px-4 bg-blue-500 rounded hover:bg-blue-600"
                onClick={() => setCurrentStep(2)}
              >
                CONTINUAR
              </button>
            </div>
            )}
            {currentStep === 2 && (
              <div>
                <button className="text-blue-600 hover:underline mb-4" onClick={() => setCurrentStep(1)}>
                  <img src="/icons/back.svg" alt="Voltar" className="w-5 h-5 inline mr-2 m-5" />
                </button>

                <div className="flex items-center mb-5">
                  <input
                    type="text"
                    className="w-full p-2 border rounded-l-md"
                    value={selectedFile ? selectedFile.name : 'Nenhum arquivo selecionado'}
                    readOnly
                  />
                  <button
                    type="button"
                    className="p-2 bg-gray-200 border-l border-t border-b rounded-r-md"
                    onClick={handleIconClick}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" className="mx-auto">
                      <path fill="#000" d="M12 7l-5 5h3v6h4v-6h3z" />
                    </svg>
                  </button>
                </div>

                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />

                {selectedFile && !uploadProgress && (
                  <button
                    onClick={handleUpload}
                    className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Enviar
                  </button>
                )}

                {uploadProgress > 0 && <p className="mt-2">Progresso: {uploadProgress}%</p>}
                {error && <p className="mt-2 text-red-500">{error}</p>}
                {success && (
                  <div className="mt-2 text-green-500">
                    <p>{success}</p>
                    <button
                      onClick={handleReset} id="textWhite"
                      className="mt-2 py-2 px-4 bg-blue-500  rounded hover:bg-blue-600"
                    >
                      Enviar outro arquivo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DigitalizarPage;
