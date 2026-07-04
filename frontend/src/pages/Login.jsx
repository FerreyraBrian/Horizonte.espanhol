import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AlertCircle, BookOpen, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await login(email, password);
      const fallbackRoute = response.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
      navigate(location.state?.from || fallbackRoute, { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Não foi possível entrar na plataforma.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Link to="/" className="login-logo">
          <div className="login-logo-circle">
            <Star className="login-star" />
            <div className="login-stars">
              <Star className="login-star" />
              <Star className="login-star" />
            </div>
            <BookOpen className="login-book-icon" />
          </div>
          <div className="text-center">
            <h1 className="login-title">Horizonte Espanhol</h1>
            <p className="login-subtitle">Idioma & Cultura</p>
          </div>
        </Link>

        <div className="login-form-card">
          <div className="login-form-header">
            <h2 className="login-form-title">Acesse sua Conta</h2>
            <p className="login-form-description">Entre com sua conta aprovada para acessar os cursos pagos.</p>
          </div>
          <div className="login-form-content">
            <form onSubmit={handleLogin} className="login-form">
              <div className="login-form-group">
                <label htmlFor="email" className="login-label">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                />
              </div>
              <div className="login-form-group">
                <div className="login-input-row">
                  <label htmlFor="password" className="login-label">
                    Senha
                  </label>
                  <span className="login-forgot-link">A redefinição virá na próxima etapa</span>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                />
              </div>

              {message && (
                <div className="login-footer" style={{ color: '#166534', paddingTop: 0 }}>
                  {message}
                </div>
              )}

              {error && (
                <div className="login-error">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="login-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            <div className="login-footer">
              <strong>Conexão com o servidor:</strong> <br />
              Use o backend em <code>http://localhost:3001</code> para autenticação real. <br />
              <strong>Conta admin:</strong> admin@horizonteespanhol.com / Admin@12345 <br />
              <strong>Conta aluno:</strong> aluno@horizonteespanhol.com / Aluno@12345 <br />
              <em>As credenciais de demonstração continuam disponíveis enquanto o backend não estiver em execução.</em>
            </div>
            <div className="login-footer">
              Não tem conta?{' '}
              <Link to="/register" className="login-register-link">
                Registre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
