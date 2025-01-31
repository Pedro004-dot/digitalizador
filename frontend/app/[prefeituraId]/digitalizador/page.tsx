'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import axios from 'axios';
import Header from '@/app/components/header';

const DigitalizarPage = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const prefeitura = useSelector((state: RootState) => state.prefeitura);
  const router = useRouter();
  const [scanners, setScanners] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    resolution: 300,
    format: 'application/pdf',
    address: '',
    inputSource: 'Feeder',
    documentHandling: 'SingleSided',
    colorMode: 'Color',
    pageWidth: 215.9,
    pageHeight: 279.4,
    unit: 'mm',
    folder_level1: '',
    folder_level2: '',
    file_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDigitalizing, setIsDigitalizing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const fetchScanners = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.get('http://127.0.0.1:5003/scanners');
      if (response.data.status === 'success') {
        setScanners(response.data.scanners);
      } else {
        setError(response.data.message || 'Erro desconhecido');
      }
    } catch (err) {
      console.error('Erro ao conectar ao servidor:', err);
      setError('Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startScan = async () => {
    if (
      !formData.address ||
      !formData.inputSource ||
      !formData.folder_level1 ||
      !formData.folder_level2 ||
      !formData.file_name
    ) {
      alert('Por favor, preencha todas as informações obrigatórias.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setIsDigitalizing(true);
    setProgress(0);

    const payload = {
      scanner: {
        address: formData.address,
      },
      input_source: formData.inputSource,
      resolution: formData.resolution || 300,
      format: formData.format || 'image/jpeg',
      file_name: formData.file_name,
      folder_level1: formData.folder_level1,
      folder_level2: formData.folder_level2,
    };

    try {

      const response = await axios.post('http://127.0.0.1:5004/scan/start', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.status === 'success') {
        setSuccess(`Digitalização concluída com sucesso.`);
      } else {
        setError(response.data.message || 'Erro ao iniciar a digitalização.');
      }
    } catch (err:any) {
      console.error('Erro ao iniciar digitalização:', err);
      setError(err.response?.data?.message || 'Erro ao iniciar digitalização.');
    } finally {
      setLoading(false);
      setIsDigitalizing(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block font-bold text-zinc-800">Título</label>
              <input
                type="text"
                name="file_name"
                placeholder="Como prefere catalogar"
                value={formData.file_name}
                onChange={handleInputChange}
                className="w-full border rounded p-3"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-800">Pasta</label>
              <select
                name="folder_level1"
                value={formData.folder_level1}
                onChange={handleInputChange}
                className="w-full border rounded p-3"
              >
                <option value="">Selecione a pasta</option>
                <option value="Licitacoes">Licitações</option>
                <option value="Diversos">Diversos</option>
                <option value="Empenhos">Empenhos</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-zinc-800">Ano</label>
              <input
                type="number"
                name="folder_level2"
                placeholder="Ex: 2023"
                value={formData.folder_level2}
                onChange={handleInputChange}
                className="w-full border rounded p-3"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-4">
            <button
              onClick={fetchScanners}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Buscar Scanners
            </button>
            {scanners.map((scanner, index) => (
              <div
                key={index}
                className={`p-4 bg-gray-100 rounded shadow cursor-pointer ${
                  formData.address === scanner.address ? 'border-2 border-blue-600' : ''
                }`}
                onClick={() => setFormData({ ...formData, address: scanner.address })}
              >
                <p>
                  <strong>Nome:</strong> {scanner.name}
                </p>
                <p>
                  <strong>Endereço:</strong> {scanner.address}
                </p>
              </div>
            ))}
            {formData.address && (
              <p className="text-green-600 font-bold">
                Scanner selecionado: {formData.address}
              </p>
            )}
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <p>Preparado para digitalizar!</p>
            <button
              onClick={startScan}
              className="py-2 px-6 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Digitalizar
            </button>
            {isDigitalizing && (
              <div className="mt-6">
                <p className="text-gray-600">Digitalizando... {progress.toFixed(0)}%</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-[592px] h-[544px] p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-bold text-blue-600 mb-6 text-center">
              Digitalizar Documento
            </h1>
            <div className="flex items-center justify-between mb-6">
              <div className={`text-sm ${currentStep === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                1. Catalogar
              </div>
              <div className={`text-sm ${currentStep === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                2. Encontrar
              </div>
              <div className={`text-sm ${currentStep === 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                3. Digitalizar
              </div>
            </div>
            <div className="flex-1">{renderStepContent()}</div>
            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <button
                  onClick={previousStep}
                  className="py-2 px-4 bg-gray-600 text-white rounded"
                >
                  Voltar
                </button>
              )}
              {currentStep < 3 && (
                <button
                  onClick={nextStep}
                  disabled={!formData.address && currentStep === 2}
                  className={`py-2 px-4 rounded ${
                    currentStep === 2 && !formData.address
                      ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Continuar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DigitalizarPage;