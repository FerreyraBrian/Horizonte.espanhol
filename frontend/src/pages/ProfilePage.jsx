import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  BadgeCheck,
  BookOpen,
  Check,
  KeyRound,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/authService';

const getPasswordStrength = (password = '') => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: 'Fraca', level: 1 };
  if (score <= 2) return { label: 'Média', level: 2 };
  if (score === 3) return { label: 'Boa', level: 3 };
  return { label: 'Forte', level: 4 };
};

const ProfilePage = ({ userProgress }) => {
  const { user, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileTouched, setProfileTouched] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
  }, [user]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileError('');
    setProfileMessage('');

    if (!name.trim()) {
      setProfileError('Digite seu nome para continuar.');
      return;
    }

    if (!email.trim()) {
      setProfileError('Digite um e-mail válido para continuar.');
      return;
    }

    setIsSavingProfile(true);

    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      setProfileMessage('Perfil atualizado com sucesso.');
      setProfileTouched(false);
    } catch (error) {
      setProfileError(getApiErrorMessage(error, 'Não foi possível atualizar seu perfil.'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordError('A confirmação da nova senha não confere.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await changePassword({ currentPassword, newPassword });
      setPasswordMessage(response.message || 'Senha atualizada com sucesso.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(getApiErrorMessage(error, 'Não foi possível alterar sua senha.'));
    } finally {
      setIsSavingPassword(false);
    }
  };

  const stats = [
    {
      label: 'Progresso geral',
      value: `${userProgress?.progress ?? 0}%`,
      icon: Sparkles,
    },
    {
      label: 'Lição atual',
      value: `${userProgress?.currentLesson ?? '-'}`,
      icon: BookOpen,
    },
    {
      label: 'Tipo de acesso',
      value: user?.role === 'ADMIN' ? 'Administrador' : 'Aluno',
      icon: ShieldCheck,
    },
  ];

  const passwordStrength = getPasswordStrength(newPassword);
  const profileCompletion = Math.min(
    100,
    (name.trim() ? 35 : 0) + (email.trim() ? 35 : 0) + (userProgress?.progress ? 30 : 0),
  );

  const quickActions = [
    { label: 'Ver materiais de estudo', to: '/resources' },
    { label: 'Acompanhar mural de avisos', to: '/cartelera' },
    { label: 'Falar com a equipe', to: '/contato' },
  ];

  return (
    <div className="profile-page space-y-8">
      <section className="profile-hero rounded-3xl border p-8">
        <div className="profile-hero-grid">
          <div>
            <span className="profile-badge inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold">
              Minha conta
            </span>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{user?.name || 'Perfil do aluno'}</h1>
            <p className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Mail className="h-4 w-4" />
              {user?.email || 'email não disponível'}
            </p>

            <div className="profile-stat-row">
              <span className="profile-stat-pill">
                <BadgeCheck className="h-4 w-4" />
                {profileCompletion}% da conta preenchida
              </span>
              <span className="profile-stat-pill">
                <ShieldCheck className="h-4 w-4" />
                {user?.role === 'ADMIN' ? 'Administrador' : 'Aluno ativo'}
              </span>
            </div>
          </div>

          <aside className="profile-hero-preview">
            <span className="profile-preview-kicker">
              <Sparkles className="h-4 w-4" />
              Conta em dia
            </span>
            <h2>Continue evoluindo no curso</h2>
            <p>Mantenha seus dados atualizados para receber comunicados, avisos e orientações da equipe.</p>
            <div className="profile-completion-track">
              <div className="profile-completion-fill" style={{ width: `${profileCompletion}%` }} />
            </div>
          </aside>
        </div>
      </section>

      <section className="profile-metric-grid grid gap-4 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.label} className="profile-metric-card rounded-2xl border p-5">
              <div className="profile-metric-icon">
                <Icon className="h-5 w-5" />
              </div>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </article>
          );
        })}
      </section>

      <section className="profile-content-grid">
        <form onSubmit={handleProfileSubmit} className="profile-form-panel rounded-3xl border p-6">
          <div className="profile-section-head mb-5">
            <h2>Dados pessoais</h2>
            <p>
              Atualize suas informações principais de acesso diretamente na plataforma.
            </p>
          </div>

          <div className="profile-form-grid">
            <div>
              <label htmlFor="profile-name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Nome
              </label>
              <input
                id="profile-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setProfileTouched(true);
                }}
                className="profile-input"
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                E-mail
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setProfileTouched(true);
                }}
                className="profile-input"
              />
            </div>
          </div>

          <div className="profile-submit-row">
            <p className="profile-helper-text">
              {profileTouched ? 'Você tem alterações não salvas.' : 'Tudo certo: seus dados já estão sincronizados.'}
            </p>
            <button
              type="submit"
              disabled={isSavingProfile}
              className="profile-submit-btn"
            >
              <Save className="h-4 w-4" />
              {isSavingProfile ? 'Salvando...' : 'Atualizar perfil'}
            </button>
          </div>

          {profileMessage ? <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-300">{profileMessage}</p> : null}
          {profileError ? (
            <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-300">
              <AlertCircle className="h-4 w-4" />
              {profileError}
            </div>
          ) : null}
        </form>

        <div className="profile-side-stack">
          <form id="change-password" onSubmit={handlePasswordSubmit} className="profile-security-panel rounded-3xl border p-6">
            <div className="mb-4 inline-flex rounded-xl bg-white/80 p-3 text-amber-700 dark:bg-amber-900 dark:text-amber-200">
            <KeyRound className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Segurança da conta</h2>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              Troque sua senha quando quiser manter o acesso protegido.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="current-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Senha atual
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="profile-input profile-input-security"
                  required
                />
              </div>

              <div>
                <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Nova senha
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="profile-input profile-input-security"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Confirmar nova senha
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="profile-input profile-input-security"
                  required
                />
              </div>
            </div>

            <div className="profile-password-strength">
              <span>Força da senha: <strong>{newPassword ? passwordStrength.label : '-'}</strong></span>
              <div className="profile-strength-track">
                <div className={`profile-strength-fill is-level-${newPassword ? passwordStrength.level : 0}`} />
              </div>
              <small>Use 8+ caracteres com letra maiúscula, número e símbolo.</small>
            </div>

            <button
              type="submit"
              disabled={isSavingPassword}
              className="profile-security-btn"
            >
              <KeyRound className="h-4 w-4" />
              {isSavingPassword ? 'Atualizando...' : 'Trocar senha'}
            </button>

            {passwordMessage ? <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">{passwordMessage}</p> : null}
            {passwordError ? (
              <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-300">
                <AlertCircle className="h-4 w-4" />
                {passwordError}
              </div>
            ) : null}
          </form>

          <section className="profile-actions-panel rounded-3xl border p-6">
            <h2>Ações rápidas</h2>
            <p>Atalhos para continuar seus estudos e contato com a equipe.</p>
            <ul>
              {quickActions.map((action) => (
                <li key={action.to}>
                  <Link to={action.to}>
                    <Check className="h-4 w-4" />
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
