/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import type { StimulusItem } from '../src/types/entities';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Running seed validation...');

  // Basic checks
  const sets = await prisma.stimulusSet.findMany({ take: 50 });
  if (!sets || sets.length === 0) {
    console.error('Validation failed: no stimulus_set found.');
    process.exitCode = 2;
    return;
  }

  let totalItems = 0;
  const problems: string[] = [];

  for (const s of sets) {
    // Cast necessário porque campos JSON retornam tipos genéricos no Prisma
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (s as any).items as StimulusItem[] | undefined;

    if (!items || items.length === 0) {
      problems.push(`stimulus_set ${s.id} has no items`);
      continue;
    }

    totalItems += items.length;

    for (let i = 0; i < items.length; i++) {
      const it = items[i] || {};
      if (!it.trackId)
        problems.push(`stimulus_set ${s.id} item[${i}] missing trackId`);
      if (!it.title)
        problems.push(`stimulus_set ${s.id} item[${i}] missing title`);
      if (!it.previewUrl)
        problems.push(`stimulus_set ${s.id} item[${i}] missing previewUrl`);
      if (it.durationMs == null)
        problems.push(`stimulus_set ${s.id} item[${i}] missing durationMs`);
    }
  }

  if (problems.length > 0) {
    console.error('Validation failed with the following problems:');
    for (const p of problems) console.error(' -', p);
    process.exitCode = 3;
  } else {
    console.log(
      `Validation passed. stimulus_sets=${sets.length}, total_items=${totalItems}`,
    );
    process.exitCode = 0;
  }
}

main()
  .catch((err) => {
    console.error('Validation script error:', err);
    process.exitCode = 4;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
