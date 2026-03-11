import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SpotifyService } from './spotify.service';

@Injectable()
export class StimulusSetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly spotify: SpotifyService,
  ) {}

  /**
   * Create or update a stimulus set from a list of track IDs.
   * Returns the created StimulusSet id.
   */
  async createStimulusSet(source: string, trackIds: string[]) {
    const items = [] as any[];
    // Process tracks
    for (const tid of trackIds) {
      try {
        const meta = await this.spotify.getTrackMetadata(tid); // ✅ Uso correto com 'this'
        items.push({
          trackId: tid,
          artist: (meta.artists || []).join(', '),
          title: meta.title,
          previewUrl: meta.previewUrl,
          durationMs: meta.durationMs,
          source: source,
        });
      } catch (err) {
        items.push({
          trackId: tid,
          artist: null,
          title: null,
          previewUrl: null,
          durationMs: null,
          source: source,
          fetchError: String(err),
        });
      }
    }

    const id = source;
    // Database operation
    const created = await this.prisma.stimulusSet.upsert({
      where: { id },
      update: { name: source, source, items },
      create: { id, name: source, source, items },
    });

    return created;
  }
}
