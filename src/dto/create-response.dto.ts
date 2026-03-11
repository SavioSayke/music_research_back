import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateResponseDto {
  @IsString()
  session_id!: string;

  @IsString()
  question_id!: string;

  @IsString()
  answer!: string;

  @IsOptional()
  @IsNumber()
  response_time_ms?: number;

  @IsOptional()
  @IsString()
  clientEventId?: string;
}
