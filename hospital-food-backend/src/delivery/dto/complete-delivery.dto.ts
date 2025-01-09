import { IsString, IsOptional } from 'class-validator';

export class CompleteDeliveryDto {
  @IsString()
  @IsOptional()
  notes?: string;
}