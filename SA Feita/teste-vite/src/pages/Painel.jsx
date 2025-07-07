import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Painel.css'; 

export default function Painel({ token, setToken }) {
  const [veiculos, setVeiculos] = useState([]);
  const [vagas, setVagas] = useState({ total: 0, disponiveis: 0, ocupadas: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/');
    
    const fetchData = async () => {
      try {
        const [veiculosRes, vagasRes] = await Promise.all([
          fetch('http://localhost:3001/api/veiculos'),
          fetch('http://localhost:3001/api/vagas')
        ]);
        
        const veiculosData = await veiculosRes.json();
        const vagasData = await vagasRes.json();
        
        setVeiculos(veiculosData);
        setVagas({
          total: vagasData.total,
          disponiveis: vagasData.disponiveis,
          ocupadas: vagasData.ocupadas
        });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, token, setToken]);

  

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

   const handleRegistrarSaida = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/veiculos/${id}/saida`, {
        method: 'PATCH'
      });
      
      if (!response.ok) {
        throw new Error('Erro ao registrar saída');
      }

      const updatedVeiculo = await response.json();
      setVeiculos(veiculos.map(v => v.id === id ? updatedVeiculo : v));
      setVagas(prev => ({
        ...prev,
        disponiveis: prev.disponiveis + 1,
        ocupadas: prev.ocupadas - 1
      }));
    } catch (error) {
      console.error('Erro:', error);
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Painel de Controle</h1>
      
      
      <div className="dashboard-grid mb-8">
        <div className="dashboard-card bg-blue-500">
          <h3>Vagas Totais</h3>
          <p>{vagas.total}</p>
        </div>
        <div className="dashboard-card bg-green-500">
          <h3>Vagas Disponíveis</h3>
          <p>{vagas.disponiveis}</p>
        </div>
        <div className="dashboard-card bg-red-500">
          <h3>Vagas Ocupadas</h3>
          <p>{vagas.ocupadas}</p>
        </div>
        <div className="dashboard-card bg-purple-500">
          <h3>Veículos Estacionados</h3>
          <p>{veiculos.length}</p>
        </div>
      </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div className="card">
    <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
    <div className="quick-actions">
      <Link
        to="/admin/veiculos"
        className="button button-primary"
      >
        Gerenciar Veículos
      </Link>
      <Link
        to="/admin/usuarios"
        className="button button-primary"
      >
        Gerenciar Usuários
      </Link>
    </div>
  </div>


        <div className="card">
        <h2 className="text-xl font-semibold mb-4">Veículos Estacionados</h2>
        <div className="veiculos-container">
          {veiculos.filter(v => !v.saida).map((v) => (
            <div key={v.id} className="veiculo-card">
              <div className="veiculo-info">
                <div className="veiculo-placa">{v.placa}</div>
                <div className="veiculo-detalhes">
                  <span>{v.modelo}</span>
                  <span>{v.cor}</span>
                </div>
                <div className="veiculo-vaga">Vaga: {v.vagaId}</div>
                <div className="veiculo-horario">
                  Entrada: {new Date(v.entrada).toLocaleTimeString()}
                </div>
              </div>
              <button 
                onClick={() => handleRegistrarSaida(v.id)}
                className="btn-saida"
              >
                Registrar Saída
              </button>
            </div>
          ))}
        </div>
      </div>

    
     <div className="card">
  <div className="card col-span-2"> 
  <h2 className="text-xl font-semibold mb-4">Histórico de Veículos ({veiculos.filter(v => v.saida).length})</h2>
  <div className="historico-container">
    <div className="historico-header">
      <div className="historico-col">Placa</div>
      <div className="historico-col">Modelo</div>
      <div className="historico-col">Entrada</div>
      <div className="historico-col">Saída</div>
      <div className="historico-col">Vaga</div>
    </div>
    <div className="historico-body">
      {veiculos.filter(v => v.saida).map((v) => (
        <div className="historico-row" key={v.id}>
          <div className="historico-col">{v.placa}</div>
          <div className="historico-col">{v.modelo}</div>
          <div className="historico-col">
            {new Date(v.entrada).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          <div className="historico-col">
            {new Date(v.saida).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          <div className="historico-col">{v.vagaId || '-'}</div>
        </div>
      ))}
    </div>
  </div>
</div>
  </div>
</div>
</div>
  )
}