import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PantryService } from './pantry.service';
import { UpdateMealStatusDto, AssignDeliveryDto } from './dto';

@Controller('pantry')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @Get('meals')
  @Roles('PANTRY_STAFF')
  findAllMeals() {
    return this.pantryService.findAllMeals();
  }

  @Patch('meals/:id/status')
  @Roles('PANTRY_STAFF')
  updateMealStatus(
    @Param('id') id: string,
    @Body() updateMealStatusDto: UpdateMealStatusDto,
  ) {
    return this.pantryService.updateMealStatus(id, updateMealStatusDto);
  }

  @Post('meals/:id/assign')
  @Roles('PANTRY_STAFF')
  assignDelivery(
    @Param('id') id: string,
    @Body() assignDeliveryDto: AssignDeliveryDto,
  ) {
    return this.pantryService.assignDelivery(id, assignDeliveryDto);
  }
}