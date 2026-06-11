const createId = (() => {
  let count = 0;
  return (prefix = 'id') => `${prefix}-${++count}`;
})();

let lessonIdCounter = 0;

const adultQuestionBank = [
  {
    question: "Qual a tradução de 'Hola'?",
    options: ['Tchau', 'Oi', 'Obrigado', 'Por favor'],
    correctAnswer: 'Oi',
    correct: 'Exato!',
    incorrect: "Quase! É 'Oi'.",
  },
  {
    question: "O verbo 'ser' é usado para:",
    options: ['Temporário', 'Permanente', 'Ações', 'Desejos'],
    correctAnswer: 'Permanente',
    correct: 'Isso mesmo!',
    incorrect: 'É para características permanentes.',
  },
];

const kidsQuestionBank = [
  {
    question: 'Como se diz "sim" em espanhol?',
    options: ['Sí', 'No', 'Hola'],
    correctAnswer: 'Sí',
    correct: 'Muito bem!',
    incorrect: 'Tente novamente. A resposta certa é "Sí".',
  },
];

const createQuestion = ({ question, options, correctAnswer, correct, incorrect }) => ({
  id: createId('q'),
  question,
  options,
  correctAnswer,
  feedback: { correct, incorrect },
  correctFeedback: correct,
  incorrectFeedback: incorrect,
});

const generateQuizQuestions = (count, audience = 'adult') => {
  const bank = audience === 'kids' ? kidsQuestionBank : adultQuestionBank;
  return Array.from({ length: count }, (_, index) => createQuestion(bank[index % bank.length]));
};

const buildListeningExercise = (audience = 'adult') => {
  if (audience === 'kids') {
    return {
      audioUrl: '#',
      questions: [],
    };
  }
  return {
    audioUrl: 'https://placehold.co/audio.mp3',
    questions: [
      createQuestion({
        question: 'O que foi dito no áudio?',
        options: ['Saudação', 'Despedida', 'Pergunta'],
        correctAnswer: 'Saudação',
        correct: 'Boa escuta!',
        incorrect: 'Escute mais uma vez e tente novamente.',
      }),
    ],
  };
};

const getModuleId = (index, total) => Math.min(5, Math.floor(index / Math.ceil(total / 6)));

const a1LessonMeta = [
  { slug: 'a1-01-alfabeto', title: 'El Alfabeto' },
  { slug: 'a1-02-sustantivos', title: 'Los Sustantivos' },
  { slug: 'a1-03-adjetivos', title: 'Los Adjetivos' },
  { slug: 'a1-04-verbos', title: 'Verbos y Pronombres' },
  { slug: 'a1-05-adverbios', title: 'Los Adverbios' },
  { slug: 'a1-06-preguntas', title: 'Preguntas y Números' },
  { slug: 'a1-07-dialogando', title: 'Dialogando' },
  { slug: 'a1-08-mundo', title: 'El Español en el Mundo' },
  { slug: 'a1-09-saludos', title: 'Saludos y Despedidas' },
  { slug: 'a1-10-perfil', title: 'Mi Perfil Personal' },
  { slug: 'a1-11-rutina', title: 'Mi Rutina Diaria' },
  { slug: 'a1-12-presente', title: 'Más Allá de la Rutina' },
  { slug: 'a1-13-vives', title: '¿Dónde Vives?' },
  { slug: 'a1-14-tiempo', title: '¿Qué Tiempo Hace?' },
  { slug: 'a1-15-restaurante', title: 'En el Restaurante' },
  { slug: 'a1-16-practiquemos', title: 'Practiquemos' },
  { slug: 'a1-17-cocina', title: 'La Cocina Latinoamericana' },
  { slug: 'a1-18-comprar', title: '¡A Comprar!' },
  { slug: 'a1-19-telefono', title: 'Comunicación por Teléfono' },
  { slug: 'a1-20-planes', title: 'Haciendo Planes' },
  { slug: 'a1-21-imperativo', title: 'El Imperativo' },
  { slug: 'a1-22-presente-indicativo', title: 'Presente del Indicativo' },
  { slug: 'a1-23-gerundio', title: 'Estar + Gerundio' },
  { slug: 'a1-24-perfecto', title: 'Pretérito Perfecto' },
  { slug: 'a1-25-subjuntivo', title: 'Presente de Subjuntivo' },
  { slug: 'a1-26-cuatro-presentes', title: 'Los Cuatro Presentes' },
  { slug: 'a1-27-continuamos', title: 'Continuamos recorriendo' },
  { slug: 'a1-28-bariloche', title: 'Lectura: Bariloche' },
  { slug: 'a1-29-tito', title: 'Conversación con Tito' },
  { slug: 'a1-30-preparacion', title: 'Preparación para el Éxito' },
  { slug: 'a1-31-expresion', title: 'Expresión y Conversación' },
  { slug: 'a1-32-proyecto-final', title: 'Proyecto Final A1' },
];

const generateLessons = (levelSlug, count, lessonMeta = []) => {
  const levelLabel = levelSlug.toUpperCase();
  return Array.from({ length: count }, (_, index) => {
    const lessonNum = index + 1;
    const meta = lessonMeta[index] ?? {
      slug: `${levelSlug}-l${lessonNum}`,
      title: `Aula ${lessonNum}: Fundamentos`,
    };
    return {
      id: ++lessonIdCounter,
      slug: meta.slug,
      title: meta.title,
      shortSummary: `Introdução ao tópico ${lessonNum} do nível ${levelLabel}.`,
      fullSummary: `Resumo da aula ${lessonNum} do nível ${levelLabel}. Estude os conceitos e pratique o vocabulário.`,
      image: 'https://placehold.co/600x400',
      videoUrl: 'https://www.youtube.com/embed/hjDbeP-4h5Y',
      slides: [
        { title: 'Slide 1', content: `Visão geral da aula ${lessonNum}.` },
        { title: 'Vocabulário', content: 'Palavras-chave e expressões úteis.' },
        { title: 'Prática', content: 'Atividade guiada para fixação.' },
      ],
      resources: [{ name: `PDF da Aula ${lessonNum}`, url: '#' }],
      quiz: {
        title: `Quiz ${levelLabel}`,
        questions: generateQuizQuestions(2),
      },
      listeningExercise: buildListeningExercise(),
      isFree: levelSlug === 'a1' && lessonNum <= 5,
      moduleId: getModuleId(index, count),
      orderIndex: lessonNum,
      level: levelLabel,
      courseSlug: levelSlug,
      audience: 'adult',
    };
  });
};

const buildEvaluations = (courseSlug, lessonCount) => [
  {
    title: 'Avaliação de Módulo 1 (Aula 9)',
    status: 'Liberada',
    slug: `${courseSlug}-eval1`,
    requiredLesson: Math.min(9, lessonCount),
  },
  {
    title: `Avaliação de Módulo 2 (Aula ${Math.min(18, lessonCount)})`,
    status: 'Bloqueada',
    slug: `${courseSlug}-eval2`,
    requiredLesson: Math.min(18, lessonCount),
  },
  {
    title: `Avaliação Final (Aula ${lessonCount})`,
    status: 'Bloqueada',
    slug: `${courseSlug}-eval3`,
    requiredLesson: lessonCount,
  },
];

export const courses = [
  { level: 'A1', slug: 'a1', title: 'Iniciante', lessons: generateLessons('a1', 32, a1LessonMeta) },
  { level: 'A2', slug: 'a2', title: 'Básico', lessons: generateLessons('a2', 32) },
  { level: 'B1', slug: 'b1', title: 'Intermediário', lessons: generateLessons('b1', 32) },
  { level: 'B2', slug: 'b2', title: 'Int. Avançado', lessons: generateLessons('b2', 32) },
  { level: 'C1', slug: 'c1', title: 'Avançado', lessons: generateLessons('c1', 32) },
  { level: 'C2', slug: 'c2', title: 'Fluente', lessons: generateLessons('c2', 32) },
].map((course) => ({
  ...course,
  evaluations: buildEvaluations(course.slug, course.lessons.length),
}));

const generateKidsLessons = (levelSlug, count) => {
  return Array.from({ length: count }, (_, index) => {
    const lessonNum = index + 1;
    return {
      id: ++lessonIdCounter,
      slug: `${levelSlug}-l${lessonNum}`,
      title: `Aventura ${lessonNum}`,
      shortSummary: `Uma aventura divertida ${lessonNum}.`,
      fullSummary: 'Vamos brincar e aprender espanhol!',
      image: 'https://placehold.co/600x400',
      videoUrl: 'https://www.youtube.com/embed/6kgJ66n_mB4',
      slides: [{ title: 'Slide', content: 'Infantil' }],
      resources: [{ name: 'Colorir', url: '#' }],
      quiz: {
        title: 'Jogos',
        questions: generateQuizQuestions(1, 'kids'),
      },
      listeningExercise: buildListeningExercise('kids'),
      isFree: true,
      moduleId: getModuleId(index, count),
      orderIndex: lessonNum,
      level: levelSlug.replace('kids-', ''),
      courseSlug: levelSlug,
      audience: 'kids',
    };
  });
};

export const kidsCourses = [
  { level: '1', slug: 'kids-1', title: 'Aventura 1', lessons: generateKidsLessons('kids-1', 29) },
  { level: '2', slug: 'kids-2', title: 'Aventura 2', lessons: generateKidsLessons('kids-2', 29) },
  { level: '3', slug: 'kids-3', title: 'Aventura 3', lessons: generateKidsLessons('kids-3', 29) },
];

export const lessons = courses.flatMap((course) => course.lessons);
export const allLessons = [...lessons, ...kidsCourses.flatMap((course) => course.lessons)];

export const defaultUserProgress = {
  completedLessons: lessons.slice(0, 5).map((lesson) => lesson.id),
  currentLesson: lessons[5]?.id ?? lessons[0]?.id ?? 1,
};

// ============================================
// FUNÇÕES ADICIONADAS PARA GERENCIAMENTO DE PROGRESSO
// ============================================

export const getUserProgress = () => {
  const saved = localStorage.getItem('completed_lessons');
  const completedLessons = saved ? JSON.parse(saved) : [...defaultUserProgress.completedLessons];
  
  // Calcular progresso percentual
  const totalLessons = lessons.length;
  const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  
  // Determinar lição atual (primeira não completada)
  const currentLesson = lessons.find(lesson => !completedLessons.includes(lesson.id))?.id ?? lessons[0]?.id ?? 1;
  
  return {
    completedLessons,
    currentLesson,
    progress
  };
};

export const saveCompletedLesson = (lessonId) => {
  const completed = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem('completed_lessons', JSON.stringify(completed));
    
    // Atualizar percentual de progresso
    const totalLessons = lessons.length;
    const progress = Math.round((completed.length / totalLessons) * 100);
    localStorage.setItem('user_progress_percentage', progress.toString());
  }
  return completed;
};

export const updateUserProgress = () => {
  const completed = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
  const totalLessons = lessons.length;
  const progress = totalLessons > 0 ? Math.round((completed.length / totalLessons) * 100) : 0;
  const currentLesson = lessons.find(lesson => !completed.includes(lesson.id))?.id ?? lessons[0]?.id ?? 1;
  
  localStorage.setItem('user_progress_percentage', progress.toString());
  
  return { 
    completedLessons: completed, 
    currentLesson,
    progress 
  };
};

export const resetUserProgress = () => {
  localStorage.removeItem('completed_lessons');
  localStorage.removeItem('user_progress_percentage');
  return getUserProgress();
};

// Função para obter estatísticas do usuário
export const getUserStats = () => {
  const { completedLessons, progress } = getUserProgress();
  const totalLessons = lessons.length;
  const remainingLessons = totalLessons - completedLessons.length;
  
  // Calcular tempo total estimado de estudo (25 min por lição)
  const estimatedStudyTime = completedLessons.length * 25;
  
  return {
    totalLessons,
    completedLessons: completedLessons.length,
    remainingLessons,
    progress,
    estimatedStudyTime,
    currentLevel: getCurrentLevel(completedLessons)
  };
};

// Função auxiliar para determinar nível atual baseado no progresso
const getCurrentLevel = (completedLessons) => {
  const levelThresholds = [
    { level: 'C2', required: 192 },  // 192 lições (6 níveis x 32)
    { level: 'C1', required: 160 },
    { level: 'B2', required: 128 },
    { level: 'B1', required: 96 },
    { level: 'A2', required: 64 },
    { level: 'A1', required: 32 },
    { level: 'Iniciante', required: 0 }
  ];
  
  for (const threshold of levelThresholds) {
    if (completedLessons.length >= threshold.required) {
      return threshold.level;
    }
  }
  return 'A1';
};

// Exportação padrão com todos os serviços
export default {
  courses,
  kidsCourses,
  lessons,
  allLessons,
  defaultUserProgress,
  getUserProgress,
  saveCompletedLesson,
  updateUserProgress,
  resetUserProgress,
  getUserStats
};