import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './modules/attendance/attendance.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/time-management', ),
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
