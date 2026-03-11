import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AdminAggregationService {
  async list(params: {
    dateFrom?: string;
    dateTo?: string;
    stimulusSetId?: string;
    completed?: 'true' | 'false';
    page?: number;
    pageSize?: number;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.min(500, Math.max(1, Number(params.pageSize) || 100));
    const skip = (page - 1) * pageSize;

    // Use raw SQL to query the view with filters
    const where: string[] = [];
    const values: any[] = [];
    if (params.dateFrom) {
      where.push('entry_ts >= $' + (values.length + 1));
      values.push(new Date(params.dateFrom));
    }
    if (params.dateTo) {
      where.push('entry_ts <= $' + (values.length + 1));
      values.push(new Date(params.dateTo));
    }
    if (params.stimulusSetId) {
      where.push('stimulus_set_id = $' + (values.length + 1));
      values.push(params.stimulusSetId);
    }
    if (params.completed === 'true') {
      where.push('completed = true');
    }
    if (params.completed === 'false') {
      where.push('completed = false');
    }

    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM mv_session_track_agg ${whereSql} ORDER BY entry_ts DESC OFFSET ${skip} LIMIT ${pageSize}`,
      ...values,
    );

    // total count
    const countRows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT COUNT(*) AS total FROM mv_session_track_agg ${whereSql}`,
      ...values,
    );
    const total = Number(countRows?.[0]?.total || 0);

    return { items: rows, total, page, pageSize };
  }
}
