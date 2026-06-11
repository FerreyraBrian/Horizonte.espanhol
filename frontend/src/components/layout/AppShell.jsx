import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Star, Home, MessageSquare, LogOut, Search, User, Settings, Lock, FileDown, Sun, Moon, BookOpen, Megaphone, ClipboardCheck, Menu, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../ui/UserAvatar';
import OriAssistant from '../ui/OriAssistant';

const AppShell = ({ children, userProgress }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isActive = (path) => location.pathname === path;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isKidsExperience = location.pathname.startsWith('/painel-infantil')
    || location.pathname.startsWith('/evaluacoes-infantil')
    || location.pathname.startsWith('/perfil-infantil');
  const showOri = user?.role === 'STUDENT' && user?.status === 'active';

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') || 'light';
    const storedSidebar = localStorage.getItem('appSidebarCollapsed');
    setTheme(storedTheme);
    setSidebarCollapsed(storedSidebar === '1');
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  const toggleTheme = (newTheme) => {
    if (!mounted) return;
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => {
      const next = !current;
      localStorage.setItem('appSidebarCollapsed', next ? '1' : '0');
      return next;
    });
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  const LogoStars = () => (
    <div className={`app-logo-stars ${sidebarCollapsed ? 'app-logo-stars-collapsed' : ''}`}>
      <Star size={16} className="app-logo-star" />
      <div className="app-logo-star-row">
        <Star size={16} className="app-logo-star app-logo-star-delay-1" />
        <Star size={16} className="app-logo-star app-logo-star-delay-2" />
      </div>
    </div>
  );

  const navLinkClass = (active) => `app-nav-link${active ? ' app-nav-link-active' : ''}`;
  const userButtonClass = `app-user-button${sidebarCollapsed ? ' app-user-button-collapsed' : ''}`;
  const themeButtonClass = (active) => `app-theme-btn${active ? ' active' : ''}`;

  const KidsNav = () => (
    <>
      <div className="app-sidebar-header">
        <NavLink to="/painel-infantil" className="app-logo-link">
          <BookOpen size={32} className="app-logo-icon" color="#3b82f6" />
          {!sidebarCollapsed && (
            <div className="app-logo-text">
              <h2 className="app-sidebar-title">Infantil</h2>
            </div>
          )}
        </NavLink>
        {!sidebarCollapsed && (
          <button
            type="button"
            className="app-sidebar-close-btn"
            aria-label="Fechar menu lateral"
            onClick={toggleSidebar}
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>
      <div className="app-nav">
        <NavLink to="/painel-infantil" className={navLinkClass(isActive('/painel-infantil'))}>
          <Home size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Minhas Aulas</span>}
        </NavLink>
        <NavLink to="/evaluacoes-infantil" className={navLinkClass(isActive('/evaluacoes-infantil'))}>
          <ClipboardCheck size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Avaliações</span>}
        </NavLink>
      </div>
      <div className="app-sidebar-footer">
        <div className="app-sidebar-footer-inner">
          <button onClick={toggleUserMenu} className={userButtonClass}>
            <UserAvatar name={user?.name || 'Aluno(a)'} className="app-user-avatar" />
            {!sidebarCollapsed && (
              <div className="app-user-info">
                <span className="app-user-name">{user?.name || 'Aluno(a)'}</span>
                <span className="app-user-subtitle">{user?.email || 'Meu Perfil'}</span>
              </div>
            )}
          </button>
          {userMenuOpen && (
            <div className="app-user-dropdown">
              <NavLink to="/perfil-infantil" className="app-user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                <User size={16} className="app-user-icon" />
                <span>Meu Perfil</span>
              </NavLink>
              <NavLink to="/login" className="app-user-dropdown-item" onClick={handleLogout}>
                <LogOut size={16} className="app-user-icon" />
                <span>Sair</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const AdultNav = () => (
    <>
      <div className="app-sidebar-header">
        <NavLink to="/" className="app-logo-link">
          <LogoStars />
          {!sidebarCollapsed && (
            <div className="app-logo-text">
              <h2 className="app-sidebar-title">Horizonte</h2>
            </div>
          )}
        </NavLink>
        {!sidebarCollapsed && (
          <button
            type="button"
            className="app-sidebar-close-btn"
            aria-label="Fechar menu lateral"
            onClick={toggleSidebar}
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>
      <div className="app-nav">
        <NavLink to="/dashboard" className={navLinkClass(isActive('/dashboard'))}>
          <Home size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Minhas Aulas</span>}
        </NavLink>
        <NavLink to="/evaluacoes" className={navLinkClass(isActive('/evaluacoes'))}>
          <ClipboardCheck size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Avaliações</span>}
        </NavLink>
        <NavLink to="/cartelera" className={navLinkClass(isActive('/cartelera'))}>
          <Megaphone size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Cartelera</span>}
        </NavLink>
        <NavLink to="/forum" className={navLinkClass(isActive('/forum'))}>
          <MessageSquare size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Fórum</span>}
        </NavLink>
        <NavLink to="/resources" className={navLinkClass(isActive('/resources'))}>
          <FileDown size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Materiais</span>}
        </NavLink>
        <NavLink to="/espanhol-para-criancas" className={navLinkClass(isActive('/espanhol-para-criancas'))}>
          <BookOpen size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Espaço Infantil</span>}
        </NavLink>
        <NavLink to="/contato" className={navLinkClass(isActive('/contato'))}>
          <MessageSquare size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Contato</span>}
        </NavLink>
      </div>
      {!sidebarCollapsed && userProgress && (
        <div className="app-progress-card">
          <p className="app-progress-label">Progreso: {userProgress.progress ?? 0}%</p>
          <div className="app-progress-track">
            <div className="app-progress-fill" style={{ width: `${userProgress.progress ?? 0}%` }} />
          </div>
        </div>
      )}
      <div className="app-sidebar-footer">
        <div className="app-sidebar-footer-inner">
          <button onClick={toggleUserMenu} className={userButtonClass}>
            <UserAvatar name={user?.name || 'Aluno(a)'} className="app-user-avatar" />
            {!sidebarCollapsed && (
              <div className="app-user-info">
                <span className="app-user-name">{user?.name || 'Aluno(a)'}</span>
                <span className="app-user-subtitle">{user?.email || 'Ver perfil'}</span>
              </div>
            )}
          </button>
          {userMenuOpen && (
            <div className="app-user-dropdown">
              <NavLink to="/profile" className="app-user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                <User size={16} className="app-user-icon" />
                <span>Meu Perfil</span>
              </NavLink>
              <div className="app-user-dropdown-item app-user-dropdown-item-disabled">
                <Settings size={16} className="app-user-icon" />
                <span>Configurações</span>
              </div>
              <NavLink to="/profile#change-password" className="app-user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                <Lock size={16} className="app-user-icon" />
                <span>Trocar Senha</span>
              </NavLink>
              <NavLink to="/login" className="app-user-dropdown-item" onClick={handleLogout}>
                <LogOut size={16} className="app-user-icon" />
                <span>Sair</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="app-shell">
      <button
        type="button"
        className={`app-sidebar-backdrop ${sidebarCollapsed ? '' : 'is-visible'}`}
        aria-label="Fechar menu lateral"
        onClick={toggleSidebar}
      />
      <aside className={`app-sidebar ${sidebarCollapsed ? 'app-sidebar-collapsed' : 'app-sidebar-expanded'}`}>
        {isKidsExperience ? <KidsNav /> : <AdultNav />}
      </aside>
      <div className="app-main">
        <header className="app-header">
          <div className="app-header-left">
            <button onClick={toggleSidebar} className="app-toggle-btn">
              {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </button>
            {/* Search bar removed as requested */}
          </div>
          <div className="app-header-right">
            <button onClick={() => toggleTheme('light')} className={themeButtonClass(theme === 'light')}>
              <Sun size={16} />
              <span className="sr-only">Light Mode</span>
            </button>
            <button onClick={() => toggleTheme('dark')} className={themeButtonClass(theme === 'dark')}>
              <Moon size={16} />
              <span className="sr-only">Dark Mode</span>
            </button>
          </div>
        </header>
        <main className="app-main-content">{children}</main>
        {showOri && <OriAssistant />}
      </div>
    </div>
  );
};

export default AppShell;
