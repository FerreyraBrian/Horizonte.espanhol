import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Star, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { kidsCourses } from '../services/mockData';

const KidsEvaluationsPage = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-pink-200 bg-gradient-to-r from-pink-50 via-amber-50 to-blue-50 p-8 shadow-sm dark:border-pink-900 dark:from-pink-950/40 dark:via-amber-950/30 dark:to-blue-950/40">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-pink-700 dark:bg-slate-900/70 dark:text-pink-200">
              Missões especiais
            </span>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Avaliações infantis</h1>
            <p className="mt-2 max-w-2xl text-slate-700 dark:text-slate-300">
              Os pequenos podem revisar o que aprenderam com desafios leves, divertidos e cheios de incentivo positivo.
            </p>
          </div>
          <div className="inline-flex rounded-2xl bg-white/80 p-3 text-pink-700 dark:bg-slate-900/70 dark:text-pink-200">
            <Trophy className="h-6 w-6" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {kidsCourses.map((course) => {
          const checkpoints = [
            { label: 'Desafio 1', description: 'Revisão das primeiras aventuras.' },
            { label: 'Desafio 2', description: 'Vocabulário, escuta e associação.' },
            { label: 'Desafio final', description: 'Missão completa com estrelas de conquista.' },
          ];

          return (
            <article key={course.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="inline-flex rounded-xl bg-pink-50 p-3 text-pink-700 dark:bg-pink-950 dark:text-pink-200">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-pink-700 dark:text-pink-300">Aventura {course.level}</p>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{course.title}</h2>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {checkpoints.map((checkpoint) => (
                  <div key={checkpoint.label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <ClipboardCheck className="h-4 w-4 text-blue-600" />
                      {checkpoint.label}
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{checkpoint.description}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/painel-infantil"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-pink-700 hover:text-pink-800 dark:text-pink-300"
              >
                <Sparkles className="h-4 w-4" />
                Voltar para as aulas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default KidsEvaluationsPage;
