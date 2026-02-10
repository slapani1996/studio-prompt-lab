import { useState, useCallback } from 'react';
import type { UseConfirmDialogReturn } from './types';

export function useConfirmDialog(onConfirm: () => void): UseConfirmDialogReturn {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const confirm = useCallback(() => {
    onConfirm();
    setIsOpen(false);
  }, [onConfirm]);

  return { isOpen, open, close, confirm };
}
