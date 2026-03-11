import { IsOptional, IsString, IsObject, IsInt } from 'class-validator';

export class CreateSessionDto {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsObject()
  demographics?: Record<string, any>;

  @IsOptional()
  @IsInt()
  seed?: number;
}
