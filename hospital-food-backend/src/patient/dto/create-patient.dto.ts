import { IsString, IsInt, IsEnum, IsArray, IsOptional } from 'class-validator';
import { Gender } from '@prisma/client';

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  roomNumber: string;

  @IsString()
  bedNumber: string;

  @IsString()
  floorNumber: string;

  @IsArray()
  @IsString({ each: true })
  diseases: string[];

  @IsArray()
  @IsString({ each: true })
  allergies: string[];

  @IsString()
  contactNumber: string;

  @IsString()
  emergencyContact: string;
}