import type { ReactNode } from 'react';

export interface ItemCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}
