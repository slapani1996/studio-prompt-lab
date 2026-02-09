import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, referenceImages, model, aspectRatio, numberOfImages } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const result = await generateImage({
      prompt,
      referenceImages,
      model,
      aspectRatio,
      numberOfImages,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Generation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Generate error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
