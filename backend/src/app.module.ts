import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ShiftModule } from './modules/shift/shift.module';
import { AssignmentModule } from './modules/assignment/assignment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    ShiftModule,
    AssignmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
