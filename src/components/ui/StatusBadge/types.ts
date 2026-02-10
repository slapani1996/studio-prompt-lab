export type StatusType = 'pending' | 'running' | 'completed' | 'failed';

export interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}
