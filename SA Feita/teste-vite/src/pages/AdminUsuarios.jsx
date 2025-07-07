import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminUsuarios({ token }) {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    
    // Verificar se o usuário atual é admin
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => `fake-jwt-token-${u.id}` === token);
    
    if (!user || user.tipo_usuario !== 'admin') {
      navigate('/painel');
      return;
    }
    
    setCurrentUser(user);
    setUsuarios(users);
  }, [navigate, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const newUser = {
      id: Date.now(),
      nome_usuario: nome,
      tipo_usuario: tipo,
      telefone,
      username: telefone,
      password: senha
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsuarios(updatedUsers);
    setNome('');
    setTipo('');
    setTelefone('');
    setSenha('');
  };

  const handleDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      alert('Você não pode excluir a si mesmo');
      return;
    }
    
    const updatedUsers = usuarios.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsuarios(updatedUsers);
  };

  if (!currentUser || currentUser.tipo_usuario !== 'admin') {
    return null;
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Administração de Usuários</h1>
      
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Adicionar Usuário</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
              className="w-full"
            >
              <option value="">Selecione...</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuário</option>
            </select>
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="button button-primary"
          >
            Adicionar Usuário
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Lista de Usuários</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Telefone</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{usuario.nome_usuario}</td>
                  <td className="p-3">{usuario.tipo_usuario}</td>
                  <td className="p-3">{usuario.telefone}</td>
                  <td className="p-3">
                    {usuario.id !== currentUser.id && (
                      <button
                        onClick={() => handleDeleteUser(usuario.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Excluir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}