import React, { useEffect, useMemo, useState } from 'react';
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  Edit2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { permissionService } from '../../services/storageService';
import '../../styles/admin.css';

const AdminPermissionsPage = () => {
  const [permissions, setPermissions] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [editingPerms, setEditingPerms] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Load permissions
  useEffect(() => {
    const loadPermissions = () => {
      const allPerms = permissionService.getAll();
      setPermissions(allPerms);
      if (!selectedRole && Object.keys(allPerms).length > 0) {
        setSelectedRole(Object.keys(allPerms)[0]);
      }
    };
    loadPermissions();
  }, []);

  const permissionGroups = useMemo(
    () => ({
      profile: {
        title: 'Perfil',
        icon: <Shield className="h-5 w-5" />,
        permissions: [
          { key: 'canEditProfile', label: 'Editar Perfil Próprio' },
        ],
      },
      learning: {
        title: 'Aprendizado',
        icon: <FileText className="h-5 w-5" />,
        permissions: [
          { key: 'canViewLessons', label: 'Visualizar Lições' },
          { key: 'canSubmitWork', label: 'Enviar Trabalhos' },
          { key: 'canAccessKids', label: 'Acessar Espaço Infantil' },
        ],
      },
      community: {
        title: 'Comunidade',
        icon: <MessageSquare className="h-5 w-5" />,
        permissions: [
          { key: 'canViewForum', label: 'Acessar Fórum' },
          { key: 'canPostForum', label: 'Publicar e responder no Fórum' },
        ],
      },
      admin: {
        title: 'Administração',
        icon: <BarChart3 className="h-5 w-5" />,
        permissions: [
          { key: 'canGradeWork', label: 'Avaliar Trabalhos' },
          { key: 'canManageStudents', label: 'Gerenciar Alunos' },
          { key: 'canManagePermissions', label: 'Gerenciar Permissões' },
          { key: 'canManageMaterials', label: 'Gerenciar Materiais' },
          { key: 'canViewAnalytics', label: 'Visualizar Analytics' },
        ],
      },
    }),
    []
  );

  const roleColors = {
    ADMIN: '#ef4444',
    TEACHER: '#f59e0b',
    STUDENT: '#3b82f6',
    KIDS: '#8b5cf6',
  };

  const roleDescriptions = {
    ADMIN: 'Acesso total à plataforma e controle administrativo completo.',
    TEACHER: 'Pode gerenciar alunos, avaliar trabalhos e acessar analytics.',
    STUDENT: 'Acesso completo ao conteúdo de aprendizado para adultos.',
    KIDS: 'Acesso ao espaço infantil com conteúdo apropriado para crianças.',
  };

  // Handle edit role
  const openEditModal = (role) => {
    const rolePerms = permissions[role];
    setEditingRole(role);
    setEditingPerms({ ...rolePerms });
    setShowModal(true);
  };

  // Save changes
  const handleSaveChanges = () => {
    if (editingRole) {
      const updated = permissionService.update(editingRole, editingPerms);
      const allPerms = permissionService.getAll();
      setPermissions(allPerms);
      setShowModal(false);
      setEditingRole(null);
    }
  };

  // Toggle permission
  const handleTogglePermission = (key) => {
    setEditingPerms({
      ...editingPerms,
      [key]: !editingPerms[key],
    });
  };

  const currentRole = selectedRole && permissions[selectedRole];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gerenciamento de Permissões</h1>
        <p>Configure os direitos de acesso para cada papel de usuário.</p>
      </div>

      {/* Role Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {Object.entries(permissions).map(([role, roleData]) => (
          <div
            key={role}
            className="card"
            onClick={() => setSelectedRole(role)}
            style={{
              cursor: 'pointer',
              borderLeft: `4px solid ${roleColors[role] || '#6b7280'}`,
              transition: 'all 0.2s',
              opacity: selectedRole === role ? 1 : 0.7,
              backgroundColor: selectedRole === role ? '#f9fafb' : 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Shield
                  className="h-5 w-5"
                  style={{ color: roleColors[role] || '#6b7280' }}
                />
                <h3 style={{ margin: 0, fontWeight: '600', color: '#111827' }}>
                  {roleData.name}
                </h3>
              </div>

              <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                {roleDescriptions[role] || 'Nenhuma descrição'}
              </p>

              <div style={{ marginTop: '1rem' }}>
                {Object.entries(permissionGroups).map(([groupKey, group]) => {
                  const groupPerms = group.permissions.filter((p) => roleData[p.key]);
                  if (groupPerms.length === 0) return null;

                  return (
                    <div
                      key={groupKey}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <CheckCircle className="h-3 w-3" style={{ color: '#10b981' }} />
                      {group.title}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View */}
      {currentRole && (
        <div className="card">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                {currentRole.name}
              </h2>
              <button
                onClick={() => openEditModal(selectedRole)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                <Edit2 className="h-4 w-4" />
                Editar Permissões
              </button>
            </div>
            <p style={{ margin: '0.5rem 0 0', color: '#6b7280' }}>
              {roleDescriptions[selectedRole] || 'Nenhuma descrição'}
            </p>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {Object.entries(permissionGroups).map(([groupKey, group]) => (
              <div
                key={groupKey}
                style={{
                  marginBottom: '2rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  {group.icon}
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                    {group.title}
                  </h3>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem', marginLeft: '1.75rem' }}>
                  {group.permissions.map((perm) => (
                    <div
                      key={perm.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        backgroundColor: currentRole[perm.key] ? '#f0fdf4' : '#f9fafb',
                      }}
                    >
                      {currentRole[perm.key] ? (
                        <CheckCircle
                          className="h-5 w-5"
                          style={{ color: '#10b981', minWidth: '1.25rem' }}
                        />
                      ) : (
                        <XCircle
                          className="h-5 w-5"
                          style={{ color: '#d1d5db', minWidth: '1.25rem' }}
                        />
                      )}
                      <span
                        style={{
                          fontSize: '0.875rem',
                          color: currentRole[perm.key] ? '#065f46' : '#6b7280',
                          fontWeight: currentRole[perm.key] ? '500' : '400',
                        }}
                      >
                        {perm.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingRole && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '2rem',
              minWidth: '450px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>
              Editar Permissões: {permissions[editingRole].name}
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {Object.entries(permissionGroups).map(([groupKey, group]) => (
                <div key={groupKey}>
                  <h3
                    style={{
                      margin: '0 0 1rem 0',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                    }}
                  >
                    {group.title}
                  </h3>

                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {group.permissions.map((perm) => (
                      <label
                        key={perm.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          borderRadius: '0.375rem',
                          backgroundColor: '#f9fafb',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={editingPerms[perm.key] || false}
                          onChange={() => handleTogglePermission(perm.key)}
                          style={{
                            width: '1rem',
                            height: '1rem',
                            cursor: 'pointer',
                          }}
                        />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                          {perm.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveChanges}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Salvar Mudanças
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Information Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        <div
          className="card"
          style={{
            borderLeft: '4px solid #3b82f6',
            backgroundColor: '#eff6ff',
          }}
        >
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>
              Dica: Acesso Mínimo
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af' }}>
              Sempre conceda apenas as permissões necessárias para cada papel. Isso aumenta a segurança.
            </p>
          </div>
        </div>

        <div
          className="card"
          style={{
            borderLeft: '4px solid #10b981',
            backgroundColor: '#f0fdf4',
          }}
        >
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#10b981' }}>
              Boas Práticas
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#065f46' }}>
              Revise permissões regularmente e atualize-as conforme as responsabilidades mudam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPermissionsPage;
