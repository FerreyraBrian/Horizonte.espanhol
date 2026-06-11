import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ArrowRight } from 'lucide-react';

const FeaturePlaceholderPage = ({
  title,
  description,
  actionLabel = 'Voltar ao painel',
  actionTo = '/dashboard',
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="inline-flex rounded-2xl bg-violet-50 p-3 text-violet-700 dark:bg-violet-950 dark:text-violet-200">
        <Rocket className="h-6 w-6" />
      </div>
      <div className="mt-5 space-y-3">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          Em desenvolvimento
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="max-w-2xl text-slate-600 dark:text-slate-300">{description}</p>
      </div>
      <Link
        to={actionTo}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default FeaturePlaceholderPage;
