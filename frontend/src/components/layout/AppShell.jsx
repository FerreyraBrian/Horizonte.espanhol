import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Star, Home, MessageSquare, LogOut, Search, User, Settings, Lock, FileDown, Sun, Moon, BookOpen, Megaphone, ClipboardCheck, Menu, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../ui/UserAvatar';
import OriAssistant from '../ui/OriAssistant';

// ===== CONSTANTES DE DISEÑO =====
const SIDEBAR_WIDTH = {
  EXPANDED: 280,  // px
  COLLAPSED: 72,  // px
};

const AppShell = ({ children, userProgress }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // ===== ESTADOS =====
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('appSidebarCollapsed');
    return saved === '1';
  });
  
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // ===== DERIVADOS =====
  const isKidsExperience = location.pathname.startsWith('/painel-infantil')
    || location.pathname.startsWith('/evaluacoes-infantil')
    || location.pathname.startsWith('/perfil-infantil');

  const normalizedRole = String(user?.role ?? '').toUpperCase();
  const normalizedStatus = String(user?.status ?? '').toUpperCase();
  const showOri = normalizedRole === 'STUDENT' && normalizedStatus === 'ACTIVE';
  
  // Calcular ancho actual del sidebar
  const currentSidebarWidth = isMobile 
    ? 0 
    : (sidebarCollapsed ? SIDEBAR_WIDTH.COLLAPSED : SIDEBAR_WIDTH.EXPANDED);

  // ===== HANDLERS =====
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('appSidebarCollapsed', next ? '1' : '0');
      return next;
    });
  }, []);

  const toggleTheme = useCallback((newTheme) => {
    if (!mounted) return;
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  }, [mounted]);

  const toggleUserMenu = useCallback(() => {
    setUserMenuOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  }, [logout, navigate]);

  // ===== EFECTOS =====
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  // Detectar cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true);
        localStorage.setItem('appSidebarCollapsed', '1');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  // ===== COMPONENTES INTERNOS =====
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

  // ===== NAVEGACIÓN INFANTIL =====
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
        <NavLink to="/painel-infantil" className={navLinkClass(location.pathname === '/painel-infantil')}>
          <Home size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Minhas Aulas</span>}
        </NavLink>
        <NavLink to="/evaluacoes-infantil" className={navLinkClass(location.pathname === '/evaluacoes-infantil')}>
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

  // ===== NAVEGACIÓN ADULTOS =====
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
        <NavLink to="/dashboard" className={navLinkClass(location.pathname === '/dashboard')}>
          <Home size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Minhas Aulas</span>}
        </NavLink>
        <NavLink to="/evaluacoes" className={navLinkClass(location.pathname === '/evaluacoes')}>
          <ClipboardCheck size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Avaliações</span>}
        </NavLink>
        <NavLink to="/cartelera" className={navLinkClass(location.pathname === '/cartelera')}>
          <Megaphone size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Cartelera</span>}
        </NavLink>
        <NavLink to="/forum" className={navLinkClass(location.pathname === '/forum')}>
          <MessageSquare size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Fórum</span>}
        </NavLink>
        <NavLink to="/resources" className={navLinkClass(location.pathname === '/resources')}>
          <FileDown size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Materiais</span>}
        </NavLink>
        <NavLink to="/espanhol-para-criancas" className={navLinkClass(location.pathname === '/espanhol-para-criancas')}>
          <BookOpen size={20} className="app-nav-icon" />
          {!sidebarCollapsed && <span>Espaço Infantil</span>}
        </NavLink>
        <NavLink to="/contato" className={navLinkClass(location.pathname === '/contato')}>
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

  // ===== RENDER =====
  return (
    <div className="app-shell">
      {/* BACKDROP - Solo visible en móvil cuando el sidebar está expandido */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="app-sidebar-backdrop is-visible"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`
          app-sidebar
          ${sidebarCollapsed ? 'app-sidebar-collapsed' : 'app-sidebar-expanded'}
          ${isMobile ? 'app-sidebar-mobile' : ''}
          ${isMobile && sidebarCollapsed ? 'app-sidebar-mobile-hidden' : ''}
          ${isMobile && !sidebarCollapsed ? 'app-sidebar-mobile-visible' : ''}
        `}
        style={{
          width: isMobile 
            ? (sidebarCollapsed ? 0 : SIDEBAR_WIDTH.EXPANDED) 
            : (sidebarCollapsed ? SIDEBAR_WIDTH.COLLAPSED : SIDEBAR_WIDTH.EXPANDED)
        }}
      >
        {isKidsExperience ? <KidsNav /> : <AdultNav />}
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div 
        className="app-main"
        style={{
          marginLeft: isMobile ? 0 : currentSidebarWidth,
          transition: 'margin-left 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <header className="app-header">
          <div className="app-header-left">
            <button 
              onClick={toggleSidebar} 
              className="app-toggle-btn"
              aria-label={sidebarCollapsed ? 'Abrir menú' : 'Cerrar menú'}
            >
              {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </button>
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