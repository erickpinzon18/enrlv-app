import { useState } from 'react';

/**
 * Modal component for alerts, confirmations, and password prompts.
 * Replaces native browser alert/prompt/confirm dialogs.
 * 
 * Types:
 *  - 'alert': Simple message with OK button (info, error, success, warning)
 *  - 'confirm': Message with Confirm/Cancel buttons
 *  - 'password': Password input with Confirm/Cancel buttons
 */

export function Modal({ isOpen, onClose, config }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen || !config) return null;

  const { type = 'alert', title, message, variant = 'info', onConfirm } = config;

  const variantStyles = {
    info:    { icon: 'ℹ️', accent: 'border-blue-400',   bg: 'bg-blue-50',   text: 'text-blue-700' },
    success: { icon: '✅', accent: 'border-green-400',  bg: 'bg-green-50',  text: 'text-green-700' },
    warning: { icon: '⚠️', accent: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700' },
    error:   { icon: '❌', accent: 'border-red-400',    bg: 'bg-red-50',    text: 'text-red-700' },
    security:{ icon: '🔒', accent: 'border-gob-maroon', bg: 'bg-red-50',    text: 'text-gob-maroon' },
  };

  const v = variantStyles[variant] || variantStyles.info;

  const handleConfirm = () => {
    if (type === 'password') {
      if (onConfirm) onConfirm(password);
      setPassword('');
    } else {
      if (onConfirm) onConfirm(true);
    }
  };

  const handleClose = () => {
    setPassword('');
    setShowPassword(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Card */}
      <div 
        className={`relative bg-white rounded-xl shadow-2xl border-l-4 ${v.accent} w-full max-w-md transform transition-all animate-[modalIn_0.2s_ease-out]`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center gap-3 px-6 py-4 ${v.bg} rounded-t-xl border-b border-gray-100`}>
          <span className="text-2xl">{v.icon}</span>
          <h3 className={`font-bold text-lg ${v.text}`}>{title || 'Aviso'}</h3>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{message}</p>

          {/* Password Input */}
          {type === 'password' && (
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Contraseña de Administrador
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); }}
                  className="form-input pr-10 text-lg tracking-widest"
                  placeholder="••••••••"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
          {type === 'alert' ? (
            <button
              onClick={handleClose}
              className="px-5 py-2 bg-gob-maroon text-white font-semibold rounded-lg hover:bg-red-900 transition text-sm shadow"
            >
              Aceptar
            </button>
          ) : (
            <>
              <button
                onClick={handleClose}
                className="px-5 py-2 text-gray-500 font-semibold rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 bg-gob-maroon text-white font-semibold rounded-lg hover:bg-red-900 transition text-sm shadow"
              >
                {type === 'password' ? 'Autorizar' : 'Confirmar'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Custom hook to manage modal state.
 * Returns modal state + helper functions to show different modal types.
 */
export function useModal() {
  const [modalState, setModalState] = useState({ isOpen: false, config: null });

  const closeModal = () => {
    setModalState(prev => {
      if (prev.config && prev.config._onCancel) {
        prev.config._onCancel();
      }
      return { isOpen: false, config: null };
    });
  };

  const showAlert = (message, { title, variant = 'info' } = {}) => {
    return new Promise(resolve => {
      setModalState({
        isOpen: true,
        config: {
          type: 'alert',
          title: title || (variant === 'error' ? 'Error' : variant === 'warning' ? 'Advertencia' : variant === 'success' ? 'Éxito' : 'Aviso'),
          message,
          variant,
          onConfirm: () => { setModalState({ isOpen: false, config: null }); resolve(true); },
          _onCancel: () => resolve(true),
        }
      });
    });
  };

  const showConfirm = (message, { title = 'Confirmar', variant = 'warning' } = {}) => {
    return new Promise(resolve => {
      setModalState({
        isOpen: true,
        config: {
          type: 'confirm',
          title,
          message,
          variant,
          onConfirm: () => { setModalState({ isOpen: false, config: null }); resolve(true); },
          _onCancel: () => resolve(false),
        }
      });
    });
  };

  const showPassword = (message, { title = 'Autorización Requerida', variant = 'security' } = {}) => {
    return new Promise(resolve => {
      setModalState({
        isOpen: true,
        config: {
          type: 'password',
          title,
          message,
          variant,
          onConfirm: (pwd) => { setModalState({ isOpen: false, config: null }); resolve(pwd); },
          _onCancel: () => resolve(null),
        }
      });
    });
  };

  return {
    modalState,
    closeModal,
    showAlert,
    showConfirm, 
    showPassword,
    Modal: (props) => <Modal isOpen={modalState.isOpen} onClose={closeModal} config={modalState.config} {...props} />,
  };
}
