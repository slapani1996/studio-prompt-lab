import { NextRequest, NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { generateImage } from '@/lib/gemini';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// POST execute the run
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = await getDbClient();
  try {
    const { id } = await params;

    // Get the run with all related data
    const run = await prisma.run.findUnique({
      where: { id },
      include: {
        inputSet: {
          include: {
            images: true,
            products: true,
          },
        },
        template: {
          include: {
            steps: { orderBy: { order: 'asc' } },
          },
        },
      },
    });

    if (!run) {
      return NextResponse.json(
        { error: 'Run not found' },
        { status: 404 }
      );
    }

    if (run.status === 'running') {
      return NextResponse.json(
        { error: 'Run is already in progress' },
        { status: 400 }
      );
    }

    // Update status to running
    await prisma.run.update({
      where: { id },
      data: { status: 'running' },
    });

    // Prepare input images
    const inputImages: Array<{ data: string; mimeType: string }> = [];

    for (const image of run.inputSet.images) {
      try {
        const imagePath = path.join(process.cwd(), 'public', image.path);
        const fs = await import('fs/promises');
        const buffer = await fs.readFile(imagePath);
        inputImages.push({
          data: buffer.toString('base64'),
          mimeType: image.mimeType,
        });
      } catch (error) {
        console.error(`[API] Failed to read image ${image.path}:`, error instanceof Error ? error.message : error);
      }
    }

    // Prepare product context
    const productContext = run.inputSet.products.map((p) => {
      const metadata = JSON.parse(p.metadata);
      return `${p.name} (${p.category}): ${JSON.stringify(metadata)}`;
    }).join('\n');

    // Execute each step
    const results = [];
    let currentImages = inputImages;
    let hasError = false;

    const outputDir = path.join(process.cwd(), 'public', 'outputs', run.id);
    await mkdir(outputDir, { recursive: true });

    for (const step of run.template.steps) {
      // Replace template variables in prompt
      let processedPrompt = step.prompt;
      processedPrompt = processedPrompt.replace(/\{\{product\}\}/g, productContext);
      processedPrompt = processedPrompt.replace(/\{\{products\}\}/g, productContext);

      try {
        const result = await generateImage({
          prompt: processedPrompt,
          referenceImages: currentImages,
          model: step.model,
          aspectRatio: step.aspectRatio,
        });

        if (!result.success || !result.images?.length) {
          // Save error result
          await prisma.runResult.create({
            data: {
              runId: run.id,
              stepOrder: step.order,
              outputImage: '',
              metadata: JSON.stringify({
                error: result.error || 'No image generated',
                text: result.text,
              }),
            },
          });

          hasError = true;
          break;
        }

        // Save the generated image
        const imageData = result.images[0];
        const ext = imageData.mimeType.includes('png') ? '.png' : '.jpg';
        const filename = `step-${step.order}-${uuidv4()}${ext}`;
        const outputPath = path.join(outputDir, filename);
        const publicPath = `/api/outputs/${run.id}/${filename}`;

        await writeFile(outputPath, Buffer.from(imageData.data, 'base64'));

        // Save result to database
        const runResult = await prisma.runResult.create({
          data: {
            runId: run.id,
            stepOrder: step.order,
            outputImage: publicPath,
            metadata: JSON.stringify({
              model: step.model,
              aspectRatio: step.aspectRatio,
              text: result.text,
            }),
          },
        });

        results.push(runResult);

        // Use this step's output as input for next step
        currentImages = result.images;
      } catch (error) {
        console.error(`[API] Error executing step ${step.order}:`, error instanceof Error ? error.message : error);

        await prisma.runResult.create({
          data: {
            runId: run.id,
            stepOrder: step.order,
            outputImage: '',
            metadata: JSON.stringify({
              error: error instanceof Error ? error.message : 'Unknown error',
            }),
          },
        });

        hasError = true;
        break;
      }
    }

    // Update run status
    await prisma.run.update({
      where: { id },
      data: {
        status: hasError ? 'failed' : 'completed',
        error: hasError ? 'One or more steps failed' : null,
      },
    });

    // Fetch updated run
    const updatedRun = await prisma.run.findUnique({
      where: { id },
      include: {
        inputSet: { select: { id: true, name: true } },
        template: { select: { id: true, name: true } },
        results: { orderBy: { stepOrder: 'asc' } },
      },
    });

    return NextResponse.json(updatedRun);
  } catch (error) {
    console.error('[API] Error executing run:', error instanceof Error ? error.message : error);

    // Try to mark as failed
    try {
      const { id } = await params;
      await prisma.run.update({
        where: { id },
        data: {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    } catch {
      // Ignore update error
    }

    return NextResponse.json(
      { error: 'Failed to execute run' },
      { status: 500 }
    );
  }
}
