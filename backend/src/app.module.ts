import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ShiftModule } from './modules/shift/shift.module';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { AvailabilityModule } from './availability/availability.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    ShiftModule,
    AssignmentModule,
    AttendanceModule,
    ExceptionsModule,
    AvailabilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
