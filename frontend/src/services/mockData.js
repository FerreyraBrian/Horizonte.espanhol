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
  {
    question: "'Estar' expressa principalmente:",
    options: ['Profissão', 'Localização', 'Nacionalidade', 'Idade'],
    correctAnswer: 'Localização',
    correct: 'Perfeito!',
    incorrect: 'Estar é utilizado para indicar localização e estado temporário.',
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

const lessonContentByLevel = {
  a1: {
    objectives: ['Reconhecer o alfabeto e a pronúncia inicial.', 'Praticar vocabulário básico.', 'Aplicar estruturas simples em frases curtas.'],
    vocabulary: ['Hola', 'Buenos días', 'Amigo', 'Escuela'],
    grammarFocus: 'Presente simples e frases básicas de identificação.',
  },
  a2: {
    objectives: ['Descrever rotinas e preferências.', 'Falar sobre passado recente.', 'Expressar planos simples.'],
    vocabulary: ['Siempre', 'A veces', 'Porque', 'Viajar'],
    grammarFocus: 'Presente, pretérito próximo e conectores básicos.',
  },
  b1: {
    objectives: ['Argumentar ideias com clareza.', 'Narrar experiências com mais detalhe.', 'Expressar opinião e contraste.'],
    vocabulary: ['Sin embargo', 'Por un lado', 'Aunque', 'Consejo'],
    grammarFocus: 'Conectores discursivos, pretérito e subjuntivo introdutório.',
  },
  b2: {
    objectives: ['Debater temas abstratos.', 'Organizar argumentos com coesão.', 'Usar registro mais formal.'],
    vocabulary: ['Asimismo', 'Por consiguiente', 'Aun así', 'Perspectiva'],
    grammarFocus: 'Subjuntivo, estruturas condicionais e discurso formal.',
  },
  c1: {
    objectives: ['Produzir textos ricos e precisos.', 'Adaptar o registro conforme o contexto.', 'Interpretar nuances e implicações.'],
    vocabulary: ['En efecto', 'Por ende', 'Matizar', 'Perspicaz'],
    grammarFocus: 'Registros, nuance e estruturas complexas.',
  },
  c2: {
    objectives: ['Comunicar com naturalidade e precisão.', 'Usar expressão idiomática e refinada.', 'Sustentar opiniões com sofisticação.'],
    vocabulary: ['Sutileza', 'Matiz', 'Esbozar', 'Refinar'],
    grammarFocus: 'Estilo, precisão léxica e produção fluida.',
  },
};

const buildLessonContent = (levelSlug, lessonNum) => {
  const levelKey = levelSlug.toLowerCase();
  const base = lessonContentByLevel[levelKey] || lessonContentByLevel.a1;
  const titleSuffix = lessonNum % 2 === 0 ? 'Prática guiada' : 'Exploração ativa';
  return {
    objectives: base.objectives,
    vocabulary: base.vocabulary.slice(0, 3).concat([`Tema ${lessonNum}`]),
    grammarFocus: `${base.grammarFocus} — ${titleSuffix}`,
  };
};

const createLessonTemplate = ({ levelSlug, lessonNum, lessonMeta = [], index = 0, audience = 'adult' }) => {
  const levelLabel = levelSlug.toUpperCase();
  const meta = lessonMeta[index] ?? {
    slug: `${levelSlug}-l${lessonNum}`,
    title: `Aula ${lessonNum}: Fundamentos`,
  };
  const content = buildLessonContent(levelSlug, lessonNum);

  return {
    id: 0,
    slug: meta.slug,
    title: meta.title,
    shortSummary: `Introdução ao tópico ${lessonNum} do nível ${levelLabel}.`,
    fullSummary: `Resumo da aula ${lessonNum} do nível ${levelLabel}. Estude os conceitos e pratique o vocabulário.`,
    image: 'https://placehold.co/600x400',
    videoUrl: audience === 'kids'
      ? 'https://www.youtube.com/embed/6kgJ66n_mB4'
      : 'https://www.youtube.com/embed/hjDbeP-4h5Y',
    slides: audience === 'kids'
      ? [{ title: 'Slide', content: 'Infantil' }]
      : [
          { title: 'Slide 1', content: `Visão geral da aula ${lessonNum}.` },
          { title: 'Vocabulário', content: `Palavras-chave e expressões úteis para a aula ${lessonNum}.` },
          { title: 'Prática', content: 'Atividade guiada para fixação e uso contextual.' },
        ],
    resources: audience === 'kids'
      ? [{ name: 'Colorir', url: '#' }]
      : [{ name: `PDF da Aula ${lessonNum}`, url: '#' }],
    quiz: {
      title: audience === 'kids' ? 'Jogos' : `Quiz ${levelLabel}`,
      questions: generateQuizQuestions(audience === 'kids' ? 1 : 3, audience),
    },
    listeningExercise: buildListeningExercise(audience),
    objectives: content.objectives,
    vocabulary: content.vocabulary,
    grammarFocus: content.grammarFocus,
    isFree: levelSlug === 'a1' && lessonNum <= 5,
    moduleId: getModuleId(index, 32),
    orderIndex: lessonNum,
    level: levelLabel,
    courseSlug: levelSlug,
    audience,
  };
};

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

const a2LessonMeta = [
  { slug: 'a2-01-ampliando', title: 'Ampliando Vocabulario' },
  { slug: 'a2-02-familia', title: 'La Familia' },
  { slug: 'a2-03-profesiones', title: 'Profesiones y Trabajos' },
  { slug: 'a2-04-descripciones', title: 'Describiendo Personas' },
  { slug: 'a2-05-pasado', title: 'Introducción al Pasado' },
  { slug: 'a2-06-pretérito', title: 'Pretérito Indefinido' },
  { slug: 'a2-07-comparativas', title: 'Estructuras Comparativas' },
  { slug: 'a2-08-superlativos', title: 'Superlativos' },
  { slug: 'a2-09-casa', title: 'Mi Casa' },
  { slug: 'a2-10-ciudad', title: 'La Ciudad' },
  { slug: 'a2-11-transporte', title: 'Medios de Transporte' },
  { slug: 'a2-12-direcciones', title: 'Dando Direcciones' },
  { slug: 'a2-13-comida', title: 'Comida y Bebida' },
  { slug: 'a2-14-recetas', title: 'Siguiendo Recetas' },
  { slug: 'a2-15-compras', title: 'De Compras' },
  { slug: 'a2-16-dinero', title: 'Dinero y Precios' },
  { slug: 'a2-17-tiempo-clima', title: 'Tiempo y Clima' },
  { slug: 'a2-18-vacaciones', title: 'Planeando Vacaciones' },
  { slug: 'a2-19-viajes', title: 'Experiencias de Viaje' },
  { slug: 'a2-20-deportes', title: 'Deportes y Ocio' },
  { slug: 'a2-21-cine', title: 'Cine y Entretenimiento' },
  { slug: 'a2-22-musica', title: 'Música y Arte' },
  { slug: 'a2-23-salud', title: 'Salud y Bienestar' },
  { slug: 'a2-24-medico', title: 'Yendo al Médico' },
  { slug: 'a2-25-emociones', title: 'Expresando Emociones' },
  { slug: 'a2-26-preferencias', title: 'Gustos y Preferencias' },
  { slug: 'a2-27-futuro', title: 'Futuro Simple' },
  { slug: 'a2-28-planes-futuros', title: 'Planes para el Futuro' },
  { slug: 'a2-29-tecnologia', title: 'Tecnología' },
  { slug: 'a2-30-revision', title: 'Revisión Integral' },
  { slug: 'a2-31-conversacion', title: 'Diálogos Prácticos' },
  { slug: 'a2-32-proyecto-final', title: 'Proyecto Final A2' },
];

const b1LessonMeta = [
  { slug: 'b1-01-conectores', title: 'Conectores Discursivos' },
  { slug: 'b1-02-argumentacion', title: 'Argumentación Básica' },
  { slug: 'b1-03-opinion', title: 'Expresando Opiniones' },
  { slug: 'b1-04-acuerdo', title: 'Acuerdo y Desacuerdo' },
  { slug: 'b1-05-narrativa', title: 'Narrativa en Pasado' },
  { slug: 'b1-06-condicionales', title: 'Oraciones Condicionales' },
  { slug: 'b1-07-hipotesis', title: 'Hipótesis y Suposiciones' },
  { slug: 'b1-08-subjuntivo', title: 'Subjuntivo Presente' },
  { slug: 'b1-09-cultura', title: 'Culturas Hispanohablantes' },
  { slug: 'b1-10-tradiciones', title: 'Tradiciones y Celebraciones' },
  { slug: 'b1-11-sociedad', title: 'Temas Sociales' },
  { slug: 'b1-12-problemas', title: 'Problemas Contemporáneos' },
  { slug: 'b1-13-literatura', title: 'Literatura Española' },
  { slug: 'b1-14-autores', title: 'Autores Latinoamericanos' },
  { slug: 'b1-15-cine-film', title: 'Cine Hispano' },
  { slug: 'b1-16-critica', title: 'Análisis Crítico' },
  { slug: 'b1-17-historia', title: 'Historia de España' },
  { slug: 'b1-18-geografia', title: 'Geografía de América Latina' },
  { slug: 'b1-19-economia', title: 'Economía y Comercio' },
  { slug: 'b1-20-trabajo', title: 'Mundo Laboral' },
  { slug: 'b1-21-emprendimiento', title: 'Emprendimiento' },
  { slug: 'b1-22-educacion', title: 'Sistemas Educativos' },
  { slug: 'b1-23-medios', title: 'Medios de Comunicación' },
  { slug: 'b1-24-publicidad', title: 'Publicidad y Marketing' },
  { slug: 'b1-25-ambiente', title: 'Cuestiones Ambientales' },
  { slug: 'b1-26-sostenibilidad', title: 'Desarrollo Sostenible' },
  { slug: 'b1-27-tecnologia-moderna', title: 'Tecnología Moderna' },
  { slug: 'b1-28-redes-sociales', title: 'Redes Sociales' },
  { slug: 'b1-29-debate', title: 'Debates Estructurados' },
  { slug: 'b1-30-presentacion', title: 'Presentaciones Orales' },
  { slug: 'b1-31-escritura', title: 'Escritura Formal' },
  { slug: 'b1-32-proyecto-final', title: 'Proyecto Final B1' },
];

const b2LessonMeta = [
  { slug: 'b2-01-lenguaje', title: 'Matices del Lenguaje' },
  { slug: 'b2-02-estilo', title: 'Estilos Retóricos' },
  { slug: 'b2-03-textos', title: 'Análisis de Textos' },
  { slug: 'b2-04-escritura-avanzada', title: 'Escritura Avanzada' },
  { slug: 'b2-05-expresion-compleja', title: 'Expresión Compleja' },
  { slug: 'b2-06-registro', title: 'Registro Formal e Informal' },
  { slug: 'b2-07-pragmatica', title: 'Pragmática del Lenguaje' },
  { slug: 'b2-08-idiomatismos', title: 'Expresiones Idiomáticas' },
  { slug: 'b2-09-literatura-especializada', title: 'Literatura Especializada' },
  { slug: 'b2-10-poesia', title: 'Poesía Hispana' },
  { slug: 'b2-11-ensayo', title: 'Ensayo Filosófico' },
  { slug: 'b2-12-periodismo', title: 'Periodismo de Opinión' },
  { slug: 'b2-13-ciencia', title: 'Lenguaje Científico' },
  { slug: 'b2-14-tecnologia-experto', title: 'Tecnología Especializada' },
  { slug: 'b2-15-negocios', title: 'Español de Negocios' },
  { slug: 'b2-16-diplomatico', title: 'Lenguaje Diplomático' },
  { slug: 'b2-17-derecho', title: 'Español Jurídico' },
  { slug: 'b2-18-medicina', title: 'Español Médico' },
  { slug: 'b2-19-academia', title: 'Español Académico' },
  { slug: 'b2-20-investigacion', title: 'Investigación y Análisis' },
  { slug: 'b2-21-argumentacion-avanzada', title: 'Argumentación Avanzada' },
  { slug: 'b2-22-critica-profunda', title: 'Crítica Profunda' },
  { slug: 'b2-23-nuance', title: 'Matización de Ideas' },
  { slug: 'b2-24-ambiguedad', title: 'Ambigüedad Intencional' },
  { slug: 'b2-25-ironia', title: 'Ironía y Sarcasmo' },
  { slug: 'b2-26-sutileza', title: 'Sutileza Lingüística' },
  { slug: 'b2-27-coherencia', title: 'Coherencia Textual' },
  { slug: 'b2-28-cohesion', title: 'Cohesión Avanzada' },
  { slug: 'b2-29-oratoria', title: 'Oratoria Persuasiva' },
  { slug: 'b2-30-debate-experto', title: 'Debate de Expertos' },
  { slug: 'b2-31-negociacion', title: 'Negociación Efectiva' },
  { slug: 'b2-32-proyecto-final', title: 'Proyecto Final B2' },
];

const c1LessonMeta = [
  { slug: 'c1-01-precisión', title: 'Precisión Léxica' },
  { slug: 'c1-02-variacion', title: 'Variación Estilística' },
  { slug: 'c1-03-profundidad', title: 'Profundidad de Pensamiento' },
  { slug: 'c1-04-complejidad', title: 'Complejidad Sintáctica' },
  { slug: 'c1-05-filosofia', title: 'Filosofía del Lenguaje' },
  { slug: 'c1-06-semantica', title: 'Semántica Avanzada' },
  { slug: 'c1-07-etimologia', title: 'Etimología y Evolución' },
  { slug: 'c1-08-neologismos', title: 'Neologismos y Tecnicismos' },
  { slug: 'c1-09-literatura-clasica', title: 'Literatura Clásica' },
  { slug: 'c1-10-literatura-moderna', title: 'Literatura Moderna' },
  { slug: 'c1-11-critica-literaria', title: 'Crítica Literaria Especializada' },
  { slug: 'c1-12-hermeneutica', title: 'Hermenéutica y Interpretación' },
  { slug: 'c1-13-retórica', title: 'Retórica Clásica' },
  { slug: 'c1-14-oratoria-clasica', title: 'Oratoria Clásica' },
  { slug: 'c1-15-sociolinguistica', title: 'Sociolingüística Avanzada' },
  { slug: 'c1-16-dialectologia', title: 'Dialectología Hispánica' },
  { slug: 'c1-17-variantes', title: 'Variantes Geográficas' },
  { slug: 'c1-18-registro-especializado', title: 'Registro Especializado' },
  { slug: 'c1-19-historia-idioma', title: 'Historia del Idioma' },
  { slug: 'c1-20-cambios-linguisticos', title: 'Cambios Lingüísticos' },
  { slug: 'c1-21-investigacion-avanzada', title: 'Investigación Avanzada' },
  { slug: 'c1-22-metodologia', title: 'Metodología de Análisis' },
  { slug: 'c1-23-conferencia', title: 'Conferencias Especializadas' },
  { slug: 'c1-24-seminario', title: 'Seminarios Avanzados' },
  { slug: 'c1-25-matices-culturales', title: 'Matices Culturales' },
  { slug: 'c1-26-identidad', title: 'Identidad y Pertenencia' },
  { slug: 'c1-27-perspectiva-global', title: 'Perspectiva Global' },
  { slug: 'c1-28-complejidad-cultural', title: 'Complejidad Cultural' },
  { slug: 'c1-29-producción-experta', title: 'Producción de Texto Experto' },
  { slug: 'c1-30-análisis-crítico', title: 'Análisis Crítico Profundo' },
  { slug: 'c1-31-síntesis', title: 'Síntesis Sofisticada' },
  { slug: 'c1-32-proyecto-final', title: 'Proyecto Final C1' },
];

const c2LessonMeta = [
  { slug: 'c2-01-dominio', title: 'Dominio Absoluto del Lenguaje' },
  { slug: 'c2-02-sutileza-maxima', title: 'Sutileza Máxima' },
  { slug: 'c2-03-elegancia', title: 'Elegancia Lingüística' },
  { slug: 'c2-04-virtuosismo', title: 'Virtuosismo Expresivo' },
  { slug: 'c2-05-creacion-literaria', title: 'Creación Literaria Propia' },
  { slug: 'c2-06-estilo-personal', title: 'Desarrollo de Estilo Personal' },
  { slug: 'c2-07-maestria', title: 'Maestría en Escritura' },
  { slug: 'c2-08-perfeccion', title: 'Perfección Estilística' },
  { slug: 'c2-09-literatura-canonica', title: 'Literatura Canónica Hispana' },
  { slug: 'c2-10-obras-maestras', title: 'Obras Maestras Analizadas' },
  { slug: 'c2-11-movimientos-literarios', title: 'Movimientos Literarios' },
  { slug: 'c2-12-vanguardias', title: 'Vanguardias Hispanoamericanas' },
  { slug: 'c2-13-teoria-literaria', title: 'Teoría Literaria Avanzada' },
  { slug: 'c2-14-deconstruccion', title: 'Deconstrucción Textual' },
  { slug: 'c2-15-estetica', title: 'Estética y Belleza' },
  { slug: 'c2-16-filosofia-lenguaje', title: 'Filosofía del Lenguaje' },
  { slug: 'c2-17-fenomenologia', title: 'Fenomenología Lingüística' },
  { slug: 'c2-18-ontologia-palabra', title: 'Ontología de la Palabra' },
  { slug: 'c2-19-verdad-lenguaje', title: 'Verdad y Lenguaje' },
  { slug: 'c2-20-poder-discurso', title: 'Poder del Discurso' },
  { slug: 'c2-21-etica-comunicacion', title: 'Ética de la Comunicación' },
  { slug: 'c2-22-responsabilidad', title: 'Responsabilidad del Hablante' },
  { slug: 'c2-23-compromiso', title: 'Compromiso Social' },
  { slug: 'c2-24-humanismo', title: 'Humanismo Lingüístico' },
  { slug: 'c2-25-innovacion', title: 'Innovación Expresiva' },
  { slug: 'c2-26-experimentacion', title: 'Experimentación Lingüística' },
  { slug: 'c2-27-creacion-libre', title: 'Creación Libre' },
  { slug: 'c2-28-legado', title: 'Legado y Tradición' },
  { slug: 'c2-29-transformacion', title: 'Transformación del Lenguaje' },
  { slug: 'c2-30-futuro-idioma', title: 'Futuro del Idioma' },
  { slug: 'c2-31-produccion-final', title: 'Producción Lingüística Final' },
  { slug: 'c2-32-proyecto-final', title: 'Proyecto Final C2' },
];

const generateLessons = (levelSlug, count, lessonMeta = []) => {
  return Array.from({ length: count }, (_, index) => {
    const lessonNum = index + 1;
    const template = createLessonTemplate({
      levelSlug,
      lessonNum,
      lessonMeta,
      index,
      audience: 'adult',
    });

    return {
      ...template,
      id: ++lessonIdCounter,
      moduleId: getModuleId(index, count),
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
  { level: 'A2', slug: 'a2', title: 'Básico', lessons: generateLessons('a2', 32, a2LessonMeta) },
  { level: 'B1', slug: 'b1', title: 'Intermediário', lessons: generateLessons('b1', 32, b1LessonMeta) },
  { level: 'B2', slug: 'b2', title: 'Int. Avançado', lessons: generateLessons('b2', 32, b2LessonMeta) },
  { level: 'C1', slug: 'c1', title: 'Avançado', lessons: generateLessons('c1', 32, c1LessonMeta) },
  { level: 'C2', slug: 'c2', title: 'Fluente', lessons: generateLessons('c2', 32, c2LessonMeta) },
].map((course) => ({
  ...course,
  evaluations: buildEvaluations(course.slug, course.lessons.length),
}));

const generateKidsLessons = (levelSlug, count) => {
  return Array.from({ length: count }, (_, index) => {
    const lessonNum = index + 1;
    const template = createLessonTemplate({
      levelSlug,
      lessonNum,
      index,
      audience: 'kids',
    });

    return {
      ...template,
      id: ++lessonIdCounter,
      slug: `${levelSlug}-l${lessonNum}`,
      title: `Aventura ${lessonNum}`,
      shortSummary: `Uma aventura divertida ${lessonNum}.`,
      fullSummary: 'Vamos brincar e aprender espanhol!',
      isFree: true,
      moduleId: getModuleId(index, count),
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