import { GoogleGenAI } from '@google/genai';
import { DEFAULT_MODEL } from './constants';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey && process.env.NODE_ENV !== 'production') {
  // Only warn in development - in production, the error will surface when generation is attempted
  console.warn('[Studio Prompt Lab] GEMINI_API_KEY is not set');
}

const client = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface GenerationOptions {
  prompt: string;
  referenceImages?: Array<{
    data: string; // Base64 encoded image data
    mimeType: string;
  }>;
  model?: string;
  aspectRatio?: string;
  numberOfImages?: number;
}

export interface GenerationResult {
  success: boolean;
  images?: Array<{
    data: string;
    mimeType: string;
  }>;
  text?: string;
  error?: string;
}

export async function generateImage(options: GenerationOptions): Promise<GenerationResult> {
  if (!client) {
    return {
      success: false,
      error: 'GEMINI_API_KEY is not configured',
    };
  }

  const {
    prompt,
    referenceImages = [],
    model = DEFAULT_MODEL,
    aspectRatio = '1:1',
    numberOfImages = 1,
  } = options;

  try {
    // Build the content parts
    const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [];

    // Add reference images first
    for (const img of referenceImages) {
      parts.push({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType,
        },
      });
    }

    // Add the text prompt
    parts.push({ text: prompt });

    const response = await client.models.generateContent({
      model,
      contents: [{ role: 'user', parts }],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        // @ts-expect-error - The SDK types may not include imageGenerationConfig yet
        imageGenerationConfig: {
          aspectRatio,
          numberOfImages,
        },
      },
    });

    // Extract images from response
    const images: Array<{ data: string; mimeType: string }> = [];
    let text = '';

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if ('inlineData' in part && part.inlineData && part.inlineData.data) {
          images.push({
            data: part.inlineData.data,
            mimeType: part.inlineData.mimeType || 'image/png',
          });
        } else if ('text' in part && part.text) {
          text += part.text;
        }
      }
    }

    if (images.length === 0) {
      return {
        success: false,
        text,
        error: 'No image was generated. The model may have returned text only.',
      };
    }

    return {
      success: true,
      images,
      text,
    };
  } catch (error) {
    // Log structured error for server-side debugging
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Gemini API]', error);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function generateImageWithChain(
  steps: Array<{
    prompt: string;
    model: string;
    aspectRatio: string;
  }>,
  initialImages: Array<{ data: string; mimeType: string }>,
  onStepComplete?: (stepIndex: number, result: GenerationResult) => void
): Promise<GenerationResult[]> {
  const results: GenerationResult[] = [];
  let currentImages = initialImages;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    const result = await generateImage({
      prompt: step.prompt,
      referenceImages: currentImages,
      model: step.model,
      aspectRatio: step.aspectRatio,
    });

    results.push(result);

    if (onStepComplete) {
      onStepComplete(i, result);
    }

    if (!result.success || !result.images?.length) {
      // Stop chain if a step fails
      break;
    }

    // Use this step's output as input for next step
    currentImages = result.images;
  }

  return results;
}
