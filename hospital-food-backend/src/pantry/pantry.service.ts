import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMealStatusDto, AssignDeliveryDto } from './dto';

@Injectable()
export class PantryService {
  constructor(private prisma: PrismaService) {}

  async findAllMeals() {
    return this.prisma.meal.findMany({
      include: {
        dietChart: {
          include: {
            patient: true,
          },
        },
        delivery: {
          include: {
            deliveryPersonnel: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      where: {
        delivery: {
          status: {
            not: 'DELIVERED',
          },
        },
      },
    });
  }

  async updateMealStatus(id: string, { status }: UpdateMealStatusDto) {
    const meal = await this.prisma.meal.findUnique({
      where: { id },
      include: { delivery: true },
    });

    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    return this.prisma.mealDelivery.update({
      where: { id: meal.delivery.id },
      data: { status },
    });
  }

  async assignDelivery(id: string, { deliveryPersonnelId }: AssignDeliveryDto) {
    const meal = await this.prisma.meal.findUnique({
      where: { id },
      include: { delivery: true },
    });

    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    return this.prisma.mealDelivery.update({
      where: { id: meal.delivery.id },
      data: {
        deliveryPersonnelId,
        status: 'IN_DELIVERY',
      },
    });
  }
}