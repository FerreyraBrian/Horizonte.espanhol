import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const STORAGE_KEY = 'horizonte.auth';
const isBackendAvailable = () => typeof window !== 'undefined' && window.location.hostname !== 'localhost';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStoredSession = () => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const storeSession = (session) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('userType');
};

api.interceptors.request.use((config) => {
  const session = getStoredSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

export const getApiErrorMessage = (error, fallbackMessage = 'Não foi possível concluir a ação.') => {
  return error?.response?.data?.message || fallbackMessage;
};

// Demo admin account for localStorage-based admin testing
const DEMO_ADMIN = {
  email: 'admin@horizonteespanhol.com',
  password: 'Admin@12345',
};

const DEMO_STUDENT = {
  email: 'student@horizonte.espanhol',
  password: '12345678',
};

const isDemoAdminCredentials = (email, password) => (
  email === DEMO_ADMIN.email && password === DEMO_ADMIN.password
);

const isDemoStudentCredentials = (email, password) => (
  email === DEMO_STUDENT.email && password === DEMO_STUDENT.password
);

const isDemoAdminToken = (token) => typeof token === 'string' && token.startsWith('demo-admin-token-');

const isDemoStudentToken = (token) => typeof token === 'string' && token.startsWith('demo-student-token-');

const isDemoSession = (session) => Boolean(
  session?.user
  && (isDemoAdminToken(session?.token) || isDemoStudentToken(session?.token))
);

const createDemoAdminSession = () => ({
  user: {
    id: 'admin-001',
    name: 'Admin Horizonte',
    email: DEMO_ADMIN.email,
    role: 'ADMIN',
    status: 'active',
  },
  token: `demo-admin-token-${Date.now()}`,
});

const createDemoStudentSession = () => ({
  user: {
    id: 'student-001',
    name: 'Aluno Horizonte',
    email: DEMO_STUDENT.email,
    role: 'STUDENT',
    status: 'active',
  },
  token: `demo-student-token-${Date.now()}`,
});

export const ensureDemoAdminSession = () => {
  const session = getStoredSession();

  if (session?.token && isDemoAdminToken(session.token) && session.user?.role === 'ADMIN') {
    return session;
  }

  const demoAdminSession = createDemoAdminSession();
  storeSession(demoAdminSession);
  return demoAdminSession;
};

export const login = async (email, password) => {
  if (isDemoAdminCredentials(email, password)) {
    const demoAdminSession = createDemoAdminSession();
    storeSession(demoAdminSession);
    return demoAdminSession;
  }

  if (isDemoStudentCredentials(email, password)) {
    const demoStudentSession = createDemoStudentSession();
    storeSession(demoStudentSession);
    return demoStudentSession;
  }

  // Try backend authentication
  try {
    const { data } = await api.post('/auth/login', { email, password });
    storeSession(data);
    return data;
  } catch (error) {
    if (isDemoAdminCredentials(email, password)) {
      const demoAdminSession = createDemoAdminSession();
      storeSession(demoAdminSession);
      return demoAdminSession;
    }

    if (isDemoStudentCredentials(email, password)) {
      const demoStudentSession = createDemoStudentSession();
      storeSession(demoStudentSession);
      return demoStudentSession;
    }
    throw error;
  }
};

export const register = async ({ name, email, password }) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
};

export const fetchCurrentUser = async () => {
  const session = getStoredSession();

  if (isDemoSession(session)) {
    return session.user;
  }

  const { data } = await api.get('/auth/me');
  return data;
};

export const updateProfile = async ({ name, email }) => {
  const session = getStoredSession();

  if (isDemoSession(session)) {
    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        name: name ?? session.user.name,
        email: email ?? session.user.email,
      },
    };

    storeSession(updatedSession);
    return updatedSession;
  }

  const { data } = await api.patch('/auth/me', { name, email });
  storeSession(data);
  return data;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const session = getStoredSession();

  if (isDemoSession(session)) {
    if (!currentPassword || !newPassword) {
      throw new Error('Dados de senha inválidos.');
    }

    return { message: 'Senha atualizada com sucesso.' };
  }

  const { data } = await api.post('/auth/me/password', { currentPassword, newPassword });
  return data;
};

export const logout = () => {
  clearSession();
};

export default api;
