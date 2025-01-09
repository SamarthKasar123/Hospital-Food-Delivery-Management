import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteDeliveryDto } from './dto';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  async findAssignedDeliveries() {
    return this.prisma.mealDelivery.findMany({
      where: {
        status: 'IN_DELIVERY',
      },
      include: {
        meal: {
          include: {
            dietChart: {
              include: {
                patient: true,
              },
            },
          },
        },
      },
    });
  }

  async completeDelivery(id: string, { notes }: CompleteDeliveryDto) {
    const delivery = await this.prisma.mealDelivery.findUnique({
      where: { id },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return this.prisma.mealDelivery.update({
      where: { id },
      data: {
        status: 'DELIVERED',
        notes,
        deliveredAt: new Date(),
      },
    });
  }
}