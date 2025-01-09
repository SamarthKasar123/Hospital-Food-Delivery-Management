import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DeliveryService } from './delivery.service';
import { CompleteDeliveryDto } from './dto';

@Controller('delivery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('assigned')
  @Roles('DELIVERY_PERSONNEL')
  findAssignedDeliveries() {
    return this.deliveryService.findAssignedDeliveries();
  }

  @Post(':id/complete')
  @Roles('DELIVERY_PERSONNEL')
  completeDelivery(
    @Param('id') id: string,
    @Body() completeDeliveryDto: CompleteDeliveryDto,
  ) {
    return this.deliveryService.completeDelivery(id, completeDeliveryDto);
  }
}