import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PatientService } from './patient.service';
import { CreatePatientDto, UpdatePatientDto } from './dto';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @Roles('MANAGER')
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  @Roles('MANAGER')
  findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  @Roles('MANAGER')
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Put(':id')
  @Roles('MANAGER')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @Roles('MANAGER')
  remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }
}