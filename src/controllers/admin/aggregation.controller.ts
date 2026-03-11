import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../guards/admin-auth.guard';
import { AdminAggregationService } from '../../services/admin-aggregation.service';

@Controller('api/admin')
export class AdminAggregationController {
  constructor(private readonly svc: AdminAggregationService) {}

  @Get('aggregation')
  @UseGuards(AdminAuthGuard)
  async list(@Query() q: any) {
    return this.svc.list(q);
  }
}
