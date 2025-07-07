
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());


let vagas = Array(50).fill(null).map((_, i) => ({ 
  id: i + 1, 
  disponivel: true 
}));

let veiculos = [];


app.get('/api/vagas', (req, res) => {
  const vagasDisponiveis = vagas.filter(v => v.disponivel).length;
  res.json({ 
    total: vagas.length,
    disponiveis: vagasDisponiveis,
    ocupadas: vagas.length - vagasDisponiveis,
    vagas 
  });
});


app.get('/api/veiculos', (req, res) => {
  res.json(veiculos);
});

app.post('/api/veiculos', (req, res) => {
  const { placa, modelo, cor } = req.body;
  const vagaDisponivel = vagas.find(v => v.disponivel);
  
  if (!vagaDisponivel) {
    return res.status(400).json({ error: 'Não há vagas disponíveis' });
  }

  const novoVeiculo = { 
    id: Date.now(), 
    placa, 
    modelo, 
    cor, 
    vagaId: vagaDisponivel.id,
    entrada: new Date().toISOString() 
  };

  veiculos.push(novoVeiculo);
  vagaDisponivel.disponivel = false;
  
  res.status(201).json(novoVeiculo);
});

app.delete('/api/veiculos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const veiculoIndex = veiculos.findIndex(v => v.id === id);
  
  if (veiculoIndex === -1) {
    return res.status(404).json({ error: 'Veículo não encontrado' });
  }

  const veiculo = veiculos[veiculoIndex];
  const vaga = vagas.find(v => v.id === veiculo.vagaId);
  
  if (vaga) {
    vaga.disponivel = true;
  }

  veiculos.splice(veiculoIndex, 1);
  res.json({ message: 'Veículo removido com sucesso' });
});

app.patch('/api/veiculos/:id/saida', (req, res) => {
  const id = parseInt(req.params.id);
  const veiculo = veiculos.find(v => v.id === id);
  
  if (!veiculo) {
    return res.status(404).json({ error: 'Veículo não encontrado' });
  }

  veiculo.saida = new Date().toISOString();

  const vaga = vagas.find(v => v.id === veiculo.vagaId);
  if (vaga) {
    vaga.disponivel = true;
  }

  res.json(veiculo);
});



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});