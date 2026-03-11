import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../guards/admin-auth.guard';
import { AdminExportService } from '../../services/admin-export.service';
import type { Response } from 'express';

@Controller('api/admin')
export class AdminExportController {
  constructor(private readonly svc: AdminExportService) {}

  @Get('export')
  @UseGuards(AdminAuthGuard)
  async export(@Query() q: any, @Res() res: Response) {
    // delegate streaming to service
    await this.svc.streamCsv(res, q);
  }
}
