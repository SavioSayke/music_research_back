// src/music/dto/create-music.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  IsUrl,
} from 'class-validator';

export class CreateMusicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  spotifylink: string;

  @IsDateString()
  viralDate: Date;

  @IsNumber()
  daysViral: number;

  @IsNumber()
  avgKnowledgment: number;
}
