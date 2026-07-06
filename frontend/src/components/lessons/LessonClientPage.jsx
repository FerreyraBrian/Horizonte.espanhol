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
  ChevronLeft,
  ChevronRight,
  Bot,
  Circle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import '../../styles/lesson-client.css';
import '../../styles/buttons.css';
import '../../styles/gamification.css';
import gamificationService from '../../services/gamificationService';
import {
  triggerConfetti,
  showXPPopup,
  showAchievementNotification,
  playSound,
  triggerVibration,
  createButtonRipple,
  shakeElement,
  triggerParabensEffect,
  triggerErrorEffect,
  createCheckmarkEffect,
  createBurstEffect,
  triggerRewindEffect,
  triggerCasinoWinEffect,
  createLuckySpinEffect,
  createConfettiCannon,
  createStarRain,
} from '../../services/visualEffectsService';

const LessonClientPage = ({ lesson, onComplete, onPrev, onNext }) => {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [optionRefsKey, setOptionRefsKey] = useState(0); // Para re-animar opciones
  const [listeningAnswers, setListeningAnswers] = useState({});
  const [listeningResults, setListeningResults] = useState({});
  const [listeningSubmitted, setListeningSubmitted] = useState(false);
  const [listeningWinStreak, setListeningWinStreak] = useState(0);
  const [currentListeningSlide, setCurrentListeningSlide] = useState(0);
  const [showListeningCompletion, setShowListeningCompletion] = useState(true);
  const [writingText, setWritingText] = useState('');
  const [writingSubmitted, setWritingSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [toast, setToast] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Gamification states
  const [gamStats, setGamStats] = useState({});
  const [sessionStartTime] = useState(Date.now());
  
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
      setIsCompleted(Boolean(parsed.isCompleted));
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
    
    // Load gamification stats
    setGamStats(gamificationService.getStats());
    playSound('click');
    
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
      isCompleted,
    };

    localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [
    quizAnswers,
    quizResults,
    quizSubmitted,
    writingText,
    writingSubmitted,
    voiceUrl,
    isCompleted,
    lesson?.slug,
    storageKey,
  ]);

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

  // Animar opciones correctas e incorrectas cuando se muestran los resultados
  useEffect(() => {
    if (!quizSubmitted || Object.keys(quizResults).length === 0) return;

    // Pequeño delay para que la animación del submit termine
    setTimeout(() => {
      quizQuestions.forEach((question, questionIndex) => {
        const optionButtons = document.querySelectorAll(`.question-block:nth-child(${questionIndex + 1}) .option-button`);
        
        optionButtons.forEach((button, optionIndex) => {
          const isCorrect = quizResults[questionIndex] === true;
          const isWrong = quizResults[questionIndex] === false;
          
          if (isCorrect && button.classList.contains('option-correct')) {
            // Animar opción correcta
            const delay = optionIndex * 100;
            setTimeout(() => {
              createCheckmarkEffect(button);
              createBurstEffect(
                button.getBoundingClientRect().left + button.offsetWidth / 2,
                button.getBoundingClientRect().top + button.offsetHeight / 2,
                15
              );
            }, delay);
          } else if (isWrong && button.classList.contains('option-wrong')) {
            // Animar opción incorrecta
            setTimeout(() => {
              shakeElement(button);
            }, questionIndex * 150);
          }
        });
      });
    }, 600);
  }, [quizSubmitted, quizResults, quizQuestions]);

  // LISTENING CAROUSEL COMPLETION EFFECTS
  useEffect(() => {
    const isListeningComplete = listeningQuestions.length > 0 && 
                               listeningQuestions.every((_, idx) => idx in listeningAnswers);
    
    if (!isListeningComplete) return;

    // CELEBRACIÓN ÉPICA Y LÚDICA
    // Fase 1: Confeti (inmediato)
    setTimeout(() => {
      triggerConfetti('epic');
    }, 100);

    // Fase 2: Lluvia de estrellas (a los 300ms)
    setTimeout(() => {
      createStarRain();
    }, 300);

    // Fase 3: Efecto parabéns en el centro (a los 600ms)
    setTimeout(() => {
      triggerParabensEffect(window.innerWidth / 2, window.innerHeight / 2);
    }, 600);

    // Fase 4: Casino win effect (a los 1000ms)
    setTimeout(() => {
      triggerCasinoWinEffect();
    }, 1000);

    // Fase 5: Sonido de celebración
    setTimeout(() => {
      playSound('success');
      triggerVibration([50, 30, 50, 30, 50]);
    }, 500);

    // Fase 6: Toast celebratorio (a los 1200ms)
    setTimeout(() => {
      const correctCount = Object.values(listeningResults).filter(Boolean).length;
      const total = listeningQuestions.length;
      let message = '';
      
      if (correctCount === total) {
        message = '🌟 ¡PERFECTO! ¡Completaste TODO CORRECTAMENTE! ¡ERES UNA ESTRELLA! 🌟';
        showToast('🎉 ¡PARABÉNS! 🎉', message, 'success');
      } else if (correctCount >= total * 0.8) {
        message = `🎊 ¡Excelente! Acertaste ${correctCount}/${total}. ¡Muy bien! 🎊`;
        showToast('👏 ¡Fantástico! 👏', message, 'success');
      } else if (correctCount >= total / 2) {
        message = `✨ ¡Bien hecho! Acertaste ${correctCount}/${total}. ¡Sigue practicando! ✨`;
        showToast('👍 ¡Lo hiciste bien! 👍', message, 'success');
      }
    }, 1200);

    // Gamification
    setTimeout(() => {
      const correctCount = Object.values(listeningResults).filter(Boolean).length;
      gamificationService.completeListeningExercise(correctCount, listeningQuestions.length);
      const newStats = gamificationService.getStats();
      setGamStats(newStats);
    }, 1500);

    // Hacer que el mensaje de completación desaparezca después de 30 segundos
    setTimeout(() => {
      setShowListeningCompletion(false);
    }, 30000);

  }, [listeningAnswers, listeningQuestions, listeningResults]);

  if (!lesson) {
    return (
      <div className="lesson-container">
        <div className="lesson-activity-card">
          <p className="text-secondary">Lição não encontrada.</p>
        </div>
      </div>
    );
  }

  const showToast = (title, description, tone = 'info') => {
    setToast({ title, description, tone });
  };

  const handleQuizSelect = (questionIndex, option, optionIndex) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: option }));
    // Reproducir sonido musical por opción seleccionada
    playSound(`select${optionIndex}`);
    triggerVibration([20]);
  };

  const handleQuizSubmit = () => {
    const missingAnswers = quizQuestions.some((_, index) => !quizAnswers[index]);

    if (missingAnswers) {
      showToast('Complete o quiz', 'Escolha uma resposta para cada pergunta antes de conferir.', 'warning');
      playSound('error');
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
    
    // Gamification
    const result = gamificationService.completeQuiz(score, quizQuestions.length);
    const newStats = gamificationService.getStats();
    
    // Efectos y sonidos de retroalimentación mejorados
    if (score === quizQuestions.length) {
      // PERFECTO - Efectos épicos celebratorios
      setTimeout(() => {
        triggerParabensEffect(window.innerWidth / 2, window.innerHeight / 2);
      }, 200);
      
      setTimeout(() => {
        showToast('¡PARABÉNS! 🎉', '¡Respondiste TODAS las preguntas correctamente! ¡Eres increíble! 🏆', 'success');
      }, 400);
    } else if (score > quizQuestions.length / 2) {
      // BIEN - Efectos positivos moderados
      setTimeout(() => {
        createBurstEffect(window.innerWidth / 2, window.innerHeight / 2, 20);
      }, 200);
      playSound('success');
      triggerVibration([30, 10, 30, 10, 30]);
      showToast('¡Bien hecho! 👍', `Acertaste ${score} de ${quizQuestions.length}. ¡Vamos a mejorar! 💪`, 'success');
    } else {
      // NECESITA MEJORAR - Efectos de motivación
      setTimeout(() => {
        triggerErrorEffect(document.querySelector('[data-quiz-container]'));
      }, 200);
      
      showToast('Sigue intentando 💭', `Acertaste ${score} de ${quizQuestions.length}. ¡Repasa y vuelve a intentarlo! 🔄`, 'warning');
    }
    
    setGamStats(newStats);
    showToast(
      'Quiz concluído',
      `Você acertou ${score} de ${quizQuestions.length} perguntas. +${result.xpAdded} XP`,
      'success'
    );
  };

  const handleQuizReset = () => {
    setQuizAnswers({});
    setQuizResults({});
    setQuizSubmitted(false);
    
    // Efecto de retroceso/rewind
    triggerRewindEffect();
    
    showToast('Quiz reiniciado', 'Você pode tentar novamente.', 'info');
  };

  const handleWritingSubmit = () => {
    if (!writingText.trim()) {
      showToast('Escreva algo', 'Adicione uma resposta curta para enviar a tarefa.', 'warning');
      playSound('error');
      return;
    }
    setWritingSubmitted(true);
    
    // Gamification
    gamificationService.submitWriting();
    const newStats = gamificationService.getStats();
    setGamStats(newStats);
    
    playSound('success');
    triggerVibration([30, 10, 30]);
    showToast('Texto enviado', 'Sua resposta foi salva para revisão. +15 XP', 'success');
  };

  const handleWritingReset = () => {
    setWritingText('');
    setWritingSubmitted(false);
    showToast('Texto reiniciado', 'Você pode reescrever sua resposta.', 'info');
  };

  // ========== LISTENING EXERCISE HANDLERS (CAROUSEL MODE) ==========
  const handleListeningSelect = (questionIndex, option, optionIndex) => {
    // Si ya respondió, permitir cambiar la respuesta (reintentar)
    const alreadyAnswered = questionIndex in listeningResults;
    
    const question = listeningQuestions[questionIndex];
    const isCorrect = option === question.correctAnswer;
    
    // Guardar respuesta
    setListeningAnswers((prev) => ({ ...prev, [questionIndex]: option }));
    
    // Reproducir sonido por opción
    playSound(`select${optionIndex}`);
    triggerVibration([20]);
    
    // Establecer resultado después de delay
    setTimeout(() => {
      setListeningResults((prev) => ({ ...prev, [questionIndex]: isCorrect }));
      
      if (isCorrect) {
        // RESPUESTA CORRECTA - Efectos de éxito
        playSound('success');
        triggerVibration([30, 10, 30, 10, 30]);
        
        // Efectos visuales
        setTimeout(() => {
          const btn = document.querySelector(`[data-listening-q="${questionIndex}"] .option-correct`);
          if (btn) {
            createCheckmarkEffect(btn);
            createBurstEffect(
              btn.getBoundingClientRect().left + btn.offsetWidth / 2,
              btn.getBoundingClientRect().top + btn.offsetHeight / 2,
              15
            );
          }
        }, 100);
        
        // Auto-advance después de 1500ms
        setTimeout(() => {
          if (currentListeningSlide < listeningQuestions.length - 1) {
            setCurrentListeningSlide(currentListeningSlide + 1);
          }
        }, 1500);
      } else {
        // RESPUESTA INCORRECTA - Efectos de error pero NO deshabilitar
        playSound('error');
        triggerVibration([50, 50, 50]);
        
        // Efecto de vibración en el botón
        setTimeout(() => {
          const btn = document.querySelector(`[data-listening-q="${questionIndex}"] .option-wrong`);
          if (btn) {
            shakeElement(btn);
          }
        }, 100);
      }
    }, 100);
  };

  const handleListeningPrevSlide = () => {
    if (currentListeningSlide > 0) {
      setCurrentListeningSlide(currentListeningSlide - 1);
    }
  };

  const handleListeningNextSlide = () => {
    if (currentListeningSlide < listeningQuestions.length - 1) {
      setCurrentListeningSlide(currentListeningSlide + 1);
    }
  };

  const handleListeningSubmit = () => {
    const missingAnswers = listeningQuestions.some((_, index) => !listeningAnswers[index]);

    if (missingAnswers) {
      showToast('Complete a escuta', 'Escolha uma resposta para cada pergunta antes de conferir.', 'warning');
      playSound('error');
      return;
    }

    const nextResults = {};
    listeningQuestions.forEach((question, index) => {
      const selected = listeningAnswers[index];
      nextResults[index] = selected === question.correctAnswer;
    });
    setListeningResults(nextResults);
    setListeningSubmitted(true);
    const score = Object.values(nextResults).filter(Boolean).length;
    const streak = Object.values(nextResults).every(Boolean) ? listeningWinStreak + 1 : 0;
    setListeningWinStreak(streak);

    // Gamification
    gamificationService.completeListening(score, listeningQuestions.length);
    const newStats = gamificationService.getStats();
    setGamStats(newStats);

    // Efectos y sonidos gaming/casino
    if (score === listeningQuestions.length) {
      // PERFECTO - Mega efecto casino
      setTimeout(() => {
        triggerCasinoWinEffect(window.innerWidth / 2, window.innerHeight / 2, streak);
      }, 200);

      setTimeout(() => {
        showToast('🎰 JACKPOT! 🎰', `¡Perfecto! Racha ganadora: ${streak}x 🔥 +100 XP`, 'success');
      }, 600);
    } else if (score > listeningQuestions.length / 2) {
      // BIEN - Efecto positivo gaming
      setTimeout(() => {
        createLuckySpinEffect(window.innerWidth / 2, window.innerHeight / 2);
      }, 200);
      playSound('success');
      triggerVibration([30, 10, 30, 10, 30]);
      showToast('🎯 ¡Buen Golpe!', `Acertaste ${score}/${listeningQuestions.length}. +50 XP`, 'success');
    } else {
      // NECESITA MEJORAR - Efecto motivador
      playSound('error');
      triggerVibration([50, 50, 50]);
      showToast('🎲 Intenta de Nuevo', `${score}/${listeningQuestions.length} acertadas. ¡Vuelve a intentarlo! 💪`, 'warning');
    }
  };

  const handleListeningReset = () => {
    setListeningAnswers({});
    setListeningResults({});
    setListeningSubmitted(false);
    triggerRewindEffect();
    showToast('Escuta reiniciada', 'Você pode tentar novamente.', 'info');
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
      
      // Gamification
      gamificationService.recordVoice();
      const newStats = gamificationService.getStats();
      setGamStats(newStats);
      
      playSound('success');
      triggerVibration([30, 10, 30]);
      showToast('Gravação salva', 'Sua resposta de voz ficou pronta para revisão. +20 XP', 'success');
    }
  };

  const handleVoiceReset = () => {
    setVoiceUrl('');
    setVoiceError('');
    showToast('Gravação removida', 'Você pode gravar novamente.', 'info');
  };

  const handleCompleteToggle = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);
    if (newState) {
      // Gamification - Complete lesson
      const duration = Date.now() - sessionStartTime;
      const quizScore = Object.values(quizResults).filter(Boolean).length;
      const quizTotal = quizQuestions.length;
      
      gamificationService.completeLessonSession(duration, quizScore, quizTotal);
      const newStats = gamificationService.getStats();
      setGamStats(newStats);
      
      // Efectos
      triggerConfetti('normal');
      playSound('success');
      triggerVibration([50, 30, 50]);
      
      onComplete?.(lesson.id);
      showToast(
        'Lección completada',
        `¡Felicidades! Vas en clase ${newStats.completedLessons}/32. Sigue adelante 🚀`,
        'success'
      );
    } else {
      playSound('click');
      showToast('Progreso reiniciado', 'A lição foi marcada como não concluída.', 'info');
    }
  };

  return (
    <div className="lesson-container">
      {/* --- Gamification Header --- */}
      <div className="gamification-header">
        <div className="stat-card">
          <span className="stat-icon">✨</span>
          <span className="stat-value">{gamStats.totalXP || 0}</span>
          <span className="stat-label">XP Total</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <span className="stat-value">{gamStats.completedLessons || 0}/32</span>
          <span className="stat-label">Clases Completadas</span>
        </div>

        <div className="level-badge-container">
          <div
            className="level-badge"
            style={{ '--progress': ((gamStats.completedLessons || 0) / 32) * 100 }}
          >
            <div className="level-number">
              {Math.round(((gamStats.completedLessons || 0) / 32) * 100)}%
            </div>
          </div>
          <div className="progress-label">Progreso</div>
        </div>
      </div>

      {/* --- Navegación entre lições --- */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-slate-200/50 dark:border-slate-800/50 mb-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="btn-horizonte btn-secondary btn-sm"
            disabled={!onPrev}
          >
            <ChevronLeft size={16} className="btn-icon" />
            Anterior
          </button>
          <button
            type="button"
            onClick={onNext}
            className="btn-horizonte btn-secondary btn-sm"
            disabled={!onNext}
          >
            Siguiente
            <ChevronRight size={16} className="btn-icon btn-icon-right" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {completedActivities}/3
            </span>
          </div>

          <button
            type="button"
            onClick={handleCompleteToggle}
            className={`btn-horizonte ${isCompleted ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={16} className="btn-icon" />
                Completado
              </>
            ) : (
              <>
                <Circle size={16} className="btn-icon" />
                Marcar como Completado
              </>
            )}
          </button>

          <button
            type="button"
            className="btn-horizonte btn-accent btn-sm relative"
            onClick={() => showToast('Asistente AI', 'Pronto para ayudar con tus dudas.', 'info')}
          >
            <Bot size={16} className="btn-icon" />
            Asistente
            <span className="btn-badge">3</span>
          </button>
        </div>
      </div>

      {/* --- Hero de la Lección con XP Progress --- */}
      <section className={`lesson-activity-card ${hasEntered ? 'is-visible' : ''}`}>
        <div className="lesson-header">
          <span className="badge badge-blue">
            {lesson.level || 'Aula'}
          </span>
          <div className="lesson-progress-pill">
            Progresso: {animatedProgress}%
          </div>
        </div>

        <h1 className="heading-lg">{lesson.title}</h1>
        <p className="lesson-summary">{lesson.fullSummary}</p>

        {/* XP Progress Bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>
            Experiencia: {gamStats.totalXP || 0} XP
          </div>
          <div className="xp-progress-bar">
            <div
              className="xp-progress-fill"
              style={{ width: (gamStats.progressPercent || 0) + '%' }}
            />
          </div>
        </div>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>

        <div className="steps-container">
          {['quiz', 'writing', 'voice'].map((step) => {
            const isDone = completedSteps.includes(step);
            const label = step === 'quiz' ? 'Quiz' : step === 'writing' ? 'Escrita' : 'Fala';
            return (
              <div
                key={step}
                className={`step-badge ${isDone ? 'completed' : ''}`}
              >
                <span className="mr-2">{isDone ? '✓' : '•'}</span>
                {label}
              </div>
            );
          })}
        </div>

        {isLessonComplete ? (
          <div className="completion-message">
            🎉 Ótimo trabalho! Você concluiu os principais passos desta lição.
          </div>
        ) : null}

        <div className="grid-3-cols">
          <div className="info-card">
            <p className="info-card-title">Objetivos</p>
            <ul className="info-card-list">
              {objectives.map((item) => (
                <li key={item} className="info-card-item">
                  <Sparkles className="info-card-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="info-card">
            <p className="info-card-title">Vocabulário</p>
            <div className="vocab-tags">
              {vocabulary.map((word) => (
                <span key={word} className="vocab-tag">
                  {word}
                </span>
              ))}
            </div>
          </div>
          <div className="info-card">
            <p className="info-card-title">Foco gramatical</p>
            <p className="text-muted">{grammarFocus}</p>
          </div>
        </div>
      </section>

      {/* --- Vídeo --- */}
      <section className={`lesson-section-card ${hasEntered ? 'is-visible' : ''}`}>
        <div className="article-header">
          <PlayCircle className="article-header-icon" />
          <h2 className="article-header-title">Vídeo da aula</h2>
        </div>
        <div className="video-container">
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

      {/* --- Slides e Pontos-Chave --- */}
      <article className={`lesson-section-card ${hasEntered ? 'is-visible' : ''}`}>
        <div className="article-header">
          <BookOpenText className="article-header-icon" />
          <h2 className="article-header-title">Slides e pontos-chave</h2>
        </div>
        <div className="slides-container">
          {slides.length > 0 ? (
            slides.map((slide, index) => (
              <div key={`${slide.title}-${index}`} className="slide-item">
                <h3 className="slide-title">{slide.title}</h3>
                <p className="slide-content">{slide.content}</p>
              </div>
            ))
          ) : (
            <p className="text-muted">Os slides da aula serão adicionados em breve.</p>
          )}
        </div>
      </article>

      {/* --- Materiais de Apoio --- */}
      <article className={`lesson-section-card ${hasEntered ? 'is-visible' : ''}`}>
        <div className="article-header">
          <Download className="article-header-icon" />
          <h2 className="article-header-title">Materiais de apoio</h2>
        </div>
        <div className="resources-container">
          {resources.length > 0 ? (
            resources.map((resource, index) => (
              <a
                key={`${resource.name}-${index}`}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="resource-link"
              >
                <Download className="resource-link-icon" />
                {resource.name}
              </a>
            ))
          ) : (
            <p className="text-muted">Nenhum material complementar disponível ainda.</p>
          )}
        </div>
      </article>

      {/* --- Exercício de Escuta GAMING --- */}
      <article className={`lesson-section-card ${hasEntered ? 'is-visible' : ''}`}>
        <div className="article-header">
          <Headphones className="article-header-icon" />
          <h2 className="article-header-title">🎧 Juego de Escucha</h2>
        </div>

        {hasAudio ? (
          <div className="audio-game-container">
            <div className="audio-player-wrapper">
              <div className="audio-label">🔊 Escucha el audio:</div>
              <audio controls className="audio-player" style={{ width: '100%' }}>
                <source src={lesson.listeningExercise.audioUrl} />
                Seu navegador não suporta reprodução de áudio.
              </audio>
            </div>
          </div>
        ) : (
          <p className="listening-message">
            Este módulo não precisa de áudio separado — a prática está integrada ao vídeo e às atividades.
          </p>
        )}

        {listeningQuestions.length > 0 && hasAudio ? (
          <div className="listening-carousel-container quiz-container" data-quiz-container>
            {/* Current Slide */}
            {(() => {
              const question = listeningQuestions[currentListeningSlide];
              const isAnswered = currentListeningSlide in listeningAnswers;
              const isCorrect = listeningResults[currentListeningSlide] === true;
              
              return (
                <div className="carousel-slide-wrapper question-block" data-listening-q={currentListeningSlide}>
                  {/* Slide Number */}
                  <div className="carousel-slide-number" style={{ textAlign: 'center', marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
                    Pregunta {currentListeningSlide + 1} de {listeningQuestions.length}
                  </div>
                  
                  {/* Question */}
                  <p className="question-text" style={{ fontSize: '1.125rem' }}>
                    {question.question}
                  </p>
                  
                  {/* Options */}
                  <div className="options-list">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = listeningAnswers[currentListeningSlide] === option;
                      const qIsCorrect = listeningResults[currentListeningSlide] === true && option === question.correctAnswer;
                      const qIsWrong = listeningResults[currentListeningSlide] === false && isSelected && option !== question.correctAnswer;

                      let statusClass = '';
                      if (qIsCorrect) statusClass = 'option-correct';
                      else if (qIsWrong) statusClass = 'option-wrong';
                      else if (isSelected) statusClass = 'option-selected';

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleListeningSelect(currentListeningSlide, option, optionIndex)}
                          onMouseEnter={() => !isAnswered && playSound('hover')}
                          className={`option-button option-${optionIndex} ${statusClass}`}
                          disabled={isAnswered && isCorrect}
                          aria-pressed={isSelected}
                        >
                          <span className="option-text">
                            {qIsCorrect && <CheckCircle2 size={16} className="option-icon" />}
                            {qIsWrong && <XCircle size={16} className="option-icon" />}
                            {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Message */}
                  {isAnswered && (
                    <div className="carousel-feedback" style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: isCorrect ? '#ecfdf5' : '#fef2f2', color: isCorrect ? '#065f46' : '#7f1d1d', fontSize: '0.875rem', fontWeight: '500', textAlign: 'center' }}>
                      {isCorrect ? question.correct : question.incorrect}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Navigation Buttons */}
            <div className="carousel-navigation" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', gap: '1rem' }}>
              <button
                onClick={() => { playSound('select0'); handleListeningPrevSlide(); }}
                disabled={currentListeningSlide === 0}
                className="btn-horizonte btn-secondary"
                style={{ minWidth: 'auto', padding: '0.5rem 1rem' }}
              >
                ← Anterior
              </button>

              {/* Progress Bar */}
              <div style={{ flex: 1, height: '8px', backgroundColor: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    backgroundColor: '#10b981',
                    width: `${((currentListeningSlide + 1) / listeningQuestions.length) * 100}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>

              <button
                onClick={() => { playSound('select1'); handleListeningNextSlide(); }}
                disabled={currentListeningSlide === listeningQuestions.length - 1}
                className="btn-horizonte btn-secondary"
                style={{ minWidth: 'auto', padding: '0.5rem 1rem' }}
              >
                Siguiente →
              </button>
            </div>

            {/* Completion Message */}
            {listeningQuestions.every((_, idx) => idx in listeningAnswers) && showListeningCompletion && (
              <div 
                className="completion-message" 
                style={{ 
                  marginTop: '2rem', 
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: '3px solid #047857',
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                  color: '#ffffff',
                  fontWeight: '700',
                  textAlign: 'center',
                  fontSize: '1.125rem',
                  animation: showListeningCompletion ? 'pulse 2s infinite, slideUp 0.6s ease-out' : 'fadeOut 1s ease-out forwards',
                  letterSpacing: '0.5px',
                  transition: 'all 0.5s ease-out'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉✨🏆✨🎉</div>
                <div style={{ marginBottom: '0.75rem' }}>
                  ¡Completaste el carrusel de escucha!
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                  {(() => {
                    const correctCount = Object.values(listeningResults).filter(Boolean).length;
                    const total = listeningQuestions.length;
                    const percentage = Math.round((correctCount / total) * 100);
                    
                    return (
                      <>
                        <div style={{ color: '#d1fae5', marginBottom: '0.5rem' }}>
                          {percentage === 100 ? '🌟 ¡PERFECTO! 🌟' : `${percentage}% Correcto`}
                        </div>
                        <div style={{ fontSize: '0.95rem', color: '#d1fae5' }}>
                          {correctCount} de {total} respuestas correctas
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted">Nenhuma pergunta de escucha nesta lição.</p>
        )}
      </article>

      {/* --- Quiz Interativo --- */}
      <article className={`lesson-section-card ${hasEntered ? 'is-visible' : ''}`}>
        <div className="article-header">
          <ClipboardCheck className="article-header-icon" />
          <h2 className="article-header-title">Quiz interativo</h2>
        </div>

        {quizQuestions.length > 0 ? (
          <div className="quiz-container" data-quiz-container>
            {quizQuestions.map((question, index) => (
              <div key={`${question.question}-${index}`} className="question-block">
                <p className="question-text">{question.question}</p>
                <div className="options-list">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = quizAnswers[index] === option;
                    const isCorrect = quizResults[index] === true && option === question.correctAnswer;
                    const isWrong = quizResults[index] === false && isSelected && option !== question.correctAnswer;

                    let statusClass = '';
                    if (isCorrect) statusClass = 'option-correct';
                    else if (isWrong) statusClass = 'option-wrong';
                    else if (isSelected) statusClass = 'option-selected';

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleQuizSelect(index, option, optionIndex)}
                        onMouseEnter={() => !quizSubmitted && playSound('hover')}
                        className={`option-button option-${optionIndex} ${statusClass}`}
                        disabled={quizSubmitted}
                        aria-pressed={isSelected}
                      >
                        <span className="option-text">
                          {isCorrect && <CheckCircle2 size={16} className="option-icon" />}
                          {isWrong && <XCircle size={16} className="option-icon" />}
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  playSound('submit');
                  triggerVibration([30, 10, 30]);
                  handleQuizSubmit();
                }}
                className="btn-horizonte btn-primary"
                disabled={quizSubmitted}
              >
                <CheckCircle2 size={16} className="btn-icon" />
                Verificar respostas
              </button>
              {quizSubmitted && (
                <button
                  type="button"
                  onClick={handleQuizReset}
                  className="btn-horizonte btn-secondary"
                >
                  <ArrowRight size={16} className="btn-icon" />
                  Reintentar
                </button>
              )}
            </div>

            {quizSubmitted ? (
              <div className="completion-message mt-4">
                ✅ Você acertou {Object.values(quizResults).filter(Boolean).length} de {quizQuestions.length} perguntas.
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-muted">O quiz desta aula será publicado em breve.</p>
        )}
      </article>

      {/* --- Escrita Guiada --- */}
      <article className={`lesson-section-card ${hasEntered ? 'is-visible' : ''}`}>
        <div className="article-header">
          <PenTool className="article-header-icon" />
          <h2 className="article-header-title">Escrita guiada</h2>
        </div>
        <p className="writing-description">
          Escreva uma frase ou um pequeno parágrafo usando o conteúdo da aula. Sua resposta ficará salva para revisão posterior.
        </p>
        <textarea
          value={writingText}
          onChange={(event) => setWritingText(event.target.value)}
          rows={6}
          placeholder="Ex.: Hola, me llamo Ana y estudio español todos los días."
          className="lesson-writing-area"
          disabled={writingSubmitted}
        />
        <div className="flex flex-wrap gap-3 mt-3">
          <button
            type="button"
            onClick={handleWritingSubmit}
            className="btn-horizonte btn-accent"
            disabled={writingSubmitted}
          >
            <MessageSquare size={16} className="btn-icon" />
            Enviar para revisão
          </button>
          {writingSubmitted && (
            <button
              type="button"
              onClick={handleWritingReset}
              className="btn-horizonte btn-secondary"
            >
              <ArrowRight size={16} className="btn-icon" />
              Reescrever
            </button>
          )}
        </div>
        {writingSubmitted ? (
          <p className="writing-submitted-message mt-3">
            ✅ Resposta salva. O professor poderá corrigir o texto após a entrega.
          </p>
        ) : null}
      </article>

      {/* --- Prática de Fala --- */}
      <article className={`lesson-section-card ${hasEntered ? 'is-visible' : ''}`}>
        <div className="article-header">
          <Mic className="article-header-icon" />
          <h2 className="article-header-title">Prática de fala</h2>
        </div>
        <p className="voice-description">
          Grave uma resposta curta para praticar pronúncia e entonação.
        </p>

        <div className="flex flex-wrap gap-3">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="btn-horizonte btn-secondary"
              disabled={Boolean(voiceUrl)}
            >
              <Mic size={16} className="btn-icon" />
              {voiceUrl ? 'Gravação já salva' : 'Gravar resposta'}
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="btn-horizonte btn-danger"
            >
              <MicOff size={16} className="btn-icon" />
              Parar gravação
            </button>
          )}

          {voiceUrl && (
            <button
              type="button"
              onClick={handleVoiceReset}
              className="btn-horizonte btn-secondary"
            >
              <XCircle size={16} className="btn-icon" />
              Remover
            </button>
          )}
        </div>

        {voiceError ? <p className="voice-error">{voiceError}</p> : null}

        {voiceUrl ? (
          <div className="audio-preview mt-4">
            <audio controls src={voiceUrl} className="audio-player" />
            <p className="audio-preview-message">✅ Sua gravação ficou salva nesta sessão.</p>
          </div>
        ) : null}
      </article>

      {/* --- Toast Notifications --- */}
      {toast ? (
        <div className={`lesson-toast lesson-toast--${toast.tone}`}>
          <p className="lesson-toast-title">{toast.title}</p>
          <p className="lesson-toast-message">{toast.description}</p>
        </div>
      ) : null}
    </div>
  );
};

export default LessonClientPage;
