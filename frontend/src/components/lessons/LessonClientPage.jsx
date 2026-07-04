import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpenText,
  PlayCircle,
  Download,
  ClipboardCheck,
  Headphones,
  CheckCircle2,
  Mic,
  MicOff,
  PenTool,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

const LessonClientPage = ({ lesson, onComplete }) => {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [writingText, setWritingText] = useState('');
  const [writingSubmitted, setWritingSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [toast, setToast] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const storageKey = useMemo(() => `lesson_state_${lesson?.slug || 'unknown'}`, [lesson?.slug]);

  useEffect(() => {
    if (!lesson?.slug) return;

    const savedState = localStorage.getItem(storageKey);
    if (!savedState) return;

    try {
      const parsed = JSON.parse(savedState);
      setQuizAnswers(parsed.quizAnswers || {});
      setQuizResults(parsed.quizResults || {});
      setQuizSubmitted(Boolean(parsed.quizSubmitted));
      setWritingText(parsed.writingText || '');
      setWritingSubmitted(Boolean(parsed.writingSubmitted));
      setVoiceUrl(parsed.voiceUrl || '');
    } catch (error) {
      console.warn('Could not restore lesson state', error);
    }
  }, [lesson?.slug, storageKey]);

  const quizQuestions = Array.isArray(lesson?.quiz?.questions) ? lesson.quiz.questions : [];
  const listeningQuestions = Array.isArray(lesson?.listeningExercise?.questions) ? lesson.listeningExercise.questions : [];
  const slides = Array.isArray(lesson?.slides) && lesson.slides.length > 0 ? lesson.slides : [];
  const resources = Array.isArray(lesson?.resources) && lesson.resources.length > 0 ? lesson.resources : [];
  const objectives = Array.isArray(lesson?.objectives) && lesson.objectives.length > 0
    ? lesson.objectives
    : [
        'Entender o tema principal da aula',
        'Praticar o vocabulário novo',
        'Aplicar a estrutura gramatical em contextos reais',
      ];
  const vocabulary = Array.isArray(lesson?.vocabulary) && lesson.vocabulary.length > 0
    ? lesson.vocabulary
    : ['Saudações', 'Vocabulário básico', 'Expressões úteis'];
  const grammarFocus = lesson?.grammarFocus || 'Estrutura gramatical do tema da aula';
  const hasAudio = Boolean(lesson?.listeningExercise?.audioUrl && lesson.listeningExercise.audioUrl !== '#');
  const completedActivities = [quizSubmitted, writingSubmitted, Boolean(voiceUrl)].filter(Boolean).length;
  const progressPercent = Math.round((completedActivities / 3) * 100);
  const isLessonComplete = completedActivities === 3;
  const completedSteps = [
    quizSubmitted ? 'quiz' : null,
    writingSubmitted ? 'writing' : null,
    voiceUrl ? 'voice' : null,
  ].filter(Boolean);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHasEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!lesson?.slug) return;

    const payload = {
      quizAnswers,
      quizResults,
      quizSubmitted,
      writingText,
      writingSubmitted,
      voiceUrl,
    };

    localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [quizAnswers, quizResults, quizSubmitted, writingText, writingSubmitted, voiceUrl, lesson?.slug, storageKey]);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 2400);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    let frame;
    const startValue = animatedProgress;
    const target = progressPercent;
    const duration = 450;
    const startTime = window.performance.now();

    const step = (time) => {
      const progress = Math.min(1, (time - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedProgress(Math.round(startValue + (target - startValue) * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      }
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [progressPercent]);

  if (!lesson) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-slate-700 dark:text-slate-300">Lição não encontrada.</p>
      </div>
    );
  }

  const triggerButtonMotion = (event) => {
    const button = event.currentTarget;
    button.classList.add('is-pressed');

    const ripple = document.createElement('span');
    ripple.className = 'button-ripple';

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);
    window.requestAnimationFrame(() => ripple.classList.add('is-active'));

    window.setTimeout(() => {
      ripple.remove();
      button.classList.remove('is-pressed');
    }, 500);
  };

  const releaseButtonMotion = (event) => {
    event.currentTarget.classList.remove('is-pressed');
  };

  const showToast = (title, description, tone = 'info') => {
    setToast({ title, description, tone });
  };

  const handleQuizSelect = (questionIndex, option) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleQuizSubmit = () => {
    const missingAnswers = quizQuestions.some((_, index) => !quizAnswers[index]);

    if (missingAnswers) {
      showToast('Complete o quiz', 'Escolha uma resposta para cada pergunta antes de conferir.', 'warning');
      return;
    }

    const nextResults = {};
    quizQuestions.forEach((question, index) => {
      const selected = quizAnswers[index];
      nextResults[index] = selected === question.correctAnswer;
    });
    setQuizResults(nextResults);
    setQuizSubmitted(true);
    const score = Object.values(nextResults).filter(Boolean).length;
    showToast('Quiz concluído', `Você acertou ${score} de ${quizQuestions.length} perguntas.`, 'success');
  };

  const handleWritingSubmit = () => {
    if (!writingText.trim()) {
      showToast('Escreva algo', 'Adicione uma resposta curta para enviar a tarefa.', 'warning');
      return;
    }
    setWritingSubmitted(true);
    showToast('Texto enviado', 'Sua resposta foi salva para revisão.', 'success');
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof window.MediaRecorder === 'undefined') {
      setVoiceError('Gravação de voz não está disponível neste navegador.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setVoiceUrl(audioUrl);
        setVoiceError('');
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setVoiceError('');
      showToast('Gravação iniciada', 'Fale com calma e clique em parar quando terminar.', 'info');
    } catch (error) {
      setVoiceError('Não foi possível acessar o microfone.');
      showToast('Microfone indisponível', 'Permita o acesso ao microfone e tente novamente.', 'warning');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      showToast('Gravação salva', 'Sua resposta de voz ficou pronta para revisão.', 'success');
    }
  };

  const finishLesson = () => {
    onComplete?.(lesson.id);
    showToast('Lição concluída', 'Parabéns! Você avançou na sua jornada.', 'success');
  };

  return (
    <div className="space-y-8">
      <section className={`lesson-activity-card ${hasEntered ? 'is-visible' : ''} rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            {lesson.level || 'Aula'}
          </span>
          <div className="lesson-progress-pill rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            Progresso: {animatedProgress}%
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{lesson.title}</h1>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{lesson.fullSummary}</p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {['quiz', 'writing', 'voice'].map((step) => {
            const isDone = completedSteps.includes(step);
            const label = step === 'quiz' ? 'Quiz' : step === 'writing' ? 'Escrita' : 'Fala';
            return (
              <div
                key={step}
                className={`rounded-full border px-3 py-1 text-sm font-medium ${
                  isDone
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <span className="mr-2">{isDone ? '✓' : '•'}</span>
                {label}
              </div>
            );
          })}
        </div>

        {isLessonComplete ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
            Ótimo trabalho! Você concluiu os principais passos desta lição.
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Objetivos</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
              {objectives.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Vocabulário</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {vocabulary.map((word) => (
                <span key={word} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                  {word}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Foco gramatical</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{grammarFocus}</p>
          </div>
        </div>
      </section>

      <section className={`lesson-section-card ${hasEntered ? 'is-visible' : ''} rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900`}>
        <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <PlayCircle className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Vídeo da aula</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
          <iframe
            width="100%"
            height={420}
            src={lesson.videoUrl}
            title={lesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <BookOpenText className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Slides e pontos-chave</h2>
          </div>
          <div className="space-y-3">
            {slides.length > 0 ? (
              slides.map((slide, index) => (
                <div key={`${slide.title}-${index}`} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{slide.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{slide.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">Os slides da aula serão adicionados em breve.</p>
            )}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Download className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Materiais de apoio</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {resources.length > 0 ? (
              resources.map((resource, index) => (
                <a
                  key={`${resource.name}-${index}`}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
                >
                  <Download className="h-4 w-4" />
                  {resource.name}
                </a>
              ))
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">Nenhum material complementar disponível ainda.</p>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Quiz interativo</h2>
          </div>

          {quizQuestions.length > 0 ? (
            <div className="space-y-4">
              {quizQuestions.map((question, index) => (
                <div key={`${question.question}-${index}`} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <p className="font-semibold text-slate-900 dark:text-white">{question.question}</p>
                  <div className="mt-3 space-y-2">
                    {question.options.map((option) => {
                      const isSelected = quizAnswers[index] === option;
                      const isCorrect = quizResults[index] === true && option === question.correctAnswer;
                      const isWrong = quizResults[index] === false && isSelected && option !== question.correctAnswer;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleQuizSelect(index, option)}
                          onMouseDown={triggerButtonMotion}
                          onMouseUp={releaseButtonMotion}
                          onMouseLeave={releaseButtonMotion}
                          className={`lesson-option-btn ${isSelected ? 'is-selected' : ''} ${isCorrect ? 'is-correct' : ''} ${isWrong ? 'is-wrong' : ''} flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-200'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                          }`}
                          aria-pressed={isSelected}
                        >
                          <span>{option}</span>
                          {isCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleQuizSubmit}
                onMouseDown={triggerButtonMotion}
                onMouseUp={releaseButtonMotion}
                onMouseLeave={releaseButtonMotion}
                className="lesson-action-btn lesson-action-btn--primary rounded-xl px-4 py-2 text-sm font-semibold text-white"
              >
                Verificar respostas
              </button>

              {quizSubmitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
                  Você acertou {Object.values(quizResults).filter(Boolean).length} de {quizQuestions.length} perguntas.
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">O quiz desta aula será publicado em breve.</p>
          )}
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Headphones className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Exercício de escuta</h2>
          </div>

          {hasAudio ? (
            <audio controls className="mb-4 w-full">
              <source src={lesson.listeningExercise.audioUrl} />
              Seu navegador não suporta reprodução de áudio.
            </audio>
          ) : (
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
              Este módulo não precisa de áudio separado — a prática está integrada ao vídeo e às atividades.
            </p>
          )}

          {listeningQuestions.length > 0 ? (
            <ul className="space-y-3">
              {listeningQuestions.map((question, idx) => (
                <li key={`${question.question}-${idx}`} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <p className="font-semibold text-slate-900 dark:text-white">{question.question}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Opções: {question.options.join(', ')}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">Nenhuma pergunta extra de escuta nesta lição.</p>
          )}
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <PenTool className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Escrita guiada</h2>
          </div>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
            Escreva uma frase ou um pequeno parágrafo usando o conteúdo da aula. Sua resposta ficará salva para revisão posterior.
          </p>
          <textarea
            value={writingText}
            onChange={(event) => setWritingText(event.target.value)}
            rows={6}
            placeholder="Ex.: Hola, me llamo Ana y estudio español todos los días."
            className="lesson-writing-area w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <button
            type="button"
            onClick={handleWritingSubmit}
            onMouseDown={triggerButtonMotion}
            onMouseUp={releaseButtonMotion}
            onMouseLeave={releaseButtonMotion}
            className="lesson-action-btn lesson-action-btn--accent mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
          >
            <MessageSquare className="h-4 w-4" />
            Enviar para revisão
          </button>
          {writingSubmitted ? (
            <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">Resposta salva. O professor poderá corrigir o texto após a entrega.</p>
          ) : null}
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Mic className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Prática de fala</h2>
          </div>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
            Grave uma resposta curta para praticar pronúncia e entonação.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                onMouseDown={triggerButtonMotion}
                onMouseUp={releaseButtonMotion}
                onMouseLeave={releaseButtonMotion}
                className="lesson-action-btn lesson-action-btn--secondary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              >
                <Mic className="h-4 w-4" />
                Gravar resposta
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                onMouseDown={triggerButtonMotion}
                onMouseUp={releaseButtonMotion}
                onMouseLeave={releaseButtonMotion}
                className="lesson-action-btn lesson-action-btn--danger inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              >
                <MicOff className="h-4 w-4" />
                Parar gravação
              </button>
            )}
          </div>

          {voiceError ? <p className="mt-3 text-sm text-rose-600">{voiceError}</p> : null}

          {voiceUrl ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
              <audio controls src={voiceUrl} className="w-full" />
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Sua gravação ficou salva nesta sessão.</p>
            </div>
          ) : null}
        </article>
      </section>

      <button
        type="button"
        onClick={finishLesson}
        onMouseDown={triggerButtonMotion}
        onMouseUp={releaseButtonMotion}
        onMouseLeave={releaseButtonMotion}
        className="lesson-action-btn lesson-action-btn--primary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
      >
        <CheckCircle2 className="h-4 w-4" />
        Marcar como concluída
      </button>

      {toast ? (
        <div className={`lesson-toast lesson-toast--${toast.tone} fixed bottom-4 right-4 z-[60] max-w-sm rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${
          toast.tone === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200'
            : toast.tone === 'warning'
              ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/80 dark:text-amber-200'
              : 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/80 dark:text-blue-200'
        }`}>
          <p className="font-semibold">{toast.title}</p>
          <p className="mt-1 text-sm opacity-90">{toast.description}</p>
        </div>
      ) : null}
    </div>
  );
};

export default LessonClientPage;
