import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Clock3,
  LifeBuoy,
  Mail,
  Send,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/use-toast';
import { activityService, contactMessageService } from '../services/storageService';
import OriAssistant from '../components/ui/OriAssistant';

const initialFormState = {
  name: '',
  email: '',
  category: 'pedagogico',
  subject: '',
  message: '',
};

const ContactPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(() => ({
    ...initialFormState,
    name: user?.name || '',
    email: user?.email || '',
  }));
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: prev.name || user?.name || '',
      email: prev.email || user?.email || '',
    }));
  }, [user]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (field === 'email') {
      setEmailError('');
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError('Digite um e-mail válido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateEmail(formData.email.trim())) {
      toast({
        title: 'E-mail inválido',
        description: 'Digite um endereço de e-mail válido.',
      });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      category: formData.category,
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      userId: user?.id || formData.email.trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      toast({
        title: 'Preencha os campos principais',
        description: 'Informe nome, e-mail, assunto e mensagem para enviar ao administrador.',
      });
      return;
    }

    const createdMessage = contactMessageService.create(payload);

    if (createdMessage) {
      activityService.add({
        studentId: user?.id || payload.email,
        studentName: payload.name,
        type: 'contact_message',
        activity: `Enviou uma mensagem para a administração: “${payload.subject}”.`,
      });

      setFormData({
        ...initialFormState,
        name: user?.name || payload.name,
        email: user?.email || payload.email,
      });

      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);

      toast({
        title: 'Mensagem enviada ao admin',
        description: 'A administração recebeu seu contato e deve retornar em até 1 dia útil.',
      });
    }
  };

  return (
    <div className="contact-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ========== HERO SECTION - TOPO DA PÁGINA ========== */}
      <section className="contact-hero bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* Lado esquerdo - Informação principal */}
          <div className="flex-1">
            <span className="contact-badge inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
              Canal do aluno com a administração
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-slate-900 dark:text-white mt-4">
              Contato e suporte
            </h1>
            <p className="max-w-2xl text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Este espaço foi pensado para o aluno falar diretamente com a administração da escola.
              Use o formulário abaixo para contato formal e claro sobre qualquer assunto acadêmico ou administrativo.
            </p>
            
            {/* Métricas rápidas - elementos de confiança */}
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Resposta em até 1 dia útil</span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Canal oficial do estudante</span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span>Atendimento personalizado</span>
              </div>
            </div>
          </div>

          {/* Lado direito - Card de como funciona */}
          <div className="w-full lg:w-64 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md border border-blue-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
              📋 Como funciona este canal
            </h3>
            <ul className="space-y-2">
              {[
                'O aluno envia a mensagem pelo formulário abaixo',
                'A administração recebe o assunto e o conteúdo',
                'O retorno acontece em até 1 dia útil'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ========== ÁREA PRINCIPAL - ESTRUTURA EM "F" ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ========== COLUNA ESQUERDA - FORMULÁRIO ========== */}
        <div className="lg:col-span-2 order-1">
          <form id="formulario-contato" onSubmit={handleSubmit} className="contact-form-panel bg-white dark:bg-slate-900 rounded-xl shadow-md p-6">
            
            {/* Título do formulário */}
            <div className="mb-6 pb-3 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-headline font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="h-5 w-5 text-accent" />
                Escrever para a administração
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Preencha sua mensagem com contexto suficiente para o admin conseguir responder mais rápido.
              </p>
            </div>

            {/* Campos do formulário */}
            <div className="space-y-5">
              
              {/* Linha 1: Nome e Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nome completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange('name')}
                    placeholder="Seu nome"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    onBlur={(e) => validateEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
                </div>
              </div>

              {/* Linha 2: Categoria e Assunto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={handleChange('category')}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="pedagogico">📚 Dúvida pedagógica</option>
                    <option value="acesso">🔐 Acesso à plataforma</option>
                    <option value="pagamento">💰 Pagamento / plano</option>
                    <option value="geral">📝 Assunto geral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Assunto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={handleChange('subject')}
                    placeholder="Resumo da sua mensagem"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Linha 3: Mensagem */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Mensagem <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={handleChange('message')}
                  placeholder="Escreva sua mensagem para o administrador..."
                  rows={6}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                />
              </div>

              {/* Botão de envio e informação complementar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  {isSubmitted && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Mensagem enviada com sucesso!</span>
                    </div>
                  )}
                  {!isSubmitted && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Ao enviar, sua mensagem fica registrada como um contato oficial do aluno
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="contact-submit-btn inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Send className="h-4 w-4" />
                  <span>Enviar mensagem</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ========== COLUNA DIREITA - SIDEBAR ========== */}
        <div className="lg:col-span-1 order-2 space-y-6">
          
          {/* Card 1: Contato direto */}
          <article className="contact-channel-card bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30 transition-all hover:shadow-md">
            <div className="inline-flex rounded-xl bg-blue-100 dark:bg-blue-900/50 p-3 text-blue-700 dark:text-blue-300 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Contato direto com a administração
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Use o formulário ao lado para enviar sua solicitação ao setor responsável. 
              Este é o canal oficial da escola para questões administrativas e pedagógicas.
            </p>
            <a
              href="#formulario-contato"
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Ir para o formulário
              <ArrowRight className="h-4 w-4" />
            </a>
          </article>

          {/* Card 2: Ori Assistant */}
          <article className="contact-channel-card bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/30 transition-all hover:shadow-md">
            <div className="inline-flex rounded-xl bg-emerald-100 dark:bg-emerald-900/50 p-3 text-emerald-700 dark:text-emerald-300 mb-4">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Ajuda rápida com Ori
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              A Ori está disponível para responder dúvidas comuns sobre o curso e guiar você nos próximos passos.
            </p>
            <div className="mt-4">
              <OriAssistant />
            </div>
          </article>

          {/* Card 3: Dica rápida */}
          <article className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 border border-amber-200 dark:border-amber-800/30">
            <div className="flex items-start gap-3">
              <div className="inline-flex rounded-full bg-amber-100 dark:bg-amber-900/50 p-2 text-amber-700 dark:text-amber-300">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                  Dica para um atendimento mais rápido
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  Seja específico(a) sobre sua dúvida. Informe seu nome completo, turma e o assunto claramente.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;