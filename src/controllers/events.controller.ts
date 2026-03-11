import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { CreatePlayDto } from '../dto/create-play.dto';
import { CreateResponseDto } from '../dto/create-response.dto';

@Controller('api')
export class EventsController {
  constructor(private readonly svc: EventsService) {}

  @Post('play')
  async postPlay(@Body() body: CreatePlayDto | CreatePlayDto[]) {
    try {
      const res = await this.svc.ingestPlays(body);
      return { results: res };
    } catch (err: unknown) {
      throw new HttpException(
        (err as Error).message ?? 'Internal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('response')
  async postResponse(@Body() body: CreateResponseDto | CreateResponseDto[]) {
    try {
      const res = await this.svc.ingestResponses(body);
      return { results: res };
    } catch (err: unknown) {
      throw new HttpException(
        (err as Error).message ?? 'Internal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
