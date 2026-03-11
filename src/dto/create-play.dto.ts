import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreatePlayDto {
  @IsString()
  session_id!: string;

  @IsString()
  track_id!: string;

  @IsNumber()
  order_index!: number;

  @IsNumber()
  started_ts!: number;

  @IsOptional()
  @IsNumber()
  ended_ts?: number;

  @IsOptional()
  @IsBoolean()
  played_full?: boolean;

  @IsOptional()
  @IsNumber()
  play_count?: number;

  @IsOptional()
  @IsString()
  clientEventId?: string;
}
