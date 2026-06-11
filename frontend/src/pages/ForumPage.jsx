import React, { useEffect, useMemo, useState } from 'react';
import { Heart, Lock, MessageSquare, Send, ShieldAlert, Sparkles, Users } from 'lucide-react';
import UserAvatar from '../components/ui/UserAvatar';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/use-toast';
import { activityService, forumService, permissionService, studentService } from '../services/storageService';

const formatRelativeTime = (value) => {
  if (!value) {
    return 'agora';
  }

  const difference = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(difference / 60000));

  if (minutes < 60) {
    return `há ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  }

  const days = Math.floor(hours / 24);
  return `há ${days} dia${days > 1 ? 's' : ''}`;
};

const ForumPage = () => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingToId, setReplyingToId] = useState(null);

  const loadPosts = () => {
    setPosts(forumService.getAll());
  };

  useEffect(() => {
    loadPosts();
    window.addEventListener('storage', loadPosts);

    return () => window.removeEventListener('storage', loadPosts);
  }, []);

  const studentRecord = useMemo(() => {
    if (!user) {
      return null;
    }

    const email = String(user.email || '').toLowerCase();
    return studentService.getById(user.id)
      || studentService.getAll().find((student) => String(student.email || '').toLowerCase() === email)
      || null;
  }, [user]);

  const role = user?.role || 'STUDENT';
  const accountStatus = user?.status || studentRecord?.status || 'active';
  const canViewForum = permissionService.hasPermission(role, 'canViewForum');
  const canPostForum = permissionService.hasPermission(role, 'canPostForum');
  const isActiveAccount = accountStatus === 'active';
  const canInteract = Boolean(user && canViewForum && canPostForum && isActiveAccount);

  const metrics = useMemo(() => {
    const totalReplies = posts.reduce((sum, post) => sum + (post.replies?.length ?? 0), 0);
    const participants = new Set(
      posts.flatMap((post) => [
        post.user?.name,
        ...(post.replies || []).map((reply) => reply.user?.name),
      ]).filter(Boolean)
    );

    return {
      totalPosts: posts.length,
      totalReplies,
      participants: participants.size,
    };
  }, [posts]);

  const blockedReason = useMemo(() => {
    if (!canViewForum) {
      return 'Seu perfil não tem permissão para acessar o fórum da comunidade.';
    }

    if (!isActiveAccount) {
      return 'Somente alunos com status ativo podem publicar, curtir e responder no fórum.';
    }

    if (!canPostForum) {
      return 'Seu perfil pode visualizar o fórum, mas está sem permissão para publicar no momento.';
    }

    return '';
  }, [canPostForum, canViewForum, isActiveAccount]);

  const ensureInteractionAllowed = () => {
    if (canInteract) {
      return true;
    }

    toast({
      title: 'Interação indisponível',
      description: blockedReason || 'Seu perfil não pode interagir no fórum agora.',
    });
    return false;
  };

  const handleLike = (postId, replyId = null) => {
    if (!ensureInteractionAllowed()) {
      return;
    }

    forumService.toggleLike(postId, user?.id || user?.email || user?.name || 'forum-user', replyId);
    loadPosts();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!newMessage.trim() || !ensureInteractionAllowed()) {
      return;
    }

    const createdPost = forumService.createPost({
      user,
      message: newMessage.trim(),
    });

    if (createdPost) {
      activityService.add({
        studentId: user?.id || user?.email || 'forum-user',
        studentName: user?.name || 'Aluno ativo',
        type: 'forum_post',
        activity: 'Publicou uma nova mensagem no fórum da comunidade.',
      });
      setNewMessage('');
      loadPosts();
      toast({
        title: 'Mensagem publicada',
        description: 'Sua mensagem já está visível para os demais alunos ativos.',
      });
    }
  };

  const handleReplySubmit = (event, postId) => {
    event.preventDefault();
    const draft = replyDrafts[postId]?.trim();

    if (!draft || !ensureInteractionAllowed()) {
      return;
    }

    const updatedThread = forumService.addReply(postId, {
      user,
      message: draft,
    });

    if (updatedThread) {
      activityService.add({
        studentId: user?.id || user?.email || 'forum-user',
        studentName: user?.name || 'Aluno ativo',
        type: 'forum_post',
        activity: 'Respondeu uma conversa no fórum da comunidade.',
      });
      setReplyDrafts((prev) => ({ ...prev, [postId]: '' }));
      setReplyingToId(null);
      loadPosts();
      toast({
        title: 'Resposta enviada',
        description: 'Sua resposta já aparece na conversa.',
      });
    }
  };

  const PostComponent = ({ post, isReply = false, postId }) => {
    const showReplyComposer = !isReply && replyingToId === postId;

    return (
      <div className={`forum-post ${isReply ? 'forum-post-reply' : 'forum-post-main-card'}`}>
        <UserAvatar name={post.user.name} className="forum-avatar" />
        <div className="forum-post-content">
          <div className="forum-post-header">
            <div className="forum-author-block">
              <p className={`forum-author ${post.isInstructor ? 'forum-author-instructor' : ''}`}>
                {post.user.name}
              </p>
              <span className={`forum-role-chip ${post.isInstructor ? 'forum-role-chip-instructor' : 'forum-role-chip-student'}`}>
                {post.isInstructor ? 'Instrutor' : 'Aluno ativo'}
              </span>
            </div>
            <span className="forum-time">{formatRelativeTime(post.createdAt)}</span>
          </div>
          <div className={`forum-message ${isReply ? 'forum-message-reply' : 'forum-message-main'}`}>
            {post.post}
          </div>
          <div className="forum-actions">
            <button
              type="button"
              onClick={() => handleLike(postId, isReply ? post.id : null)}
              className="forum-action-btn"
              disabled={!canInteract}
              title={canInteract ? 'Curtir mensagem' : blockedReason}
            >
              <Heart className="h-4 w-4" />
              <span>Curtir</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="forum-page forum-container">
      {canViewForum ? (
        <>

          {/* Premium Hero Section (Cartelera style) */}
          <section className="forum-hero rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-8">
            <div className="forum-hero-grid flex flex-col gap-3 md:gap-5 max-w-md mx-auto px-2 py-1 bg-white/80 dark:bg-slate-900/80 rounded-xl shadow-sm">
              <span className="forum-badge inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-200 self-start">
                Espaço de interação da comunidade
              </span>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Fórum da Comunidade</h1>
              <p className="text-slate-600 dark:text-slate-300">
                Tire dúvidas, interaja com outros alunos ativos e compartilhe mensagens com a comunidade.
              </p>
              <div className="forum-stat-row mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="forum-pill"><Users className="h-4 w-4" /> {metrics.participants} participantes</span>
                <span className="forum-pill"><MessageSquare className="h-4 w-4" /> {metrics.totalPosts} tópicos</span>
                <span className="forum-pill"><Sparkles className="h-4 w-4" /> {metrics.totalReplies} respostas</span>
              </div>
            </div>
            <aside className="forum-hero-preview hidden md:block mt-8 md:mt-0 md:absolute md:right-12 md:top-1/2 md:-translate-y-1/2">
              <span className="forum-preview-kicker inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                Espaço seguro
              </span>
              <h2 className="forum-preview-title mt-2 text-lg font-semibold text-slate-900 dark:text-white">Compartilhe, aprenda e cresça</h2>
              <p className="forum-preview-text mt-1 text-slate-600 dark:text-slate-300">Este fórum é moderado para garantir um ambiente respeitoso e colaborativo para todos os alunos.</p>
            </aside>
          </section>

          {!canInteract && (
            <div className="forum-permission-banner is-warning">
              <Lock className="h-5 w-5" />
              <div>
                <strong>Interação liberada apenas para alunos ativos</strong>
                <p>{blockedReason}</p>
              </div>
            </div>
          )}

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="forum-feed-panel rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 inline-flex rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Discussões da comunidade</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Participe das conversas, compartilhe experiências e ajude outros alunos a evoluir.
              </p>

              <div className="mt-4 space-y-3">
                {posts.length > 0 ? posts.map((post) => (
                  <PostComponent
                    key={post.id}
                    post={post}
                    postId={post.id}
                  />
                )) : (
                  <div className="forum-empty">
                    Ainda não há conversas publicadas. Seja o primeiro aluno ativo a iniciar a comunidade.
                  </div>
                )}
              </div>

              <div className="forum-input-section mt-6">
                <form onSubmit={handleSubmit} className="forum-form">
                  <textarea
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    placeholder={canInteract ? 'Compartilhe uma dúvida, dica ou mensagem com a comunidade...' : 'A publicação está disponível apenas para alunos ativos com permissão no fórum.'}
                    className="forum-input forum-input-textarea"
                    disabled={!canInteract}
                    rows={3}
                  />
                  <div className="forum-submit-row">
                    <p className="forum-helper-text">
                      {canInteract ? 'Seu comentário será visível para os alunos ativos e instrutores.' : blockedReason}
                    </p>
                    <button
                      type="submit"
                      className="forum-submit-btn"
                      disabled={!canInteract}
                    >
                      <Send className="h-4 w-4" />
                      <span>Publicar</span>
                    </button>
                  </div>
                </form>
              </div>
            </article>

            <div className="space-y-4">
              <article className="forum-side-card forum-side-card-blue rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 inline-flex rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dicas para participar</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                  <li>Respeite todos os participantes e mantenha o foco no aprendizado.</li>
                  <li>Compartilhe dúvidas, dicas e experiências para ajudar a comunidade.</li>
                  <li>Evite mensagens fora do contexto do curso.</li>
                </ul>
              </article>

              <article className="forum-side-card forum-side-card-green rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/40">
                <div className="mb-3 inline-flex rounded-xl bg-white/80 p-3 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Por que participar?</h2>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  Interagir no fórum acelera o aprendizado, amplia a visão sobre o idioma e fortalece a comunidade.
                </p>
              </article>
            </div>
          </section>
        </>
      ) : (
        <div className="forum-access-card">
          <ShieldAlert className="h-5 w-5" />
          <div>
            <h1>Fórum da Comunidade</h1>
            <p>Seu perfil não possui acesso ao fórum neste momento. Verifique as permissões com a administração.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForumPage;