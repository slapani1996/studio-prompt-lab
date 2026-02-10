export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export interface UseConfirmDialogReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  confirm: () => void;
}
