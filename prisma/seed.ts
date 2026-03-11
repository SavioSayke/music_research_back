/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Running TS seed script...');

  const items = [
    {
      trackId: 'track_1',
      artist: 'Artista Exemplo 1',
      title: 'Música Exemplo 1',
      previewUrl: 'https://example.com/preview/track_1.mp3',
      durationMs: 30000,
      source: 'placeholder',
    },
    {
      trackId: 'track_2',
      artist: 'Artista Exemplo 2',
      title: 'Música Exemplo 2',
      previewUrl: 'https://example.com/preview/track_2.mp3',
      durationMs: 25000,
      source: 'placeholder',
    },
    {
      trackId: 'track_3',
      artist: 'Artista Exemplo 3',
      title: 'Música Exemplo 3',
      previewUrl: 'https://example.com/preview/track_3.mp3',
      durationMs: 35000,
      source: 'placeholder',
    },
  ];

  const id = 'dev_default_stimulus_set';

  try {
    const created = await prisma.stimulusSet.upsert({
      where: { id },
      update: {
        name: 'Dev Default Stimulus Set',
        // CORREÇÃO: Comentário para permitir 'as any' especificamente nesta linha
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: items as any,
      },
      create: {
        id,
        name: 'Dev Default Stimulus Set',
        source: 'seed',
        // CORREÇÃO: Comentário para permitir 'as any' especificamente nesta linha
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: items as any,
      },
    });

    console.log('Seed applied. StimulusSet id:', created.id);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
