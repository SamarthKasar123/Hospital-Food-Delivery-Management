import { IsString } from 'class-validator';

export class AssignDeliveryDto {
  @IsString()
  deliveryPersonnelId: string;
}