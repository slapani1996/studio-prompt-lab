import { useState, useCallback } from 'react';

export interface UseCrudOperationsResult<T> {
  create: (data: Partial<T>) => Promise<T | null>;
  update: (id: string, data: Partial<T>) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
  saving: boolean;
}

export function useCrudOperations<T>(
  baseUrl: string,
  refetch: () => void
): UseCrudOperationsResult<T> {
  const [saving, setSaving] = useState(false);

  const create = useCallback(async (data: Partial<T>): Promise<T | null> => {
    setSaving(true);
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      refetch();
      return result;
    } catch (error) {
      console.error('Create failed:', error);
      return null;
    } finally {
      setSaving(false);
    }
  }, [baseUrl, refetch]);

  const update = useCallback(async (id: string, data: Partial<T>): Promise<T | null> => {
    setSaving(true);
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      refetch();
      return result;
    } catch (error) {
      console.error('Update failed:', error);
      return null;
    } finally {
      setSaving(false);
    }
  }, [baseUrl, refetch]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setSaving(true);
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      refetch();
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    } finally {
      setSaving(false);
    }
  }, [baseUrl, refetch]);

  return { create, update, remove, saving };
}
