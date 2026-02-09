// Re-export Prisma types
export type {
  InputSet,
  Image,
  Product,
  PromptTemplate,
  PromptStep,
  Run,
  RunResult,
} from '@prisma/client';

// API response types
export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  price?: number;
  availability?: string;
  featuredImage?: {
    url: string;
  };
  [key: string]: unknown;
}

export interface CatalogResponse {
  data: CatalogProduct[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

// Generation options
export interface GenerationOptions {
  prompt: string;
  referenceImages?: Array<{
    data: string;
    mimeType: string;
  }>;
  model?: string;
  aspectRatio?: string;
  imageSize?: string;
  temperature?: number;
}

export interface GenerationResult {
  success: boolean;
  imageData?: string;
  mimeType?: string;
  text?: string;
  error?: string;
}

// Run status
export type RunStatus = 'pending' | 'running' | 'completed' | 'failed';

// Model options
export const AVAILABLE_MODELS = [
  { id: 'gemini-2.0-flash-exp-image-generation', name: 'Nano Banana (Flash)', description: 'Fast image generation' },
  { id: 'imagen-3.0-generate-002', name: 'Imagen 3', description: 'High-quality image generation' },
] as const;

export const ASPECT_RATIOS = [
  { id: '1:1', name: 'Square (1:1)' },
  { id: '2:3', name: 'Portrait (2:3)' },
  { id: '3:2', name: 'Landscape (3:2)' },
  { id: '3:4', name: 'Portrait (3:4)' },
  { id: '4:3', name: 'Landscape (4:3)' },
  { id: '9:16', name: 'Vertical (9:16)' },
  { id: '16:9', name: 'Widescreen (16:9)' },
] as const;

export const IMAGE_SIZES = [
  { id: '1K', name: '1K (1024px)' },
  { id: '2K', name: '2K (2048px)' },
] as const;

// Input set with relations
export interface InputSetWithRelations {
  id: string;
  name: string;
  images: Array<{
    id: string;
    filename: string;
    path: string;
    mimeType: string;
  }>;
  products: Array<{
    id: string;
    catalogId: string;
    name: string;
    category: string;
    imageUrl: string | null;
    metadata: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Prompt template with relations
export interface PromptTemplateWithSteps {
  id: string;
  name: string;
  description: string | null;
  steps: Array<{
    id: string;
    order: number;
    prompt: string;
    model: string;
    aspectRatio: string;
    imageSize: string;
    temperature: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Run with relations
export interface RunWithRelations {
  id: string;
  inputSetId: string;
  templateId: string;
  status: string;
  error: string | null;
  inputSet: {
    id: string;
    name: string;
  };
  template: {
    id: string;
    name: string;
  };
  results: Array<{
    id: string;
    stepOrder: number;
    outputImage: string;
    metadata: string;
    rating: number | null;
    notes: string | null;
    tags: string;
    createdAt: Date;
  }>;
  createdAt: Date;
}
