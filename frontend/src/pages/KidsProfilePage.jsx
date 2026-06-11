import React from 'react';
import { Star, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const KidsProfilePage = () => {
  const { user } = useAuth();

  const badges = [
    'Explorador(a) de palavras',
    'Amigo(a) do espanhol',
    'Aventureiro(a) curioso(a)',
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 p-8 shadow-sm dark:border-blue-900 dark:from-blue-950/40 dark:via-cyan-950/30 dark:to-emerald-950/40">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-slate-900/70 dark:text-blue-200">
              Meu cantinho
            </span>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Olá, {user?.name || 'Aventureiro(a)'}!</h1>
            <p className="mt-2 max-w-2xl text-slate-700 dark:text-slate-300">
              Aqui fica o perfil infantil: um espaço leve para celebrar conquistas e manter a motivação em alta.
            </p>
          </div>
          <div className="inline-flex rounded-2xl bg-white/80 p-3 text-blue-700 dark:bg-slate-900/70 dark:text-blue-200">
            <Star className="h-6 w-6" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {badges.map((badge) => (
          <article key={badge} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 inline-flex rounded-xl bg-amber-50 p-2 text-amber-700 dark:bg-amber-950 dark:text-amber-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{badge}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 inline-flex rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Conta protegida</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            O acesso está vinculado a uma conta supervisionada, com ambiente preparado para uma experiência segura e amigável.
          </p>
        </article>

        <article className="rounded-2xl border border-pink-200 bg-pink-50 p-6 shadow-sm dark:border-pink-900 dark:bg-pink-950/40">
          <div className="mb-3 inline-flex rounded-xl bg-white/80 p-3 text-pink-700 dark:bg-pink-900 dark:text-pink-200">
            <Heart className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dica do dia</h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            Aprender brincando funciona melhor quando a criança repete palavras em voz alta e comemora cada pequena conquista.
          </p>
        </article>
      </section>
    </div>
  );
};

export default KidsProfilePage;
