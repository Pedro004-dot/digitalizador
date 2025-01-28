'use client';

import { useState } from 'react';
import axios from 'axios';
//import ProtectedRoute from '../components/ProtectedRoute';

export default function Digitalizar() {
  const [scanners, setScanners] = useState<any[]>([]);
  const [selectedScanner, setSelectedScanner] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    mode: 'manual',
    resolution: 300,
    format: 'jpeg',
    num_pages: 2,
    usuario_id: 'cm615gkow00018obmx3w0bqav', // Ajuste dinamicamente com o usuário logado
    prefeitura_id: 'cm615suu900008ofn5ndryc05', // Ajuste dinamicamente com a prefeitura associada
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchScanners = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.get('http://127.0.0.1:5003/scanners'); // URL do backend
      if (response.data.status === 'success') {
        console.log(response.data)
        setScanners(response.data.scanners);
      } else {
        setError(response.data.message || 'Erro desconhecido');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const extractScannerName = (scannerString: string): string => {
    const match = scannerString.match(/device `(.*?)'/); // Padrão para capturar o nome técnico
    return match ? match[1] : scannerString; // Retorna o nome técnico ou o valor original
  };
  
  const confirmScan = async () => {
    if (!selectedScanner) {
      alert('Selecione um scanner primeiro.');
      return;
    }
  
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const payload = {
      mode: formData.mode,
      scanner_name: extractScannerName(selectedScanner), 
      resolution: Number(formData.resolution),
      format: formData.format,
      num_pages: Number(formData.num_pages),
      usuario_id: formData.usuario_id,
      prefeitura_id: formData.prefeitura_id,
    };
  
    try {
        console.log(payload)
      const response = await axios.post('http://127.0.0.1:5004/scan/start', payload);
      if (response.data.status === 'success') {
        setSuccess('Digitalização iniciada com sucesso!');
      } else {
        setError(response.data.message || 'Erro desconhecido.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao iniciar digitalização. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // <ProtectedRoute>
        <div>
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Digitalizar Documento</h1>

          {/* Botão para buscar scanners */}
          <button
            onClick={fetchScanners}
            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Buscar Scanners
          </button>

          {loading && <p className="mt-4 text-gray-600">Carregando...</p>}
          {error && <p className="mt-4 text-red-600">{error}</p>}
          {success && <p className="mt-4 text-green-600">{success}</p>}

          <ul className="mt-4 space-y-4">
                {scanners.map((scanner, index) => (
                    <li key={index} className="p-4 bg-gray-100 rounded shadow">
                    <p>
                        <strong>Descrição:</strong> {scanner.description}
                    </p>
                    <button
                        onClick={() => setSelectedScanner(scanner.description)} // Enviar o nome técnico
                        className={`mt-2 py-1 px-4 rounded ${
                        selectedScanner === scanner.description
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-300 text-gray-800'
                        }`}
                    >
                        {selectedScanner === scanner.description ? 'Selecionado' : 'Selecionar'}
                    </button>
                    </li>
                ))}
        </ul>

          {selectedScanner && (
            <div className="mt-8 p-4 bg-gray-200 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Configurações de Digitalização</h2>

              {/* Formulário para configurações adicionais */}
              <div className="space-y-4">
                <div>
                  <label className="block font-medium">Modo:</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded"
                  >
                    <option value="manual">Manual</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium">Resolução (dpi):</label>
                  <input
                    type="number"
                    name="resolution"
                    value={formData.resolution}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium">Formato:</label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded"
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium">Número de Páginas:</label>
                  <input
                    type="number"
                    name="num_pages"
                    value={formData.num_pages}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded"
                  />
                </div>
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={confirmScan}
                  className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Confirmar Digitalização
                </button>
              </div>
            </div>
          )}
        </div>
    
  );
}{/* </ProtectedRoute> */}