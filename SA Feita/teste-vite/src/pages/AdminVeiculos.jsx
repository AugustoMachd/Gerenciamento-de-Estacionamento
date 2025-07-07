import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminVeiculos({ token }) {
  const [veiculos, setVeiculos] = useState([]);
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    
    const fetchVeiculos = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/veiculos');
        const data = await response.json();
        setVeiculos(data);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
      }
    };

    fetchVeiculos();
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/veiculos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ placa, modelo, cor }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar veículo');
      }

      const novoVeiculo = await response.json();
      setVeiculos([...veiculos, novoVeiculo]);
      setPlaca('');
      setModelo('');
      setCor('');
    } catch (error) {
      console.error('Erro:', error);
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Administração de Veículos</h1>
      
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Adicionar Veículo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label>Placa</label>
            <input
              type="text"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="form-group">
            <label>Modelo</label>
            <input
              type="text"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="form-group">
            <label>Cor</label>
            <input
              type="text"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="button button-primary"
          >
            Adicionar Veículo
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Lista de Veículos</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Placa</th>
                <th className="p-3 text-left">Modelo</th>
                <th className="p-3 text-left">Cor</th>
                <th className="p-3 text-left">Vaga</th>
              </tr>
            </thead>
            <tbody>
              {veiculos.map((veiculo) => (
                <tr key={veiculo.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{veiculo.placa}</td>
                  <td className="p-3">{veiculo.modelo}</td>
                  <td className="p-3">{veiculo.cor}</td>
                  <td className="p-3">{veiculo.vagaId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}