import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CompleteSessionDto {
  @IsString()
  session_id!: string;

  @IsOptional()
  @IsNumber()
  exit_ts?: number; // epoch ms
}
