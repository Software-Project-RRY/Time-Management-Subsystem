import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('Starting database seed...');

    // Get ShiftType model
    const ShiftTypeModel = app.get<Model<any>>(getModelToken('ShiftType'));

    // Clear existing shift types
    console.log('Clearing existing shift types...');
    await ShiftTypeModel.deleteMany({});

    // Create default shift types
    console.log('Creating shift types...');
    const morningShiftType = await ShiftTypeModel.create({
      name: 'Morning Shift',
      active: true,
    });
    console.log(' Created: Morning Shift');

    const nightShiftType = await ShiftTypeModel.create({
      name: 'Night Shift',
      active: true,
    });
    console.log(' Created: Night Shift');

    const afternoonShiftType = await ShiftTypeModel.create({
      name: 'Afternoon Shift',
      active: true,
    });
    console.log(' Created: Afternoon Shift');

    console.log('\n Seed completed successfully!');
    console.log(`Created ${3} shift types`);
  } catch (error) {
    console.error('L Seed failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
