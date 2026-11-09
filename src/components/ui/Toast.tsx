import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useGrantlyStore, ToastItem } from '../../lib/store';

export const ToastContainer: React.FC = () => {
  const toasts = useGrantlyStore((state) => state.toasts);
  const removeToast = useGrantlyStore((state) => state.removeToast);

  return (
    <aside
      aria-label="Notifications"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </aside>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: () => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  let Icon = Info;
  let iconColor = 'text-brand-primary';

  if (toast.variant === 'success') {
    Icon = CheckCircle2;
    iconColor = 'text-semantic-success';
  } else if (toast.variant === 'warning' || toast.variant === 'error') {
    Icon = AlertCircle;
    iconColor = 'text-semantic-danger';
  }

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.16 } }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      className="pointer-events-auto bg-surface-card border border-border-hairline shadow-lg rounded-[12px] p-4 flex items-start gap-3 select-none hover:-translate-y-0.5 transition-transform"
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-ink-primary leading-tight">{toast.title}</h4>
        {toast.message && (
          <p className="text-xs text-ink-muted mt-1 leading-normal line-clamp-2">{toast.message}</p>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              onDismiss();
            }}
            className="mt-2 text-xs font-semibold text-brand-primary hover:underline focus-visible:ring-1 focus-visible:ring-brand-primary rounded px-1 -ml-1 inline-block cursor-pointer active:scale-95"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-ink-muted hover:text-ink-primary p-1 rounded-md hover:bg-surface-raised transition-colors cursor-pointer active:scale-90"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
};
