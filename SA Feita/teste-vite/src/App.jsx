import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate, Link } from 'react-router-dom';
import Painel from './pages/Painel';
import AdminVeiculos from './pages/AdminVeiculos';
import AdminUsuarios from './pages/AdminUsuarios';
import Login from './pages/Login';
import Register from './pages/register';
import './App.css'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

 useEffect(() => {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([
        { id: 1, nome_usuario: "Admin", tipo_usuario: "admin", telefone: "000000000", username: "admin", password: "admin123" }
      ]));
    }
    if (!localStorage.getItem('veiculos')) {
      localStorage.setItem('veiculos', JSON.stringify([]));
    }

    if (token) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => `fake-jwt-token-${u.id}` === token);
      setCurrentUser(user);
    }
  }, [token]);




  
  useEffect(() => {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([
        { id: 1, nome_usuario: "Admin", tipo_usuario: "admin", telefone: "000000000", username: "admin", password: "admin123" }
      ]));
    }
    if (!localStorage.getItem('veiculos')) {
      localStorage.setItem('veiculos', JSON.stringify([]));
    }
  }, []);

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {token && (
        <nav>
          <div className="container">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-indigo-600">Sistema de Estacionamento</h1>
                <div className="hidden md:flex space-x-6">
                  <Link to="/painel" className="hover:text-indigo-600 transition">Painel</Link>
                  <Link to="/admin/veiculos" className="hover:text-indigo-600 transition">Veículos</Link>
                  {currentUser && currentUser.tipo_usuario === 'admin' && (
                    <Link to="/admin/usuarios" className="hover:text-indigo-600 transition">Usuários</Link>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Sair
              </button>
            </div>
          </div>
        </nav>
      )}


      <Routes>
        <Route path="/" element={!token ? <Login setToken={setToken} /> : <Navigate to="/painel" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/painel" />} />
        <Route path="/painel" element={token ? <Painel token={token} setToken={setToken} /> : <Navigate to="/" />} />
        <Route path="/admin/veiculos" element={token ? <AdminVeiculos token={token} /> : <Navigate to="/" />} />
        <Route path="/admin/usuarios" element={token ? <AdminUsuarios token={token} /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}