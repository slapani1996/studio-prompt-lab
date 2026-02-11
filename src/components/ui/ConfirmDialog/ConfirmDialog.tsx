'use client';

import { Modal } from '../Modal';
import type { ConfirmDialogProps } from './types';

const variantStyles = {
  danger: 'bg-rose-600 hover:bg-rose-700',
  warning: 'bg-amber-600 hover:bg-amber-700',
  info: 'bg-violet-600 hover:bg-violet-700',
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-[#333741] dark:text-[#CECFD2] dark:hover:bg-[#1F242F]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${variantStyles[variant]}`}
          >
            {loading ? 'Loading...' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-zinc-600 dark:text-[#94969C]">{message}</p>
    </Modal>
  );
}
