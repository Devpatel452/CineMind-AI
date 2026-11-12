import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((item) => {
          const isSuccess = item.type === 'success';
          const isError = item.type === 'error';

          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-slideUp text-xs font-medium ${
                isSuccess
                  ? 'bg-[#121a15]/95 border-emerald-500/40 text-emerald-300 shadow-emerald-950/30'
                  : isError
                  ? 'bg-[#1d1214]/95 border-red-500/40 text-red-300 shadow-red-950/30'
                  : 'bg-[#141620]/95 border-white/20 text-gray-200 shadow-black/40'
              }`}
            >
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />}

              <span className="flex-1 leading-snug">{item.message}</span>

              <button
                onClick={() => removeToast(item.id)}
                className="text-gray-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
