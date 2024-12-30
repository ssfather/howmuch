import { IsString, IsNumber, IsArray, IsDate, IsOptional, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class NutritionInfoDto {
  @IsNumber()
  @Min(0)
  carbs: number;

  @IsNumber()
  @Min(0)
  protein: number;

  @IsNumber()
  @Min(0)
  fat: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  vitaminA?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  vitaminB?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  vitaminC?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  vitaminD?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  iron?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  calcium?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fiber?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sodium?: number;
}

export class CreateMealDto {
  @IsString()
  type: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sideDishes?: string[];

  @IsNumber()
  @Min(0)
  @Max(10000)
  calories: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => NutritionInfoDto)
  nutritionInfo?: NutritionInfoDto;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;
} 