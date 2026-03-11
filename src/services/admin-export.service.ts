import { Injectable } from '@nestjs/common';
// 1. Importe o Service oficial do NestJS
import { PrismaService } from '../../prisma/prisma.service';
import { Response } from 'express';
import { Prisma } from '@prisma/client'; // Importar tipos se necessário

export interface ExportQuery {
  dateFrom?: string;
  dateTo?: string;
  stimulusSetId?: string;
  completed?: 'true' | 'false';
}

@Injectable()
export class AdminExportService {
  // 2. Injete o PrismaService no construtor
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Stream CSV of sessions matching filters. Writes rows in batches to avoid high memory.
   */
  async streamCsv(res: Response, q: ExportQuery) {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="sessions-export.csv"`,
    );

    // simple header
    const header = [
      'session_id',
      'participant_id',
      'participant_anon_token',
      'stimulus_set_id',
      'entry_ts',
      'exit_ts',
      'completed',
      'total_seconds',
      'play_count',
      'response_count',
    ];
    res.write(header.join(',') + '\n');

    const where: Prisma.SessionWhereInput = {}; // Tipagem correta (opcional)
    if (q.stimulusSetId) where.stimulusSetId = q.stimulusSetId;
    if (q.completed === 'true') where.completed = true;
    if (q.completed === 'false') where.completed = false;
    if (q.dateFrom || q.dateTo) {
      where.entryTs = {};
      if (q.dateFrom) where.entryTs.gte = new Date(q.dateFrom);
      if (q.dateTo) where.entryTs.lte = new Date(q.dateTo);
    }

    const pageSize = 500;
    let page = 0;
    while (true) {
      // 3. Use 'this.prisma'
      const sessions = await this.prisma.session.findMany({
        where,
        include: { participant: true },
        orderBy: { entryTs: 'desc' },
        skip: page * pageSize,
        take: pageSize,
      });

      if (!sessions || sessions.length === 0) break;

      for (const s of sessions) {
        // Use 'this.prisma'
        const [playCount, responseCount] = await Promise.all([
          this.prisma.play.count({ where: { sessionId: s.id } }),
          this.prisma.response.count({ where: { sessionId: s.id } }),
        ]);

        const row = [
          s.id,
          s.participant ? s.participant.id : '',
          s.participant ? s.participant.anonToken : '',
          s.stimulusSetId || '',
          s.entryTs ? new Date(s.entryTs).toISOString() : '',
          s.exitTs ? new Date(s.exitTs).toISOString() : '',
          s.completed ? 'true' : 'false',
          s.totalSeconds != null ? String(s.totalSeconds) : '',
          String(playCount),
          String(responseCount),
        ];

        // naive CSV escaping
        const escaped = row.map((c) => {
          if (c == null) return '';
          const v = String(c);
          if (v.includes(',') || v.includes('\n') || v.includes('"')) {
            return '"' + v.replace(/"/g, '""') + '"';
          }
          return v;
        });
        res.write(escaped.join(',') + '\n');
      }

      // flush
      page += 1;
      await new Promise((r) => setImmediate(r));
    }

    res.end();
  }
}
