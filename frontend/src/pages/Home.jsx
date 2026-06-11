import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Facebook,
  Instagram,
  CheckCircle2,
  Globe,
  HeartHandshake,
  MessageCircle,
  Moon,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Users,
  Send,
} from 'lucide-react';
import { contactMessageService } from '../services/storageService';

const pillars = [
  {
    icon: BookOpen,
    title: 'Trilha clara do zero à conversação',
    text: 'Você entra sabendo exatamente o que estudar, em que ordem e como avançar sem ficar perdida entre materiais soltos.',
  },
  {
    icon: Globe,
    title: 'Espanhol pensado para brasileiros',
    text: 'A metodologia trabalha os erros mais comuns de quem fala português e acelera sua segurança para ouvir, ler e falar.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompanhamento que sustenta constância',
    text: 'Avisos, materiais, fórum e suporte foram organizados para ajudar você a continuar estudando sem perder ritmo.',
  },
];

const transformations = [
  'Parar de travar em viagens, reuniões e conversas simples.',
  'Estudar com uma rotina objetiva em vez de depender de motivação.',
  'Ganhar repertório para compreender séries, músicas e conteúdos reais.',
];

const proofs = [
  { value: '190+', label: 'aulas e materiais de apoio' },
  { value: 'A1-C2', label: 'progressão estruturada por níveis' },
  { value: 'Infantil + Adulto', label: 'experiência pensada para diferentes perfis' },
];

const socialLinks = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/?text=Olá%20Horizonte%20Espanhol!%20Quero%20saber%20mais%20sobre%20o%20curso.',
    icon: MessageCircle,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/horizonte.espanhol/',
    icon: Instagram,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/people/Horizonte-Espanhol/pfbid0mZ7drCfv5gUvJPaTiv3FhNXU4EUvs23xU3pxX6nmyv41SKzuBrbdeAwzPCLSuukhl/',
    icon: Facebook,
  },
];

const Home = () => {
  const [theme, setTheme] = useState('light');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadFeedback, setLeadFeedback] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    localStorage.setItem('theme', nextTheme);
  };

  const handleLeadSubmit = (event) => {
    event.preventDefault();
    setLeadFeedback('');

    if (!leadEmail.trim()) {
      setLeadFeedback('Informe seu e-mail para receber nossa proposta.');
      return;
    }

    if (!leadMessage.trim()) {
      setLeadFeedback('Conte o que você busca aprender para montarmos o melhor caminho.');
      return;
    }

    setIsSubmittingLead(true);

    try {
      contactMessageService.create({
        name: leadName.trim() || 'Interessado no curso',
        email: leadEmail.trim(),
        category: 'course_interest',
        subject: 'Interesse no curso - Landing page',
        message: leadMessage.trim(),
      });

      setLeadFeedback('Recebido! Vamos entrar em contato com os próximos passos para sua matrícula.');
      setLeadName('');
      setLeadEmail('');
      setLeadMessage('');
    } catch {
      setLeadFeedback('Não foi possível enviar agora. Tente novamente em instantes.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
  <div className="marketing-home">
    <header className="marketing-topbar">
      <Link to="/" className="marketing-brand">
        <span className="marketing-brand-mark">
          <Star className="h-4 w-4" />
          <BookOpen className="h-4 w-4" />
        </span>
        <span>Horizonte Espanhol</span>
      </Link>

      <nav className="marketing-topbar-actions">
        <button type="button" className="marketing-theme-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</span>
        </button>
        <Link to="/login" className="marketing-link-secondary">Entrar</Link>
        <Link to="/register" className="marketing-link-primary">Quero me matricular</Link>
      </nav>
    </header>

    <main className="marketing-shell">
      <section className="marketing-hero">
        <div className="marketing-hero-grid">
          <div className="marketing-hero-copy">
            <span className="marketing-kicker">
              <Sparkles className="h-4 w-4" />
              Curso online de espanhol com foco em resultado real
            </span>

            <h1>Aprenda espanhol com um plano que faz você sair da intenção e entrar em ação.</h1>

            <p>
              Horizonte Espanhol foi desenhado para quem quer finalmente estudar com direção, manter constância
              e sentir evolução clara na prática. Em vez de acumular conteúdo solto, você entra em uma jornada guiada
              que transforma estudo em progresso visível.
            </p>

            <div className="marketing-proof-strip">
              <span><BadgeCheck className="h-4 w-4" /> Acesso imediato</span>
              <span><ShieldCheck className="h-4 w-4" /> Método estruturado</span>
              <span><Users className="h-4 w-4" /> Comunidade e suporte</span>
            </div>

            <div className="marketing-cta-row">
              <Link to="/register" className="marketing-cta-primary">
                Começar agora
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/login" className="marketing-cta-secondary">
                Já sou aluna
              </Link>
            </div>

            <p className="marketing-microcopy">
              Ideal para quem quer viajar, trabalhar, estudar ou viver experiências em espanhol com muito mais confiança.
            </p>
          </div>

          <aside className="marketing-hero-card">
            <span className="marketing-card-kicker">
              <PlayCircle className="h-4 w-4" />
              O que você compra aqui
            </span>
            <h2>Uma experiência completa de aprendizagem, não apenas aulas soltas.</h2>
            <ul className="marketing-check-list">
              <li><CheckCircle2 className="h-4 w-4" /> Trilhas organizadas por nível</li>
              <li><CheckCircle2 className="h-4 w-4" /> Materiais para revisão e prática</li>
              <li><CheckCircle2 className="h-4 w-4" /> Espaço infantil e acompanhamento</li>
              <li><CheckCircle2 className="h-4 w-4" /> Fórum, avisos e contato com a equipe</li>
            </ul>

            <div className="marketing-card-highlight">
              <strong>Você não precisa de mais conteúdo.</strong>
              <p>Você precisa de um caminho certo para seguir até conseguir usar o espanhol de verdade.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="marketing-metrics">
        {proofs.map((proof) => (
          <article key={proof.label} className="marketing-metric-card">
            <strong>{proof.value}</strong>
            <span>{proof.label}</span>
          </article>
        ))}
      </section>

      <section className="marketing-f-layout">
        <div className="marketing-f-main">
          <div className="marketing-panel">
            <span className="marketing-section-kicker">Por que converte</span>
            <h2>O curso foi pensado para reduzir abandono e aumentar percepção de avanço.</h2>
            <div className="marketing-pillars">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;

                return (
                  <article key={pillar.title} className="marketing-pillar-card">
                    <span className="marketing-pillar-icon"><Icon className="h-5 w-5" /></span>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="marketing-f-secondary">
          <aside className="marketing-panel marketing-panel-accent">
            <span className="marketing-section-kicker">O resultado desejado</span>
            <h2>Você entra para viver esta transformação:</h2>
            <ul className="marketing-transform-list">
              {transformations.map((item) => (
                <li key={item}>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="marketing-closing-cta">
              <p>Se você já tentou aprender antes e sentiu que faltava direção, este é exatamente o ponto que o curso resolve.</p>
              <Link to="/register" className="marketing-cta-primary marketing-cta-primary-full">
                Garantir meu acesso
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>

    <footer className="marketing-footer">
      <div className="marketing-footer-inner">
        <div className="marketing-footer-brand marketing-footer-brand-prominent">
          <span className="marketing-footer-kicker">Entre para a próxima turma</span>
          <strong>Deixe seu contato e receba uma proposta personalizada para começar ainda esta semana.</strong>
          <p>
            Este formulário é o canal mais rápido para receber orientações de matrícula, formato do curso,
            investimento e trilha ideal para o seu objetivo com o espanhol.
          </p>

          <form className="marketing-lead-form" onSubmit={handleLeadSubmit}>
            <div className="marketing-lead-grid">
              <input
                type="text"
                value={leadName}
                onChange={(event) => setLeadName(event.target.value)}
                placeholder="Seu nome (opcional)"
              />
              <input
                type="email"
                value={leadEmail}
                onChange={(event) => setLeadEmail(event.target.value)}
                placeholder="Seu melhor e-mail"
                required
              />
            </div>

            <textarea
              value={leadMessage}
              onChange={(event) => setLeadMessage(event.target.value)}
              placeholder="Qual é seu principal objetivo com o espanhol?"
              rows={4}
              required
            />

            <div className="marketing-lead-row">
              <p>Respondemos por e-mail com o melhor plano para o seu perfil.</p>
              <button type="submit" className="marketing-lead-submit" disabled={isSubmittingLead}>
                <Send className="h-4 w-4" />
                {isSubmittingLead ? 'Enviando...' : 'Quero receber proposta'}
              </button>
            </div>

            {leadFeedback ? <p className="marketing-lead-feedback">{leadFeedback}</p> : null}
          </form>
        </div>

        <div className="marketing-footer-social">
          <h3>Canais diretos</h3>
          <p>Acompanhe conteúdos e fale com a equipe também pelas redes.</p>
          <div className="marketing-social-links">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="marketing-social-link">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  </div>
  );
};

export default Home;
