import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, X, Bot, BookOpenText, GraduationCap } from 'lucide-react';

const faqData = [
  {
    id: 'faq-01',
    keywords: ['começar', 'inicio', 'começo', 'iniciar', 'curso', 'aula', 'lição', 'licao'],
    answer:
      'Você pode começar abrindo a área de aulas no painel. A primeira lição já está disponível e a sequência do curso foi pensada para você avançar com calma e confiança.',
  },
  {
    id: 'faq-02',
    keywords: ['assinatura', 'incluso', 'inclui', 'planos', 'pacote', 'benefício', 'beneficios'],
    answer:
      'A assinatura inclui aulas em vídeo, materiais de apoio, avaliações, fórum de dúvidas e um espaço de ajuda com a Ori para orientar seus próximos passos.',
  },
  {
    id: 'faq-03',
    keywords: ['materiais', 'extras', 'acesso', 'download', 'recursos', 'pdf', 'áudio', 'audio'],
    answer:
      'Os materiais extras ficam na seção de Materiais do aluno. Lá você encontra PDFs, áudios e conteúdos complementares para praticar depois de cada lição.',
  },
  {
    id: 'faq-04',
    keywords: ['gramática', 'gramatica', 'dúvidas', 'duvidas', 'suporte', 'ajuda'],
    answer:
      'Sim, posso te orientar com dúvidas comuns de gramática e te indicar o módulo mais útil. Para pedidos mais específicos, o fórum e o canal de contato também são boas opções.',
  },
  {
    id: 'faq-05',
    keywords: ['conversação', 'conversacao', 'falar', 'fluência', 'prática', 'pratica', 'pronúncia', 'pronuncia'],
    answer:
      'Para melhorar a conversação, combine repetição ativa com escuta, leitura curta e fala em voz alta. Eu recomendo praticar uma frase nova por dia e revisar as aulas em sequência.',
  },
  {
    id: 'faq-06',
    keywords: ['avaliação', 'avaliacao', 'prova', 'teste', 'nota'],
    answer:
      'As avaliações aparecem conforme o avanço nas aulas. Quando você concluir os módulos necessários, a plataforma libera o próximo desafio para você.',
  },
];

const quickPrompts = [
  'Como começo meu curso?',
  'O que inclui a assinatura?',
  'Como acesso o material extra?',
  'Como melhorar a conversação?',
];

const findAnswer = (message) => {
  const normalized = message.toLowerCase();
  const match = faqData.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword)),
  );

  if (match) {
    return match.answer;
  }

  return 'Estou aqui para te ajudar com o curso. Pergunte sobre aulas, materiais, avaliação ou conversação e eu te guio com carinho.';
};

const OriAssistant = () => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Olá! Eu sou a Ori. Estou pronta para te guiar pelo curso, responder dúvidas rápidas e ajudar você a continuar.',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (sender, text) => {
    setMessages((current) => [...current, { sender, text }]);
  };

  const handleSendMessage = (text) => {
    const cleanedText = text.trim();

    if (!cleanedText) {
      return;
    }

    addMessage('user', cleanedText);
    setIsTyping(true);

    window.setTimeout(() => {
      addMessage('bot', findAnswer(cleanedText));
      setIsTyping(false);
    }, 650);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSendMessage(inputValue);
    setInputValue('');
  };

  const handleQuickPrompt = (prompt) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="ori-assistant">
      <button
        type="button"
        className={`ori-toggle-button ${open ? 'open' : ''}`}
        aria-label={open ? 'Fechar Ori' : 'Abrir Ori'}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="ori-toggle-icon">
          <Sparkles size={18} />
        </span>
        <span className="ori-toggle-copy">
          <span className="ori-toggle-label">Ori</span>
          <span className="ori-toggle-caption">Ajuda rápida</span>
        </span>
      </button>

      {open && (
        <div className="ori-panel" role="dialog" aria-label="Assistente Ori">
          <div className="ori-header">
            <div className="ori-header-copy">
              <div className="ori-avatar-pill">
                <Bot size={16} />
              </div>
              <div>
                <p className="ori-title">Ori</p>
                <p className="ori-subtitle">Assistente do curso</p>
              </div>
            </div>
            <button
              type="button"
              className="ori-close-button"
              onClick={() => setOpen(false)}
              aria-label="Fechar Ori"
            >
              <X size={16} />
            </button>
          </div>

          <div className="ori-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`ori-message ori-message-${message.sender}`}
              >
                <div className="ori-message-content">
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping ? (
              <div className="ori-message ori-message-bot">
                <div className="ori-message-content ori-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <div className="ori-quick-prompts">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="ori-quick-prompt"
                onClick={() => handleQuickPrompt(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="ori-support-strip">
            <div className="ori-support-pill">
              <BookOpenText size={14} />
              <span>Aulas</span>
            </div>
            <div className="ori-support-pill">
              <GraduationCap size={14} />
              <span>Progresso</span>
            </div>
          </div>

          <form className="ori-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Pergunte algo para a Ori..."
              aria-label="Mensagem para Ori"
            />
            <button type="submit" aria-label="Enviar pergunta" className="ori-send-button">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OriAssistant;
