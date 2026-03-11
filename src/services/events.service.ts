import { Injectable } from '@nestjs/common';
import { CreatePlayDto } from '../dto/create-play.dto';
import { CreateResponseDto } from '../dto/create-response.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventsService {
  // Injeção de dependência do PrismaService
  constructor(private prisma: PrismaService) {}

  /**
   * Accepts one or many play events. Performs basic deduplication
   * by checking for an existing play with same session, track and started_ts.
   */
  async ingestPlays(input: CreatePlayDto | CreatePlayDto[]) {
    const items = Array.isArray(input) ? input : [input];
    const results: Array<{ status: string; id?: string; error?: string }> = [];

    for (const it of items) {
      try {
        // validate session exists
        // Usamos 'this.prisma' agora
        const session = await this.prisma.session.findUnique({
          where: { id: it.session_id },
        });
        if (!session) {
          results.push({ status: 'error', error: 'session_not_found' });
          continue;
        }

        // simple dedupe: same sessionId + trackId + startedTs
        const existing = await this.prisma.play.findFirst({
          where: {
            sessionId: it.session_id,
            trackId: it.track_id,
            startedTs: new Date(it.started_ts),
          },
        });
        if (existing) {
          results.push({ status: 'duplicate', id: existing.id });
          continue;
        }

        const created = await this.prisma.play.create({
          data: {
            sessionId: it.session_id,
            trackId: it.track_id,
            orderIndex: it.order_index,
            startedTs: new Date(it.started_ts),
            endedTs: it.ended_ts ? new Date(it.ended_ts) : undefined,
            playedFull: !!it.played_full,
            playCount: it.play_count ?? 1,
          },
        });

        results.push({ status: 'created', id: created.id });
      } catch (err: unknown) {
        // Tratamento de erro seguro para o Linter
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ status: 'error', error: msg });
      }
    }

    return results;
  }

  /**
   * Accepts one or many responses. Deduplicates by session+question+answer+response_time_ms.
   */
  async ingestResponses(input: CreateResponseDto | CreateResponseDto[]) {
    const items = Array.isArray(input) ? input : [input];
    const results: Array<{ status: string; id?: string; error?: string }> = [];

    for (const it of items) {
      try {
        const session = await this.prisma.session.findUnique({
          where: { id: it.session_id },
        });
        if (!session) {
          results.push({ status: 'error', error: 'session_not_found' });
          continue;
        }

        const existing = await this.prisma.response.findFirst({
          where: {
            sessionId: it.session_id,
            questionId: it.question_id,
            answer: it.answer,
            responseTimeMs: it.response_time_ms ?? undefined,
          },
        });

        if (existing) {
          results.push({ status: 'duplicate', id: existing.id });
          continue;
        }

        const created = await this.prisma.response.create({
          data: {
            sessionId: it.session_id,
            questionId: it.question_id,
            answer: it.answer,
            responseTimeMs: it.response_time_ms ?? undefined,
          },
        });

        results.push({ status: 'created', id: created.id });
      } catch (err: unknown) {
        // Tratamento de erro seguro para o Linter
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ status: 'error', error: msg });
      }
    }

    return results;
  }
}
