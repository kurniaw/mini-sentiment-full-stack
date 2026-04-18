import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class FeedbackCreateDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  comment?: string;
}

export class FeebackResponseDto {
  total!: number;
  average!: number;
  recentComments!: string[];
}
