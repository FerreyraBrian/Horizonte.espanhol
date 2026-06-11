import React from 'react';
import { BookOpenText, PlayCircle, Download, ClipboardCheck, Headphones, CheckCircle2 } from 'lucide-react';

const LessonClientPage = ({ lesson, onComplete }) => {
  if (!lesson) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-slate-700 dark:text-slate-300">Lição não encontrada.</p>
      </div>
    );
  }

  const hasAudio = lesson.listeningExercise?.audioUrl && lesson.listeningExercise.audioUrl !== '#';

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          {lesson.level || 'Aula'}
        </span>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{lesson.title}</h1>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{lesson.fullSummary}</p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <PlayCircle className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Vídeo da aula</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
          <iframe
            width="100%"
            height="420"
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
            {lesson.slides.map((slide, index) => (
              <div key={index} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <h3 className="font-semibold text-slate-900 dark:text-white">{slide.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{slide.content}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Download className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Materiais de apoio</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {lesson.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
              >
                <Download className="h-4 w-4" />
                {resource.name}
              </a>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Prévia do quiz</h2>
          </div>
          <ul className="space-y-3">
            {lesson.quiz.questions.map((q, idx) => (
              <li key={idx} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <p className="font-semibold text-slate-900 dark:text-white">{q.question}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Opções: {q.options.join(', ')}</p>
              </li>
            ))}
          </ul>
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

          {(lesson.listeningExercise.questions ?? []).length > 0 ? (
            <ul className="space-y-3">
              {lesson.listeningExercise.questions.map((q, idx) => (
                <li key={idx} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <p className="font-semibold text-slate-900 dark:text-white">{q.question}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Opções: {q.options.join(', ')}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">Nenhuma pergunta extra de escuta nesta lição.</p>
          )}
        </article>
      </section>

      <button
        onClick={() => onComplete(lesson.id)}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        <CheckCircle2 className="h-4 w-4" />
        Marcar como concluída
      </button>
    </div>
  );
};

export default LessonClientPage;
