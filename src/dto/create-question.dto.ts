// src/question/dto/create-question.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  options?: string[] | number[];
}
