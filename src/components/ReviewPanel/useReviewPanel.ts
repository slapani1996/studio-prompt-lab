import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { RunResult, UseReviewPanelReturn } from './types';

export function useReviewPanel(
  result: RunResult,
  onUpdate?: () => void
): UseReviewPanelReturn {
  const [rating, setRating] = useState<number | null>(result.rating);
  const [notes, setNotes] = useState(result.notes || '');
  const [tags, setTags] = useState<string[]>(() => {
    try {
      return JSON.parse(result.tags) || [];
    } catch {
      return [];
    }
  });
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setRating(result.rating);
    setNotes(result.notes || '');
    try {
      setTags(JSON.parse(result.tags) || []);
    } catch {
      setTags([]);
    }
  }, [result]);

  const saveChanges = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch(`/api/results/${result.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, notes, tags }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      if (onUpdate) {
        onUpdate();
      }
    } catch {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value === rating ? null : value);
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim().replace(/\s+/g, '-');
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag]);
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const getMetadata = (): Record<string, unknown> => {
    try {
      return JSON.parse(result.metadata);
    } catch {
      return {};
    }
  };

  return {
    rating,
    notes,
    tags,
    newTag,
    saving,
    saved,
    metadata: getMetadata(),
    setNotes,
    setNewTag,
    handleRatingClick,
    addTag,
    removeTag,
    saveChanges,
  };
}
