// Default model for image generation
export const DEFAULT_MODEL = 'gemini-2.0-flash-exp-image-generation';

// Available models for image generation
export const MODELS = [
  { id: 'gemini-2.0-flash-exp-image-generation', name: 'Gemini 2.0 Flash (Image Gen)' },
] as const;

// Available aspect ratios for generated images
export const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const;

// Available image sizes
export const IMAGE_SIZES = ['1K', '2K'] as const;

// Default temperature for generation
export const DEFAULT_TEMPERATURE = 1.0;

// Default image size
export const DEFAULT_IMAGE_SIZE = '1K';

// Default aspect ratio
export const DEFAULT_ASPECT_RATIO = '1:1';

// Common tags for image review
export const COMMON_TAGS = [
  'good-lighting',
  'realistic',
  'wrong-product',
  'wrong-style',
  'keeper',
  'needs-work',
  'good-composition',
  'bad-colors',
  'artifact',
  'perfect',
] as const;

// Product categories
export const PRODUCT_CATEGORIES = [
  { id: '', name: 'All Products' },
  { id: 'faucets', name: 'Faucets' },
  { id: 'mirrors', name: 'Mirrors' },
  { id: 'shower-systems', name: 'Shower Systems' },
  { id: 'decorative-lighting', name: 'Decorative Lighting' },
  { id: 'vanities', name: 'Vanities' },
  { id: 'tub-doors', name: 'Tub Doors' },
  { id: 'towel-rings', name: 'Towel Rings' },
  { id: 'tub-filler', name: 'Tub Filler' },
] as const;
