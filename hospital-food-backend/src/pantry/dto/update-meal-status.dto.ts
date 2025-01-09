import { IsEnum } from 'class-validator';
import { DeliveryStatus } from '@prisma/client';

export class UpdateMealStatusDto {
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;
}
