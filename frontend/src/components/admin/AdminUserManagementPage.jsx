import React, { useEffect, useMemo, useState } from 'react';
import {
  Users,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  Plus,
  Filter,
  ChevronDown,
  Mail,
  Calendar,
  TrendingUp,
  Eye,
} from 'lucide-react';
import { studentService, permissionService } from '../../services/storageService';
import UserAvatar from '../ui/UserAvatar';
import '../../styles/admin.css';

const AdminUserManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({});

  // Load students
  useEffect(() => {
    const loadStudents = () => {
      const allStudents = studentService.getAll();
      setStudents(allStudents);
    };
    loadStudents();
  }, []);

  // Filter students
  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(s => s.role === roleFilter);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, statusFilter, roleFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const all = studentService.getAll();
    return {
      total: all.length,
      active: all.filter(s => s.status === 'active').length,
      pending: all.filter(s => s.status === 'pending').length,
      inactive: all.filter(s => s.status === 'inactive').length,
    };
  }, [students]);

  // Handle activate student
  const handleActivate = (id) => {
    studentService.activate(id);
    const updated = studentService.getAll();
    setStudents(updated);
  };

  // Handle deactivate student
  const handleDeactivate = (id) => {
    studentService.deactivate(id);
    const updated = studentService.getAll();
    setStudents(updated);
  };

  // Handle role change
  const handleRoleChange = (id, newRole) => {
    studentService.updateRole(id, newRole);
    const updated = studentService.getAll();
    setStudents(updated);
  };

  // Handle delete student
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este aluno?')) {
      studentService.delete(id);
      const updated = studentService.getAll();
      setStudents(updated);
    }
  };

  // Open edit modal
  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      role: student.role,
    });
    setShowModal(true);
  };

  // Save changes
  const handleSaveChanges = () => {
    if (editingStudent) {
      studentService.update(editingStudent.id, formData);
      const updated = studentService.getAll();
      setStudents(updated);
      setShowModal(false);
      setEditingStudent(null);
    }
  };

  // Open detail view
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'inactive':
        return 'badge-danger';
      default:
        return 'badge-outline';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending':
        return 'Pendente';
      case 'inactive':
        return 'Inativo';
      default:
        return status;
    }
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      STUDENT: 'Estudante',
      KIDS: 'Criança',
      TEACHER: 'Professor',
      ADMIN: 'Administrador',
    };
    return roleMap[role] || role;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gerenciamento de Usuários</h1>
        <p>Administre alunos, ative contas e configure permissões.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid-4">
        <div className="card">
          <div className="card-header">
            <h3>Total de Alunos</h3>
            <Users className="h-6 w-6 text-gray-500" />
          </div>
          <div className="card-content">
            <div className="value">{metrics.total}</div>
            <p className="description">Cadastrados na plataforma</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Ativos</h3>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div className="card-content">
            <div className="value" style={{ color: '#22c55e' }}>
              {metrics.active}
            </div>
            <p className="description">Usando a plataforma</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Pendentes</h3>
            <Shield className="h-6 w-6 text-amber-500" />
          </div>
          <div className="card-content">
            <div className="value" style={{ color: '#f59e0b' }}>
              {metrics.pending}
            </div>
            <p className="description">Aguardando ativação</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Inativos</h3>
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="card-content">
            <div className="value" style={{ color: '#ef4444' }}>
              {metrics.inactive}
            </div>
            <p className="description">Desativados</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search
                className="h-5 w-5"
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }}
              />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                }}
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="pending">Pendente</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                }}
              >
                <option value="all">Todos os Papéis</option>
                <option value="ADMIN">Administrador</option>
                <option value="TEACHER">Professor</option>
                <option value="STUDENT">Estudante</option>
                <option value="KIDS">Criança</option>
              </select>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            Mostrando {filteredStudents.length} de {students.length} alunos
          </p>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <th
                  style={{
                    padding: '1rem 0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Aluno
                </th>
                <th
                  style={{
                    padding: '1rem 0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: '1rem 0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Papel
                </th>
                <th
                  style={{
                    padding: '1rem 0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '1rem 0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Progresso
                </th>
                <th
                  style={{
                    padding: '1rem 0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Último Acesso
                </th>
                <th
                  style={{
                    padding: '1rem 0.75rem',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: '2rem 1rem',
                      textAlign: 'center',
                      color: '#9ca3af',
                    }}
                  >
                    Nenhum aluno encontrado
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        idx % 2 === 0 ? '#ffffff' : '#f9fafb')
                    }
                  >
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserAvatar name={student.name} />
                        <div>
                          <div style={{ fontWeight: '500', color: '#111827' }}>
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: '#6b7280' }}>
                      {student.email}
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <select
                        value={student.role}
                        onChange={(e) => handleRoleChange(student.id, e.target.value)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          backgroundColor: 'white',
                        }}
                      >
                        <option value="ADMIN">Administrador</option>
                        <option value="TEACHER">Professor</option>
                        <option value="STUDENT">Estudante</option>
                        <option value="KIDS">Criança</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <span className={`badge ${getStatusBadgeColor(student.status)}`}>
                        {getStatusText(student.status)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <TrendingUp className="h-4 w-4" style={{ color: '#10b981' }} />
                        <span>{student.progress || 0}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: '#6b7280', fontSize: '0.8rem' }}>
                      {student.lastLogin ? formatTime(student.lastLogin) : '-'}
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          onClick={() => handleViewDetails(student)}
                          title="Ver detalhes"
                          style={{
                            padding: '0.375rem 0.5rem',
                            backgroundColor: 'transparent',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(student)}
                          title="Editar"
                          style={{
                            padding: '0.375rem 0.5rem',
                            backgroundColor: 'transparent',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            color: '#3b82f6',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#dbeafe';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {student.status !== 'active' && (
                          <button
                            onClick={() => handleActivate(student.id)}
                            title="Ativar"
                            style={{
                              padding: '0.375rem 0.5rem',
                              backgroundColor: 'transparent',
                              border: '1px solid #e5e7eb',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.75rem',
                              color: '#10b981',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#d1fae5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {student.status === 'active' && (
                          <button
                            onClick={() => handleDeactivate(student.id)}
                            title="Desativar"
                            style={{
                              padding: '0.375rem 0.5rem',
                              backgroundColor: 'transparent',
                              border: '1px solid #e5e7eb',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.75rem',
                              color: '#ef4444',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#fee2e2';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(student.id)}
                          title="Deletar"
                          style={{
                            padding: '0.375rem 0.5rem',
                            backgroundColor: 'transparent',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            color: '#ef4444',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
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
              minWidth: '400px',
              maxWidth: '500px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>
              Editar Aluno
            </h2>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Papel
                </label>
                <select
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Selecionar...</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="TEACHER">Professor</option>
                  <option value="STUDENT">Estudante</option>
                  <option value="KIDS">Criança</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
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
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedStudent && (
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
          onClick={() => setShowDetailModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '2rem',
              minWidth: '450px',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <UserAvatar name={selectedStudent.name} />
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{selectedStudent.name}</h2>
                <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>
                  {selectedStudent.email}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p
                    style={{
                      margin: '0 0 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                    }}
                  >
                    Papel
                  </p>
                  <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: '500' }}>
                    {getRoleDisplay(selectedStudent.role)}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      margin: '0 0 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                    }}
                  >
                    Status
                  </p>
                  <p style={{ margin: 0 }}>
                    <span className={`badge ${getStatusBadgeColor(selectedStudent.status)}`}>
                      {getStatusText(selectedStudent.status)}
                    </span>
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      margin: '0 0 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                    }}
                  >
                    Cadastrado em
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
                    {formatDate(selectedStudent.createdAt)}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      margin: '0 0 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                    }}
                  >
                    Ativado em
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
                    {formatDate(selectedStudent.activatedAt) || '-'}
                  </p>
                </div>
              </div>

              {/* Progress Section */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Andamento</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p
                      style={{
                        margin: '0 0 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                      }}
                    >
                      Progresso
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: '0.5rem',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            backgroundColor: '#10b981',
                            width: `${selectedStudent.progress || 0}%`,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        {selectedStudent.progress || 0}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <p
                      style={{
                        margin: '0 0 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                      }}
                    >
                      Aulas Completadas
                    </p>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#3b82f6' }}>
                      {selectedStudent.lessonsCompleted || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Access */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <p
                  style={{
                    margin: '0 0 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  Último Acesso
                </p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
                  {selectedStudent.lastLogin
                    ? `${formatDate(selectedStudent.lastLogin)} às ${formatTime(
                      selectedStudent.lastLogin
                    )}`
                    : 'Nunca fez login'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              style={{
                width: '100%',
                marginTop: '1.5rem',
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
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagementPage;
