import React, { useState } from 'react';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';

const faqData = [
  {
    id: 'faq-01',
    question: 'Como começo meu curso?',
    keywords: ['começar', 'inicio', 'começo', 'iniciar', 'curso'],
    answer:
      'Comece acessando o painel de aluno depois do login. A primeira lição está disponível em "Minhas Aulas" e o curso segue em ordem para você avançar com segurança.',
  },
  {
    id: 'faq-02',
    question: 'O que inclui a assinatura?',
    keywords: ['assinatura', 'incluso', 'inclui', 'planos', 'pacote'],
    answer:
      'A assinatura inclui acesso às aulas em vídeo, materiais de apoio, avaliações, fórum de dúvidas e suporte da Ori para perguntas frequentes sobre o curso.',
  },
  {
    id: 'faq-03',
    question: 'Como eu acesso os materiais extras?',
    keywords: ['materiais', 'extras', 'acesso', 'download', 'recursos'],
    answer:
      'Os materiais extras estão em "Materiais" no menu do aluno. Lá você encontra PDFs, áudios e conteúdo adicional para praticar após cada lição.',
  },
  {
    id: 'faq-04',
    question: 'Tenho suporte para dúvidas de gramática?',
    keywords: ['gramática', 'gramatica', 'dúvidas', 'duvidas', 'suporte'],
    answer:
      'Sim, Ori pode ajudar com dúvidas comuns de gramática e indicar os módulos relevantes. Para dúvidas mais específicas, use o fórum ou entre em contato com a equipe pelo painel de suporte.',
  },
  {
    id: 'faq-05',
    question: 'Como melhorar a conversação no espanhol?',
    keywords: ['conversação', 'conversacao', 'falar', 'fluência', 'prática'],
    answer:
      'Pratique todos os dias com as frases certas, escute áudios do curso e use as lições em ordem. Foque em repetição ativa e tente falar em voz alta quando revisar as aulas.',
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

  return (
    'Desculpa, ainda estou aprendendo. Pergunte sobre acesso, assinatura, materiais ou conversação no curso.'
  );
};

const OriAssistant = () => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Olá! Eu sou a Ori. Posso ajudar com dúvidas sobre o curso, assinatura e materiais.',
    },
  ]);

  const handleSendMessage = (text) => {
    if (!text.trim()) {
      return;
    }

    const userMessage = { sender: 'user', text };
    const botMessage = { sender: 'bot', text: findAnswer(text) };

    setMessages((current) => [...current, userMessage, botMessage]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      return;
    }

    handleSendMessage(inputValue.trim());
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
        <span className="ori-toggle-label">Ori</span>
      </button>

      {open && (
        <div className="ori-panel" role="dialog" aria-label="Assistente Ori">
          <div className="ori-header">
            <div>
              <p className="ori-title">Ori</p>
              <p className="ori-subtitle">Assistente do curso</p>
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
                <div className="ori-message-content">{message.text}</div>
              </div>
            ))}
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
