import { Module } from '@nestjs/common';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { AvailabilityModule } from './availability/availability.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    ExceptionsModule,
    AvailabilityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
