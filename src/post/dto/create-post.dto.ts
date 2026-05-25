import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsUrl()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  summary?: string;

  @IsBoolean()
  @IsOptional()
  isDraft?: boolean;

  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}
