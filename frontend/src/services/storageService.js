import { lessons as defaultLessons } from './mockData';

// Local Storage Service for localStorage-based data management

const STORAGE_KEYS = {
  STUDENTS: 'horizonte_students',
  ACTIVITIES: 'horizonte_activities',
  PERMISSIONS: 'horizonte_permissions',
  MATERIALS: 'horizonte_materials',
  NOTICES: 'horizonte_notice_board',
  FORUM_POSTS: 'horizonte_forum_posts',
  CONTACT_MESSAGES: 'horizonte_contact_messages',
};

const hasLocalStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const now = new Date();
const hoursAgo = (hours) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

const DEFAULT_STUDENTS = [
  {
    id: 'student-001',
    name: 'Carlos Silva',
    email: 'carlos@horizonteespanhol.com',
    progress: 92,
    createdAt: daysAgo(45),
    lastLogin: hoursAgo(2),
  },
  {
    id: 'student-002',
    name: 'Mariana Costa',
    email: 'mariana@horizonteespanhol.com',
    role: 'STUDENT',
    status: 'active',
    progress: 78,
    createdAt: daysAgo(38),
    lastLogin: hoursAgo(5),
  },
  {
    id: 'student-003',
    name: 'João Pereira',
    email: 'joao@horizonteespanhol.com',
    role: 'KIDS',
    status: 'active',
    progress: 64,
    createdAt: daysAgo(26),
    lastLogin: hoursAgo(8),
  },
  {
    id: 'student-004',
    name: 'Ana Souza',
    email: 'ana@horizonteespanhol.com',
    role: 'STUDENT',
    status: 'pending',
    progress: 22,
    createdAt: daysAgo(12),
    lastLogin: null,
  },
  {
    id: 'student-005',
    name: 'Lucas Mendes',
    email: 'lucas@horizonteespanhol.com',
    role: 'STUDENT',
    status: 'active',
    progress: 49,
    createdAt: daysAgo(19),
    lastLogin: hoursAgo(18),
  },
  {
    id: 'student-006',
    name: 'Fernanda Lima',
    email: 'fernanda@horizonteespanhol.com',
    role: 'TEACHER',
    status: 'active',
    progress: 88,
    createdAt: daysAgo(55),
    lastLogin: hoursAgo(1),
  },
  {
    id: 'student-007',
    name: 'Sophia Alves',
    email: 'sophia@horizonteespanhol.com',
    role: 'KIDS',
    status: 'inactive',
    progress: 15,
    createdAt: daysAgo(8),
    lastLogin: daysAgo(6),
  },
];

const DEFAULT_ACTIVITIES = [
  {
    id: 'activity-001',
    studentId: 'student-001',
    studentName: 'Carlos Silva',
    type: 'lesson_completed',
    activity: 'Completou a lição "Saudações e Apresentações".',
    timestamp: hoursAgo(1),
  },
  {
    id: 'activity-002',
    studentId: 'student-002',
    studentName: 'Mariana Costa',
    type: 'work_submitted',
    activity: 'Enviou a atividade escrita da unidade 3.',
    timestamp: hoursAgo(4),
  },
  {
    id: 'activity-003',
    studentId: 'student-003',
    studentName: 'João Pereira',
    type: 'quiz_started',
    activity: 'Iniciou o quiz infantil de vocabulário.',
    timestamp: hoursAgo(7),
  },
  {
    id: 'activity-004',
    studentId: 'student-005',
    studentName: 'Lucas Mendes',
    type: 'forum_post',
    activity: 'Publicou uma dúvida no fórum da turma.',
    timestamp: hoursAgo(11),
  },
  {
    id: 'activity-005',
    studentId: 'student-006',
    studentName: 'Fernanda Lima',
    type: 'level_completed',
    activity: 'Finalizou o nível intermediário.',
    timestamp: hoursAgo(20),
  },
];

const slugify = (value = '') => value
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const normalizeMaterialLessons = (lessons = []) => lessons
  .map((lesson, lessonIndex) => {
    const lessonId = Number(lesson?.id) || lesson?.id || lessonIndex + 1;

    return {
      ...lesson,
      id: lessonId,
      shortSummary: lesson?.shortSummary || lesson?.description || `Conteúdo complementar de ${lesson?.title || `Aula ${lessonIndex + 1}`}.`,
      fullSummary: lesson?.fullSummary || lesson?.shortSummary || `Conteúdo completo de ${lesson?.title || `Aula ${lessonIndex + 1}`}.`,
      description: lesson?.description || lesson?.shortSummary || `Material complementar da ${lesson?.title || `aula ${lessonIndex + 1}`}.`,
      resources: (lesson?.resources ?? []).map((resource, resourceIndex) => ({
        id: resource?.id || `resource-${lessonId}-${resourceIndex + 1}`,
        name: resource?.name || `Material ${resourceIndex + 1}`,
        url: resource?.url || '#',
      })),
    };
  })
  .sort((a, b) => {
    const numericIdA = Number(a.id);
    const numericIdB = Number(b.id);

    if (Number.isFinite(numericIdA) && Number.isFinite(numericIdB) && numericIdA !== numericIdB) {
      return numericIdA - numericIdB;
    }

    const courseDifference = String(a.courseSlug || '').localeCompare(String(b.courseSlug || ''));

    if (courseDifference !== 0) {
      return courseDifference;
    }

    const orderDifference = Number(a.orderIndex || 0) - Number(b.orderIndex || 0);

    if (orderDifference !== 0) {
      return orderDifference;
    }

    return String(a.title || '').localeCompare(String(b.title || ''));
  });

const DEFAULT_MATERIALS = normalizeMaterialLessons(defaultLessons);

const DEFAULT_NOTICES = [
  {
    id: 'notice-001',
    tag: 'Novo recurso',
    category: 'resource',
    title: 'Materiais extras de revisão já estão disponíveis',
    description: 'A biblioteca foi atualizada com novos PDFs e áudios para reforçar o vocabulário da semana.',
    ctaLabel: 'Abrir recursos',
    ctaUrl: '/resources',
    priority: 'high',
    pinned: true,
    published: true,
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(2),
  },
  {
    id: 'notice-002',
    tag: 'Comunicado',
    category: 'general',
    title: 'Este mural é o canal oficial de avisos do curso',
    description: 'Aqui a administração publica lembretes importantes, novidades da plataforma e orientações rápidas para a turma.',
    ctaLabel: 'Ir para o painel',
    ctaUrl: '/dashboard',
    priority: 'normal',
    pinned: false,
    published: true,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'notice-003',
    tag: 'Agenda',
    category: 'schedule',
    title: 'Reserve um momento da semana para revisar as lições concluídas',
    description: 'Revisar em blocos curtos ajuda a consolidar o conteúdo e aumenta a confiança na fala.',
    ctaLabel: 'Ver lições',
    ctaUrl: '/lessons',
    priority: 'low',
    pinned: false,
    published: true,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
  },
];

const normalizeNotices = (notices = []) => [...notices]
  .map((notice, index) => ({
    id: notice?.id || `notice-${Date.now()}-${index}`,
    tag: notice?.tag || 'Aviso',
    category: notice?.category || 'general',
    title: notice?.title || `Novo aviso ${index + 1}`,
    description: notice?.description || 'Atualize este aviso com uma mensagem importante para os alunos.',
    ctaLabel: notice?.ctaLabel || '',
    ctaUrl: notice?.ctaUrl || '',
    priority: ['low', 'normal', 'high'].includes(notice?.priority) ? notice.priority : 'normal',
    pinned: Boolean(notice?.pinned),
    published: notice?.published !== false,
    createdAt: notice?.createdAt || new Date().toISOString(),
    updatedAt: notice?.updatedAt || notice?.createdAt || new Date().toISOString(),
  }))
  .sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return Number(b.pinned) - Number(a.pinned);
    }

    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  });

const DEFAULT_FORUM_POSTS = [
  {
    id: 'forum-001',
    user: { id: 'student-001', name: 'Carlos Silva', role: 'STUDENT' },
    createdAt: hoursAgo(1),
    post: 'Olá! Alguém tem alguma dica para memorizar a conjugação dos verbos no pretérito imperfeito? Estou com um pouco de dificuldade.',
    likes: 12,
    likedBy: [],
    replies: [
      {
        id: 'reply-001',
        user: { id: 'teacher-001', name: 'Ana Pereira (Instrutora)', role: 'TEACHER' },
        createdAt: hoursAgo(0.75),
        post: '¡Hola, Carlos! Uma ótima dica é criar cartões de memória e praticar com frases do dia a dia. Isso ajuda bastante a fixar.',
        likes: 7,
        likedBy: [],
        isInstructor: true,
      },
      {
        id: 'reply-002',
        user: { id: 'student-002', name: 'Mariana Costa', role: 'STUDENT' },
        createdAt: hoursAgo(0.5),
        post: 'Flashcards funcionaram muito bem para mim também. Eu separo por tempo verbal e reviso por 10 minutos.',
        likes: 3,
        likedBy: [],
      },
    ],
  },
  {
    id: 'forum-002',
    user: { id: 'student-005', name: 'Lucas Mendes', role: 'STUDENT' },
    createdAt: hoursAgo(3),
    post: 'Alguém pode me explicar a diferença entre "muy" e "mucho"? Sempre me confundo ao montar frases.',
    likes: 5,
    likedBy: [],
    replies: [],
  },
];

const normalizeForumReplies = (replies = []) => [...replies]
  .map((reply, index) => ({
    id: reply?.id || `reply-${Date.now()}-${index}`,
    user: {
      id: reply?.user?.id || `user-${index}`,
      name: reply?.user?.name || 'Aluno ativo',
      role: reply?.user?.role || 'STUDENT',
    },
    createdAt: reply?.createdAt || new Date().toISOString(),
    post: reply?.post || '',
    likes: Number(reply?.likes || 0),
    likedBy: Array.isArray(reply?.likedBy) ? reply.likedBy : [],
    isInstructor: Boolean(reply?.isInstructor || ['TEACHER', 'ADMIN'].includes(reply?.user?.role)),
  }))
  .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

const normalizeForumPosts = (posts = []) => [...posts]
  .map((post, index) => ({
    id: post?.id || `forum-${Date.now()}-${index}`,
    user: {
      id: post?.user?.id || `user-${index}`,
      name: post?.user?.name || 'Aluno ativo',
      role: post?.user?.role || 'STUDENT',
    },
    createdAt: post?.createdAt || new Date().toISOString(),
    post: post?.post || '',
    likes: Number(post?.likes || 0),
    likedBy: Array.isArray(post?.likedBy) ? post.likedBy : [],
    isInstructor: Boolean(post?.isInstructor || ['TEACHER', 'ADMIN'].includes(post?.user?.role)),
    replies: normalizeForumReplies(post?.replies || []),
  }))
  .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

const DEFAULT_CONTACT_MESSAGES = [];

const normalizeContactMessages = (messages = []) => [...messages]
  .map((message, index) => ({
    id: message?.id || `contact-${Date.now()}-${index}`,
    userId: message?.userId || message?.email || `contact-user-${index}`,
    name: message?.name || 'Aluno',
    email: message?.email || '',
    category: message?.category || 'general',
    subject: message?.subject || 'Nova mensagem',
    message: message?.message || '',
    createdAt: message?.createdAt || new Date().toISOString(),
    status: message?.status || 'new',
  }))
  .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

const normalizePermissions = (permissions = {}) => {
  const merged = Object.entries(DEFAULT_PERMISSIONS).reduce((acc, [role, defaults]) => {
    acc[role] = {
      ...defaults,
      ...(permissions?.[role] || {}),
    };
    return acc;
  }, {});

  Object.entries(permissions || {}).forEach(([role, config]) => {
    if (!merged[role]) {
      merged[role] = config;
    }
  });

  return merged;
};

const DEFAULT_PERMISSIONS = {
  ADMIN: {
    name: 'Administrador',
    canEditProfile: true,
    canViewLessons: true,
    canSubmitWork: true,
    canAccessKids: true,
    canViewForum: true,
    canPostForum: true,
    canGradeWork: true,
    canManageStudents: true,
    canManagePermissions: true,
    canManageMaterials: true,
    canViewAnalytics: true,
  },
  TEACHER: {
    name: 'Professor',
    canEditProfile: true,
    canViewLessons: true,
    canSubmitWork: true,
    canAccessKids: true,
    canViewForum: true,
    canPostForum: true,
    canGradeWork: true,
    canManageStudents: true,
    canManagePermissions: false,
    canManageMaterials: false,
    canViewAnalytics: true,
  },
  STUDENT: {
    name: 'Estudante',
    canEditProfile: true,
    canViewLessons: true,
    canSubmitWork: true,
    canAccessKids: false,
    canViewForum: true,
    canPostForum: true,
    canGradeWork: false,
    canManageStudents: false,
    canManagePermissions: false,
    canManageMaterials: false,
    canViewAnalytics: false,
  },
  KIDS: {
    name: 'Criança',
    canEditProfile: false,
    canViewLessons: true,
    canSubmitWork: false,
    canAccessKids: true,
    canViewForum: false,
    canPostForum: false,
    canGradeWork: false,
    canManageStudents: false,
    canManagePermissions: false,
    canManageMaterials: false,
    canViewAnalytics: false,
  },
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const readStorage = (key, fallbackValue) => {
  if (!hasLocalStorage()) {
    return clone(fallbackValue);
  }

  const raw = localStorage.getItem(key);

  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallbackValue));
    return clone(fallbackValue);
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(key, JSON.stringify(fallbackValue));
    return clone(fallbackValue);
  }
};

const writeStorage = (key, value) => {
  if (hasLocalStorage()) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  return clone(value);
};

const ensureInitialized = () => {
  readStorage(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
  readStorage(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
  readStorage(STORAGE_KEYS.PERMISSIONS, DEFAULT_PERMISSIONS);
  readStorage(STORAGE_KEYS.MATERIALS, DEFAULT_MATERIALS);
  readStorage(STORAGE_KEYS.NOTICES, DEFAULT_NOTICES);
  readStorage(STORAGE_KEYS.FORUM_POSTS, DEFAULT_FORUM_POSTS);
  readStorage(STORAGE_KEYS.CONTACT_MESSAGES, DEFAULT_CONTACT_MESSAGES);
};

const sortByNewest = (items, dateKey) => [...items].sort(
  (a, b) => new Date(b[dateKey] || 0) - new Date(a[dateKey] || 0)
);

const readMaterialLessons = () => normalizeMaterialLessons(
  readStorage(STORAGE_KEYS.MATERIALS, DEFAULT_MATERIALS)
);

const writeMaterialLessons = (lessons) => writeStorage(
  STORAGE_KEYS.MATERIALS,
  normalizeMaterialLessons(lessons)
);

const readNoticeItems = () => normalizeNotices(
  readStorage(STORAGE_KEYS.NOTICES, DEFAULT_NOTICES)
);

const writeNoticeItems = (notices) => writeStorage(
  STORAGE_KEYS.NOTICES,
  normalizeNotices(notices)
);

const readForumPosts = () => normalizeForumPosts(
  readStorage(STORAGE_KEYS.FORUM_POSTS, DEFAULT_FORUM_POSTS)
);

const writeForumPosts = (posts) => writeStorage(
  STORAGE_KEYS.FORUM_POSTS,
  normalizeForumPosts(posts)
);

const readContactMessages = () => normalizeContactMessages(
  readStorage(STORAGE_KEYS.CONTACT_MESSAGES, DEFAULT_CONTACT_MESSAGES)
);

const writeContactMessages = (messages) => writeStorage(
  STORAGE_KEYS.CONTACT_MESSAGES,
  normalizeContactMessages(messages)
);

export const studentService = {
  getAll() {
    ensureInitialized();
    const students = readStorage(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
    return sortByNewest(students, 'createdAt');
  },

  getById(id) {
    return this.getAll().find((student) => String(student.id) === String(id)) || null;
  },

  create(studentData) {
    const students = this.getAll();
    const newStudent = {
      id: `student-${Date.now()}`,
      name: studentData?.name || 'Novo aluno',
      email: studentData?.email || 'novo@horizonteespanhol.com',
      role: studentData?.role || 'STUDENT',
      status: studentData?.status || 'pending',
      progress: Number(studentData?.progress || 0),
      createdAt: new Date().toISOString(),
      lastLogin: studentData?.lastLogin || null,
    };

    return writeStorage(STORAGE_KEYS.STUDENTS, [newStudent, ...students]);
  },

  update(id, updates) {
    const students = this.getAll();
    const updatedStudents = students.map((student) => (
      String(student.id) === String(id)
        ? { ...student, ...updates }
        : student
    ));

    writeStorage(STORAGE_KEYS.STUDENTS, updatedStudents);
    return updatedStudents.find((student) => String(student.id) === String(id)) || null;
  },

  activate(id) {
    return this.update(id, { status: 'active', lastLogin: new Date().toISOString() });
  },

  deactivate(id) {
    return this.update(id, { status: 'inactive' });
  },

  delete(id) {
    const students = this.getAll().filter((student) => String(student.id) !== String(id));
    writeStorage(STORAGE_KEYS.STUDENTS, students);

    const activities = activityService.getAll().filter((activity) => String(activity.studentId) !== String(id));
    writeStorage(STORAGE_KEYS.ACTIVITIES, activities);

    return students;
  },

  updateRole(id, role) {
    return this.update(id, { role });
  },

  getMetrics() {
    const students = this.getAll();
    return {
      total: students.length,
      active: students.filter((student) => student.status === 'active').length,
      pending: students.filter((student) => student.status === 'pending').length,
      inactive: students.filter((student) => student.status === 'inactive').length,
    };
  },
};

export const activityService = {
  getAll() {
    ensureInitialized();
    const activities = readStorage(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
    return sortByNewest(activities, 'timestamp');
  },

  getByStudent(studentId) {
    return this.getAll().filter((activity) => String(activity.studentId) === String(studentId));
  },

  add(activityData) {
    const student = studentService.getById(activityData?.studentId);
    const newActivity = {
      id: `activity-${Date.now()}`,
      studentId: activityData?.studentId || 'unknown',
      studentName: activityData?.studentName || student?.name || 'Aluno',
      type: activityData?.type || 'activity',
      activity: activityData?.activity || 'Nova atividade registrada.',
      timestamp: activityData?.timestamp || new Date().toISOString(),
    };

    const activities = this.getAll();
    writeStorage(STORAGE_KEYS.ACTIVITIES, [newActivity, ...activities]);
    return newActivity;
  },

  getRecent(limit = 10) {
    return this.getAll().slice(0, limit);
  },

  getByType(type) {
    return this.getAll().filter((activity) => activity.type === type);
  },

  getStudentInteractionCount(studentId) {
    return this.getByStudent(studentId).length;
  },
};

export const materialService = {
  getAll() {
    ensureInitialized();
    return readMaterialLessons();
  },

  getById(id) {
    return this.getAll().find((lesson) => String(lesson.id) === String(id)) || null;
  },

  createLesson(lessonData = {}) {
    const lessons = this.getAll();
    const highestNumericId = lessons.reduce((max, lesson) => {
      const lessonId = Number(lesson.id);
      return Number.isFinite(lessonId) ? Math.max(max, lessonId) : max;
    }, 0);
    const nextOrderIndex = lessons.reduce((max, lesson) => Math.max(max, Number(lesson.orderIndex || 0)), 0) + 1;
    const title = lessonData.title || `Nova aula ${nextOrderIndex}`;
    const slugBase = slugify(title) || `nova-aula-${nextOrderIndex}`;

    const newLesson = normalizeMaterialLessons([
      {
        id: highestNumericId + 1,
        slug: `${lessonData.courseSlug || 'admin'}-${slugBase}`,
        title,
        shortSummary: lessonData.shortSummary || `Conteúdo criado pelo administrador para ${title}.`,
        fullSummary: lessonData.fullSummary || `Conteúdo completo de ${title}.`,
        description: lessonData.shortSummary || `Material complementar de ${title}.`,
        image: lessonData.image || 'https://placehold.co/600x400',
        videoUrl: lessonData.videoUrl || 'https://www.youtube.com/embed/hjDbeP-4h5Y',
        slides: lessonData.slides || [
          { title: 'Objetivo', content: 'Defina aqui o objetivo da nova lição.' },
          { title: 'Conteúdo', content: 'Atualize este bloco com o conteúdo principal.' },
        ],
        resources: lessonData.resources || [],
        quiz: lessonData.quiz || { title: `Quiz ${lessonData.level || 'A1'}`, questions: [] },
        listeningExercise: lessonData.listeningExercise || { audioUrl: '#', questions: [] },
        isFree: Boolean(lessonData.isFree),
        moduleId: lessonData.moduleId ?? 0,
        orderIndex: nextOrderIndex,
        level: lessonData.level || 'A1',
        courseSlug: lessonData.courseSlug || 'admin',
        audience: 'adult',
      },
    ])[0];

    writeMaterialLessons([...lessons, newLesson]);
    return newLesson;
  },

  updateLesson(id, updates) {
    const lessons = this.getAll();
    const updatedLessons = lessons.map((lesson) => (
      String(lesson.id) === String(id)
        ? { ...lesson, ...updates }
        : lesson
    ));

    writeMaterialLessons(updatedLessons);
    return updatedLessons.find((lesson) => String(lesson.id) === String(id)) || null;
  },

  deleteLesson(id) {
    const nextLessons = this.getAll().filter((lesson) => String(lesson.id) !== String(id));
    writeMaterialLessons(nextLessons);
    return nextLessons;
  },

  addResource(lessonId, resourceData = {}) {
    const lesson = this.getById(lessonId);

    if (!lesson) {
      return null;
    }

    return this.updateLesson(lessonId, {
      resources: [
        ...(lesson.resources ?? []),
        {
          id: `resource-${lesson.id}-${Date.now()}`,
          name: resourceData.name || `Material ${(lesson.resources?.length ?? 0) + 1}`,
          url: resourceData.url || '#',
        },
      ],
    });
  },

  removeResource(lessonId, resourceId) {
    const lesson = this.getById(lessonId);

    if (!lesson) {
      return null;
    }

    return this.updateLesson(lessonId, {
      resources: (lesson.resources ?? []).filter((resource) => String(resource.id) !== String(resourceId)),
    });
  },

  getMetrics() {
    const lessons = this.getAll();

    return {
      totalLessons: lessons.length,
      totalResources: lessons.reduce((count, lesson) => count + (lesson.resources?.length ?? 0), 0),
      freeLessons: lessons.filter((lesson) => lesson.isFree).length,
      premiumLessons: lessons.filter((lesson) => !lesson.isFree).length,
    };
  },
};

export const noticeBoardService = {
  getAll() {
    ensureInitialized();
    return readNoticeItems();
  },

  getPublished() {
    return this.getAll().filter((notice) => notice.published);
  },

  getById(id) {
    return this.getAll().find((notice) => String(notice.id) === String(id)) || null;
  },

  create(noticeData = {}) {
    const notices = this.getAll();
    const timestamp = new Date().toISOString();
    const newNotice = normalizeNotices([
      {
        id: noticeData.id || `notice-${Date.now()}`,
        title: noticeData.title || 'Novo aviso',
        description: noticeData.description || 'Mensagem publicada pela administração.',
        tag: noticeData.tag || 'Aviso',
        category: noticeData.category || 'general',
        ctaLabel: noticeData.ctaLabel || '',
        ctaUrl: noticeData.ctaUrl || '',
        priority: noticeData.priority || 'normal',
        pinned: Boolean(noticeData.pinned),
        published: noticeData.published !== false,
        createdAt: noticeData.createdAt || timestamp,
        updatedAt: timestamp,
      },
    ])[0];

    writeNoticeItems([newNotice, ...notices]);
    return newNotice;
  },

  update(id, updates = {}) {
    const notices = this.getAll();
    const updatedNotices = notices.map((notice) => (
      String(notice.id) === String(id)
        ? normalizeNotices([{ ...notice, ...updates, updatedAt: new Date().toISOString() }])[0]
        : notice
    ));

    writeNoticeItems(updatedNotices);
    return updatedNotices.find((notice) => String(notice.id) === String(id)) || null;
  },

  remove(id) {
    const nextNotices = this.getAll().filter((notice) => String(notice.id) !== String(id));
    writeNoticeItems(nextNotices);
    return nextNotices;
  },

  togglePublished(id) {
    const notice = this.getById(id);

    if (!notice) {
      return null;
    }

    return this.update(id, { published: !notice.published });
  },

  getMetrics() {
    const notices = this.getAll();

    return {
      total: notices.length,
      published: notices.filter((notice) => notice.published).length,
      pinned: notices.filter((notice) => notice.pinned).length,
      resourceUpdates: notices.filter((notice) => notice.category === 'resource').length,
    };
  },
};

export const forumService = {
  getAll() {
    ensureInitialized();
    return readForumPosts();
  },

  createPost(postData = {}) {
    const posts = this.getAll();
    const newPost = normalizeForumPosts([
      {
        id: `forum-${Date.now()}`,
        user: {
          id: postData?.user?.id || postData?.user?.email || `forum-user-${Date.now()}`,
          name: postData?.user?.name || 'Aluno ativo',
          role: postData?.user?.role || 'STUDENT',
        },
        createdAt: new Date().toISOString(),
        post: postData?.message || postData?.post || '',
        likes: 0,
        likedBy: [],
        isInstructor: ['TEACHER', 'ADMIN'].includes(postData?.user?.role),
        replies: [],
      },
    ])[0];

    writeForumPosts([newPost, ...posts]);
    return newPost;
  },

  addReply(postId, replyData = {}) {
    const posts = this.getAll();
    const nextPosts = posts.map((post) => {
      if (String(post.id) !== String(postId)) {
        return post;
      }

      const newReply = normalizeForumReplies([
        {
          id: `reply-${Date.now()}`,
          user: {
            id: replyData?.user?.id || replyData?.user?.email || `forum-reply-${Date.now()}`,
            name: replyData?.user?.name || 'Aluno ativo',
            role: replyData?.user?.role || 'STUDENT',
          },
          createdAt: new Date().toISOString(),
          post: replyData?.message || replyData?.post || '',
          likes: 0,
          likedBy: [],
          isInstructor: ['TEACHER', 'ADMIN'].includes(replyData?.user?.role),
        },
      ])[0];

      return {
        ...post,
        replies: [...(post.replies || []), newReply],
      };
    });

    writeForumPosts(nextPosts);
    return nextPosts.find((post) => String(post.id) === String(postId)) || null;
  },

  toggleLike(postId, actorId, replyId = null) {
    if (!actorId) {
      return null;
    }

    const posts = this.getAll();
    const nextPosts = posts.map((post) => {
      if (String(post.id) !== String(postId)) {
        return post;
      }

      if (replyId) {
        return {
          ...post,
          replies: (post.replies || []).map((reply) => {
            if (String(reply.id) !== String(replyId)) {
              return reply;
            }

            const likedBy = Array.isArray(reply.likedBy) ? [...reply.likedBy] : [];
            const alreadyLiked = likedBy.includes(actorId);

            return {
              ...reply,
              likedBy: alreadyLiked ? likedBy.filter((id) => id !== actorId) : [...likedBy, actorId],
              likes: alreadyLiked ? Math.max(0, Number(reply.likes || 0) - 1) : Number(reply.likes || 0) + 1,
            };
          }),
        };
      }

      const likedBy = Array.isArray(post.likedBy) ? [...post.likedBy] : [];
      const alreadyLiked = likedBy.includes(actorId);

      return {
        ...post,
        likedBy: alreadyLiked ? likedBy.filter((id) => id !== actorId) : [...likedBy, actorId],
        likes: alreadyLiked ? Math.max(0, Number(post.likes || 0) - 1) : Number(post.likes || 0) + 1,
      };
    });

    writeForumPosts(nextPosts);
    return nextPosts.find((post) => String(post.id) === String(postId)) || null;
  },
};

export const contactMessageService = {
  getAll() {
    ensureInitialized();
    return readContactMessages();
  },

  create(messageData = {}) {
    const messages = this.getAll();
    const newMessage = normalizeContactMessages([
      {
        id: `contact-${Date.now()}`,
        userId: messageData?.userId || messageData?.email || `contact-user-${Date.now()}`,
        name: messageData?.name || 'Aluno',
        email: messageData?.email || '',
        category: messageData?.category || 'general',
        subject: messageData?.subject || 'Nova mensagem',
        message: messageData?.message || '',
        createdAt: new Date().toISOString(),
        status: 'new',
      },
    ])[0];

    writeContactMessages([newMessage, ...messages]);
    return newMessage;
  },
};

export const permissionService = {
  getAll() {
    ensureInitialized();
    const permissions = normalizePermissions(readStorage(STORAGE_KEYS.PERMISSIONS, DEFAULT_PERMISSIONS));
    writeStorage(STORAGE_KEYS.PERMISSIONS, permissions);
    return permissions;
  },

  getByRole(role) {
    const permissions = this.getAll();
    return permissions[role] || null;
  },

  update(role, updatedPermissions) {
    const permissions = this.getAll();

    if (!permissions[role]) {
      return null;
    }

    permissions[role] = {
      ...permissions[role],
      ...updatedPermissions,
    };

    writeStorage(STORAGE_KEYS.PERMISSIONS, permissions);
    return permissions[role];
  },

  hasPermission(role, permissionKey) {
    return Boolean(this.getByRole(role)?.[permissionKey]);
  },

  getAllRoles() {
    return Object.keys(this.getAll());
  },
};

if (hasLocalStorage()) {
  ensureInitialized();
}

export default {
  studentService,
  activityService,
  materialService,
  noticeBoardService,
  forumService,
  contactMessageService,
  permissionService,
};