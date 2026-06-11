import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, FileText, Settings, LogOut, Search, Sun, Moon, Star, BookOpen, ToyBrick, Menu, ChevronLeft, Activity, Shield, BellRing, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../ui/UserAvatar';

const AdminAppShell = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isActive = (path) => location.pathname === path;
  const isDashboardActive = ['/painel', '/admin/dashboard'].includes(location.pathname);
  const isResourcesActive = ['/admin/recursos', '/admin/materiais'].includes(location.pathname);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') || 'light';
    const storedSidebar = localStorage.getItem('adminSidebarCollapsed');
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
      localStorage.setItem('adminSidebarCollapsed', next ? '1' : '0');
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

  return (
    <div className="admin-shell">
      <button
        type="button"
        className={`admin-sidebar-backdrop ${sidebarCollapsed ? '' : 'is-visible'}`}
        aria-label="Fechar menu lateral"
        onClick={toggleSidebar}
      />
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'admin-sidebar-collapsed' : 'admin-sidebar-expanded'}`}>
        {/* Sidebar Header */}
        <div className="admin-sidebar-header">
          <NavLink to="/admin/dashboard" className="admin-logo">
            <div className={`admin-logo-stars ${sidebarCollapsed ? 'admin-logo-stars-collapsed' : ''}`}>
              <Star className="admin-star" />
              <div className="flex">
                <Star className="admin-star" />
                <Star className="admin-star" />
              </div>
              <BookOpen className="admin-book-icon" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <h2 className="admin-title">Admin</h2>
              </div>
            )}
          </NavLink>
          {!sidebarCollapsed && (
            <button
              type="button"
              className="admin-sidebar-close-btn"
              aria-label="Fechar menu lateral"
              onClick={toggleSidebar}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="admin-nav">
          <nav className="space-y-1">
            <NavLink to="/admin/dashboard" className={`admin-nav-item ${isDashboardActive ? 'active' : ''}`}>
              <Home className="h-5 w-5" />
              {!sidebarCollapsed && <span>Painel</span>}
            </NavLink>

            {/* Management Section */}
            {!sidebarCollapsed && (
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9ca3af', padding: '1rem 0 0.5rem 1rem', textTransform: 'uppercase' }}>
                Gerenciamento
              </div>
            )}
            <NavLink to="/admin/usuarios" className={`admin-nav-item ${isActive('/admin/usuarios') ? 'active' : ''}`}>
              <Users className="h-5 w-5" />
              {!sidebarCollapsed && <span>Gerenciar Usuários</span>}
            </NavLink>
            <NavLink to="/admin/atividades" className={`admin-nav-item ${isActive('/admin/atividades') ? 'active' : ''}`}>
              <Activity className="h-5 w-5" />
              {!sidebarCollapsed && <span>Atividades</span>}
            </NavLink>
            <NavLink to="/admin/permissoes" className={`admin-nav-item ${isActive('/admin/permissoes') ? 'active' : ''}`}>
              <Shield className="h-5 w-5" />
              {!sidebarCollapsed && <span>Permissões</span>}
            </NavLink>

            {/* Content Section */}
            {!sidebarCollapsed && (
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9ca3af', padding: '1rem 0 0.5rem 1rem', textTransform: 'uppercase' }}>
                Conteúdo
              </div>
            )}
            <NavLink to="/alunos" className={`admin-nav-item ${isActive('/alunos') ? 'active' : ''}`}>
              <Users className="h-5 w-5" />
              {!sidebarCollapsed && <span>Alunos</span>}
            </NavLink>
            <NavLink to="/admin/recursos" className={`admin-nav-item ${isResourcesActive ? 'active' : ''}`}>
              <BookOpen className="h-5 w-5" />
              {!sidebarCollapsed && <span>Central de Recursos</span>}
            </NavLink>
            <NavLink to="/admin/avisos" className={`admin-nav-item ${isActive('/admin/avisos') ? 'active' : ''}`}>
              <BellRing className="h-5 w-5" />
              {!sidebarCollapsed && <span>Mural de Avisos</span>}
            </NavLink>
            <NavLink to="/admin/infantil" className={`admin-nav-item ${isActive('/admin/infantil') ? 'active' : ''}`}>
              <ToyBrick className="h-5 w-5" />
              {!sidebarCollapsed && <span>Espanhol para Crianças</span>}
            </NavLink>
            <NavLink to="/admin/submissoes" className={`admin-nav-item ${isActive('/admin/submissoes') ? 'active' : ''}`}>
              <FileText className="h-5 w-5" />
              {!sidebarCollapsed && <span>Submissões</span>}
            </NavLink>
            <NavLink to="/admin/configuracoes" className={`admin-nav-item ${isActive('/admin/configuracoes') ? 'active' : ''}`}>
              <Settings className="h-5 w-5" />
              {!sidebarCollapsed && <span>Configurações</span>}
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-menu">
            <button
              onClick={toggleUserMenu}
              className={`admin-user-btn ${sidebarCollapsed ? 'admin-user-btn-collapsed' : ''}`}
            >
              <UserAvatar name={user?.name || 'Admin'} className="admin-user-avatar" />
              {!sidebarCollapsed && (
                <div className="admin-user-info">
                  <span className="admin-user-name">{user?.name || 'Admin'}</span>
                  <span className="admin-user-email">{user?.email || 'admin@...'}</span>
                </div>
              )}
            </button>
            {userMenuOpen && (
              <div className="admin-user-dropdown">
                <button
                  type="button"
                  className="admin-user-dropdown-item"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button onClick={toggleSidebar} className="admin-toggle-btn">
              {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            {/* Search bar removed as requested */}
          </div>
          <div className="admin-header-right">
            <Link to="/" className="admin-return-link">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao site</span>
            </Link>
            <button
              onClick={() => toggleTheme('light')}
              className={`admin-theme-btn ${theme === 'light' ? 'active' : ''}`}
            >
              <Sun className="h-4 w-4" />
              <span className="sr-only">Light Mode</span>
            </button>
            <button
              onClick={() => toggleTheme('dark')}
              className={`admin-theme-btn ${theme === 'dark' ? 'active' : ''}`}
            >
              <Moon className="h-4 w-4" />
              <span className="sr-only">Dark Mode</span>
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminAppShell;
