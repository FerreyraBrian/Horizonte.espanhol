import React from 'react';
import { X } from 'lucide-react';
import { useToast } from './use-toast';

const Toaster = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className='toast-viewport' aria-live='polite' aria-atomic='true'>
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`toast ${item.variant === 'destructive' ? 'toast--destructive' : ''} ${
            item.open === false ? 'toast--closing' : ''
          }`}
          role='status'
        >
          <div className='toast__content'>
            {item.title ? <strong className='toast__title'>{item.title}</strong> : null}
            {item.description ? <div className='toast__description'>{item.description}</div> : null}
            {item.action ? <div className='toast__action'>{item.action}</div> : null}
          </div>

          <button
            type='button'
            className='toast__close'
            onClick={() => dismiss(item.id)}
            aria-label='Fechar notificação'
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
