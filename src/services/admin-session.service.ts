import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // <--- Importando o Service correto

export interface AdminSessionsQuery {
  page?: number;
  pageSize?: number;
  dateFrom?: string; // ISO
  dateTo?: string; // ISO
  stimulusSetId?: string;
  completed?: 'true' | 'false';
  orderBy?: 'entryTs' | 'exitTs' | 'totalSeconds';
  sort?: 'asc' | 'desc';
}

@Injectable()
export class AdminSessionService {
  // Injeção do PrismaService
  constructor(private prisma: PrismaService) {}

  async listSessions(q: AdminSessionsQuery) {
    const page = Math.max(1, Number(q.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(q.pageSize) || 25));
    const skip = (page - 1) * pageSize;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (q.stimulusSetId) where.stimulusSetId = q.stimulusSetId;
    if (q.completed === 'true') where.completed = true;
    if (q.completed === 'false') where.completed = false;

    if (q.dateFrom || q.dateTo) {
      where.entryTs = {};
      if (q.dateFrom) where.entryTs.gte = new Date(q.dateFrom);
      if (q.dateTo) where.entryTs.lte = new Date(q.dateTo);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any = {};
    if (q.orderBy) {
      const col = q.orderBy;
      orderBy[col] = q.sort === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy['entryTs'] = 'desc';
    }

    // Usando this.prisma
    const [items, total] = await Promise.all([
      this.prisma.session.findMany({
        where,
        include: { participant: true, stimulusSet: true },
        orderBy,
        skip,
        take: pageSize,
      }),
      this.prisma.session.count({ where }),
    ]);

    // map for admin-friendly output
    // CORREÇÃO: Removemos o ': any' aqui pois o tipo é inferido automaticamente pelo findMany acima
    const rows = items.map((s) => ({
      id: s.id,
      participant: s.participant
        ? { id: s.participant.id, anonToken: s.participant.anonToken }
        : null,
      stimulusSetId: s.stimulusSetId,
      entryTs: s.entryTs,
      exitTs: s.exitTs,
      completed: s.completed,
      totalSeconds: s.totalSeconds,
    }));

    return { items: rows, total, page, pageSize };
  }
}
