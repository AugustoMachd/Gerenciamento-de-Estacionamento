import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.username === username)) {
      setError("Nome de usuário já existe");
      return;
    }

    const newUser = {
      id: users.length + 1,
      nome_usuario: nome,
      tipo_usuario: tipo,
      telefone,
      username,
      password
    };

    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    navigate("/");
  };

  return (
    <div className="auth-container">
      <h1 className="text-2xl font-bold mb-6">Criar Conta</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Nome Completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Tipo de Usuário</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuário</option>
              <option value="prof">Professor</option>
                <option value="funcionario">Funcionário</option>
          </select>
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Nome de Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Cadastrar
        </button>
      </form>
      <p className="auth-link">
        Já tem uma conta? <Link to="/" className="text-indigo-600 hover:underline">Faça login</Link>
      </p>
    </div>
  );
}