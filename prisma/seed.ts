/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Running TS seed script...');

  const items = [
    {
      trackId: '0kosUz0jePvjiz4ctmR6wL',
      artist: 'Shakira, Burna Boy',
      title: 'Dai Dai',
      previewUrl: 'https://open.spotify.com/intl-pt/track/0kosUz0jePvjiz4ctmR6wL',
      durationMs: 30000,
      source: 'placeholder',
    },
    {
      trackId: '3iy2QuCtCzpWnR6tia39AB',
      artist: 'Ariana Grande',
      title: 'hate that i made you love me',
      previewUrl: 'https://open.spotify.com/intl-pt/track/3iy2QuCtCzpWnR6tia39AB',
      durationMs: 30000,
      source: 'placeholder',
    },
    {
      trackId: '1lLqWYr8d5GbiCAgmNV5BK',
      artist: 'Saucy Santana',
      title: 'Quiet on the Creek',
      previewUrl: 'https://open.spotify.com/intl-pt/track/1lLqWYr8d5GbiCAgmNV5BK',
      durationMs: 30000,
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
