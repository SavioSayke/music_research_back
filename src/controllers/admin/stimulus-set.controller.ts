import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StimulusSetService } from '../../services/stimulus-set.service';
import { AdminAuthGuard } from '../../guards/admin-auth.guard';

@Controller('api/admin')
export class AdminStimulusSetController {
  constructor(private readonly svc: StimulusSetService) {}

  @Post('stimulus-set')
  @UseGuards(AdminAuthGuard)
  async create(@Body() body: { source: string; trackIds: string[] }) {
    if (!body?.source || !Array.isArray(body.trackIds)) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const created = await this.svc.createStimulusSet(
      body.source,
      body.trackIds,
    );
    return { id: created.id, name: created.name };
  }
}
