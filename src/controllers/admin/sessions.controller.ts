import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../guards/admin-auth.guard';
import { AdminSessionService } from '../../services/admin-session.service';

@Controller('api/admin')
export class AdminSessionsController {
  constructor(private readonly svc: AdminSessionService) {}

  @Get('sessions')
  @UseGuards(AdminAuthGuard)
  async list(@Query() query: any) {
    const res = await this.svc.listSessions(query);
    return res;
  }
}
