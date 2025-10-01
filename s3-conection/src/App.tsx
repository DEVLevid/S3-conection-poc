// src/App.tsx
import { useState, useEffect, type ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3000';
interface MinioFile {
  name: string;
  lastModified: string;
  size: number;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<MinioFile[]>([]);
  const [message, setMessage] = useState('');

  const fetchFiles = async () => {
    try {
      const response = await axios.get<MinioFile[]>(`${API_URL}/files`);
      setUploadedFiles(response.data);
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
      setMessage('Falha ao carregar lista de arquivos.');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Por favor, selecione um arquivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setMessage('Enviando...');
      await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Arquivo enviado com sucesso!');
      setSelectedFile(null); 
      fetchFiles(); 
    } catch (error) {
      console.error('Erro no upload:', error);
      setMessage('Falha ao enviar o arquivo.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="card">
          <h2>Fazer Upload de Arquivo</h2>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={!selectedFile}>
            Enviar
          </button>
          {message && <p className="message">{message}</p>}
        </div>

        <div className="card">
          <h2>Arquivos no Bucket</h2>
          {uploadedFiles.length > 0 ? (
            <ul>
              {uploadedFiles.map((file) => (
                <li key={file.name}>
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum arquivo encontrado.</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;