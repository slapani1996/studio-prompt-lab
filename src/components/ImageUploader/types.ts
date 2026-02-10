export interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

export interface ExistingImage {
  id: string;
  path: string;
  filename: string;
}

export interface ImageUploaderProps {
  onImagesChange: (images: ImageFile[]) => void;
  existingImages?: ExistingImage[];
  onRemoveExisting?: (id: string) => void;
}

export interface UseImageUploaderReturn {
  images: ImageFile[];
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFiles: (files: FileList) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (id: string) => void;
}
