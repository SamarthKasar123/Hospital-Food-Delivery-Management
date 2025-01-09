import { IsString, IsArray, IsEnum, IsDate } from 'class-validator';
import { MealTime } from '@prisma/client';

export class CreateMealDto {
  @IsEnum(MealTime)
  mealTime: MealTime;

  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @IsArray()
  @IsString({ each: true })
  instructions: string[];
}

export class CreateDietChartDto {
  @IsString()
  patientId: string;

  @IsDate()
  date: Date;

  @IsArray()
  meals: CreateMealDto[];
}