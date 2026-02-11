"use client";

import { useImageUploader } from "./useImageUploader";
import type { ImageUploaderProps } from "./types";
import { Image, X } from "lucide-react";
import { TruncatedText } from "@/components/ui/TruncatedText";

export function ImageUploader({
  onImagesChange,
  existingImages = [],
  onRemoveExisting,
}: ImageUploaderProps) {
  const {
    images,
    isDragging,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    removeImage,
  } = useImageUploader(onImagesChange);

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? "border-violet-500 bg-violet-50 dark:bg-[#7F56D9]/20"
            : "border-zinc-300 hover:border-zinc-400 dark:border-[#333741] dark:hover:border-[#9E77ED]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
        <Image className="mx-auto h-12 w-12 text-zinc-400" />
        <p className="mt-2 text-sm text-zinc-600 dark:text-[#94969C]">
          <span className="font-medium text-violet-600 dark:text-[#9E77ED]">
            Click to upload
          </span>{" "}
          or drag and drop
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-[#94969C]">
          PNG, JPG, WEBP up to 10MB each
        </p>
      </div>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-[#CECFD2]">
            Existing Images
          </h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {existingImages.map((image) => (
              <div key={image.id} className="group relative aspect-square">
                <img
                  src={image.path}
                  alt={image.filename}
                  className="h-full w-full rounded-lg object-cover"
                />
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(image.id)}
                    className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="size-4" />
                  </button>
                )}
                <div className="absolute inset-x-0 bottom-0 rounded-b-lg bg-black/50 px-2 py-1">
                  <TruncatedText
                    text={image.filename}
                    as="p"
                    className="text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Image Previews */}
      {images.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-[#CECFD2]">
            New Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {images.map((image) => (
              <div key={image.id} className="group relative aspect-square">
                <img
                  src={image.preview}
                  alt={image.file.name}
                  className="h-full w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-4" />
                </button>
                <div className="absolute inset-x-0 bottom-0 rounded-b-lg bg-black/50 px-2 py-1">
                  <TruncatedText
                    text={image.file.name}
                    as="p"
                    className="text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
