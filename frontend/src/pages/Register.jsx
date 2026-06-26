import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, BookOpen, Star, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '' });

  // Validar formato de email
  const validateEmailFormat = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError('Digite um endereço de e-mail válido.');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Verificar força da senha
  const checkPasswordStrength = (passwordValue) => {
    let score = 0;
    if (passwordValue.length >= 8) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/\d/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;

    let label = '';
    if (score <= 1) label = 'Fraca';
    else if (score <= 2) label = 'Média';
    else if (score === 3) label = 'Boa';
    else label = 'Forte';

    setPasswordStrength({ score, label });
  };

  // Handlers com validação em tempo real
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value) validateEmailFormat(value);
  };

  const handleConfirmEmailChange = (e) => {
    const value = e.target.value;
    setConfirmEmail(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value) checkPasswordStrength(value);
  };

  // Cores e estilos da força da senha
  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 1) return 'text-red-500';
    if (passwordStrength.score <= 2) return 'text-yellow-500';
    if (passwordStrength.score === 3) return 'text-green-500';
    return 'text-green-600';
  };

  const getPasswordStrengthBgColor = () => {
    if (passwordStrength.score <= 1) return 'bg-red-500';
    if (passwordStrength.score <= 2) return 'bg-yellow-500';
    if (passwordStrength.score === 3) return 'bg-green-500';
    return 'bg-green-600';
  };

  const getPasswordStrengthWidth = () => {
    if (passwordStrength.score <= 1) return '25%';
    if (passwordStrength.score <= 2) return '50%';
    if (passwordStrength.score === 3) return '75%';
    return '100%';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar campos obrigatórios
    if (!name || !email || !confirmEmail || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // Validar formato do email
    if (!validateEmailFormat(email)) {
      setError('Digite um endereço de e-mail válido.');
      return;
    }

    // Validar se os emails coincidem
    if (email !== confirmEmail) {
      setError('Os e-mails não coincidem.');
      return;
    }

    // Validar se as senhas coincidem
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    // Validar comprimento mínimo da senha
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    // Validar força da senha (pelo menos nível "Média")
    if (passwordStrength.score < 2) {
      setError('A senha deve conter letra maiúscula e número.');
      return;
    }

    // Validar aceitação dos termos
    if (!acceptTerms) {
      setError('Você precisa aceitar os termos de uso para continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await register({ name, email, password });
      setSuccess(response.message || 'Conta criada com sucesso! Redirecionando para o login...');
      setTimeout(() => navigate('/login', { state: { message: response.message } }), 1500);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Não foi possível criar a conta.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <Link to="/" className="block mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-75"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                  <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Horizonte Espanhol
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Idioma & Cultura</p>
          </div>
        </Link>

        {/* Card Principal */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Header do Card */}
          <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Criar Conta
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Seu cadastro entra como pendente até a aprovação do administrador.
            </p>
          </div>

          {/* Formulário */}
          <div className="p-6">
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Nome Completo */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* E-mail */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-2.5 rounded-2xl border ${emailError ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>

              {/* Confirmar E-mail */}
              <div className="space-y-1.5">
                <label htmlFor="confirmEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirmar E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmEmail"
                  type="email"
                  placeholder="Confirme seu e-mail"
                  required
                  value={confirmEmail}
                  onChange={handleConfirmEmailChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
                {confirmEmail && email !== confirmEmail && (
                  <p className="text-red-500 text-xs mt-1">Os e-mails não coincidem</p>
                )}
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres, com letra maiúscula e número"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Indicador de força da senha */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">Força da senha:</span>
                      <span className={`text-xs font-semibold ${getPasswordStrengthColor()}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthBgColor()}`}
                        style={{ width: getPasswordStrengthWidth() }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Use 8+ caracteres com letra maiúscula, número e símbolo.
                    </p>
                  </div>
                )}
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirmar Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Digite a senha novamente"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">As senhas não coincidem</p>
                )}
              </div>

              {/* Termos e condições - CORREÇÃO AQUI */}
              <div className="flex items-start gap-2 py-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-slate-300 focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                  Aceito os <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">termos de uso</Link> e a{' '}
                  <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">política de privacidade</Link>
                </label>
              </div>

              {/* Mensagem de sucesso */}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-2xl text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{success}</p>
                </div>
              )}

              {/* Mensagem de erro */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-2xl text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Botão de envio */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Criar Conta'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-4 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
              Já tem conta?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Faça login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;