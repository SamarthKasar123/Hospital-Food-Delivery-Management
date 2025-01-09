import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { DietChartModule } from './diet-chart/diet-chart.module';
import { PantryModule } from './pantry/pantry.module';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PatientModule,
    DietChartModule,
    PantryModule,
    DeliveryModule,
  ],
})
export class AppModule {}