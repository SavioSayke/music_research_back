#!/usr/bin/env ts-node
import 'dotenv/config';
import { StimulusSetService } from '../src/services/stimulus-set.service';
// 1. Importe as dependências que o serviço precisa
import { PrismaService } from '../prisma/prisma.service';
import { SpotifyService } from '../src/services/spotify.service';

async function main() {
  const source =
    process.env.STIMULUS_SET_SOURCE ||
    `monthly_${new Date().toISOString().slice(0, 7)}`;
  const idsCsv = process.env.STIMULUS_TRACK_IDS || '';
  const trackIds = idsCsv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (trackIds.length === 0) {
    console.error(
      'No track IDs provided. Set STIMULUS_TRACK_IDS env var (comma-separated).',
    );
    process.exit(1);
  }

  // 2. CORREÇÃO: Instancie as dependências manualmente (Manual Dependency Injection)
  // Ordem: Prisma -> Spotify (que precisa do Prisma) -> StimulusSet (que precisa de ambos)
  const prisma = new PrismaService();
  const spotify = new SpotifyService(prisma);
  const svc = new StimulusSetService(prisma, spotify);

  try {
    const created = await svc.createStimulusSet(source, trackIds);
    console.log('Created stimulus set:', created.id);
  } catch (err) {
    console.error('Failed to create stimulus set:', err);
    process.exit(2);
  } finally {
    // 3. Boa prática: Fechar a conexão ao terminar o script
    await prisma.$disconnect();
  }
}

void main();
