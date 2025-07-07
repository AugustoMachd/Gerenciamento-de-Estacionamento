import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const fakeToken = `fake-jwt-token-${user.id}`;
      setToken(fakeToken);
      localStorage.setItem("token", fakeToken);
      navigate("/painel");
    } else {
      setError("Usuário ou senha incorretos");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Usuário</label>
          <input
            type="text"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Entrar
        </button>
      </form>
      <p className="auth-link">
        Não tem uma conta? <Link to="/register" className="text-indigo-600 hover:underline">Cadastre-se</Link>
      </p>
    </div>
  );
}