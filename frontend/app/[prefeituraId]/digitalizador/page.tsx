'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Digitalizar({ params }: { params: { prefeituraId: string } }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const prefeitura = useSelector((state: RootState) => state.prefeitura);
  const router = useRouter();
  const [scanners, setScanners] = useState<any[]>([]);
  const [manualInput, setManualInput] = useState(false);
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [jobId, setJobId] = useState(null);

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
    if (!formData.address || !formData.inputSource || !formData.format) {
      alert('Por favor, preencha todas as informações obrigatórias.');
      return;
    }
  
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    const payload = {
      scanner: {
        address: formData.address,
      },
      input_source: formData.inputSource, 
      resolution: formData.resolution || 300, 
      format: formData.format || "image/jpeg", 
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:5004/scan/start', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.data.status === 'success') {
        setSuccess(`Digitalização iniciada com sucesso.`);
        setIsScanning(true);
        setJobId(response.data.job_id); // Salva o job_id retornado
      } else {
        setError(response.data.message || 'Erro ao iniciar a digitalização.');
      }
    } catch (err: any) {
      console.error('Erro ao iniciar digitalização:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Erro do backend: ${err.response.data.message}`);
      } else {
        setError('Erro ao iniciar digitalização. Verifique a conexão com o backend.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            Digitalizar Documento da prefeitura de {prefeitura.cidade} e usuário {user?.nome}
          </h1>

          <div className="flex gap-4 mb-6">
            <button
              onClick={fetchScanners}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Buscar Scanners
            </button>
            <button
              onClick={() => {
                setManualInput(true);
                setScanners([]);
              }}
              className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Inserir Manualmente
            </button>
          </div>

          {loading && <p className="mt-4 text-gray-600">Processando...</p>}
          {error && <p className="mt-4 text-red-600">{error}</p>}
          {success && <p className="mt-4 text-green-600">{success}</p>}

          {scanners.length > 0 && (
            <ul className="mt-4 space-y-4">
              {scanners.map((scanner, index) => (
                <li key={index} className="p-4 bg-gray-100 rounded shadow">
                  <p>
                    <strong>Nome:</strong> {scanner.name}
                  </p>
                  <p>
                    <strong>Endereço:</strong> {scanner.address}
                  </p>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        address: scanner.address,
                      })
                    }
                    className={`mt-2 py-1 px-4 rounded ${
                      formData.address === scanner.address
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-800'
                    }`}
                  >
                    {formData.address === scanner.address ? 'Selecionado' : 'Selecionar'}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {manualInput && (
            <div className="mt-8 p-4 bg-gray-200 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Inserir Scanner Manualmente</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium">Endereço:</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.address && (
            <div className="mt-8 p-4 bg-gray-200 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Configurações de Digitalização</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium">Fonte de Entrada:</label>
                  <select
                    name="inputSource"
                    value={formData.inputSource}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded"
                  >
                    <option value="ADF">Alimentador Automático (ADF)</option>
                    <option value="Platen">Vidro</option>
                  </select>
                </div>
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={startScan}
                  disabled={isScanning}
                  className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Iniciar Digitalização
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}