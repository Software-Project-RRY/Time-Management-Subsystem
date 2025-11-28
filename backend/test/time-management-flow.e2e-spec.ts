import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateShiftTypeDto, CreateScheduleRuleDto, CreateHolidayDto, AssignShiftDto } from './../src/time-management/dto';
import { HolidayType } from './../src/time-management/models/enums';

describe('TimeManagement Flow (e2e)', () => {
    let app: INestApplication;
    let shiftTypeId: string;
    let scheduleRuleId: string;
    let holidayId: string;
    let shiftId: string;
    let shiftAssignmentId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/shift-types (POST)', async () => {
        const createShiftTypeDto: CreateShiftTypeDto = {
            name: 'Morning Shift',
            active: true,
        };
        const response = await request(app.getHttpServer())
            .post('/shift-types')
            .send(createShiftTypeDto)
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toEqual('Morning Shift');
        shiftTypeId = response.body._id;
    });

    it('/schedule-rules (POST)', async () => {
        const createScheduleRuleDto: CreateScheduleRuleDto = {
            name: 'Standard Week',
            pattern: 'Mon-Fri 9-5',
            active: true,
        };
        const response = await request(app.getHttpServer())
            .post('/schedule-rules')
            .send(createScheduleRuleDto)
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toEqual('Standard Week');
        scheduleRuleId = response.body._id;
    });

    it('/holidays (POST)', async () => {
        const createHolidayDto: CreateHolidayDto = {
            type: HolidayType.NATIONAL,
            startDate: new Date() as any,
            name: 'New Year',
            active: true,
        };
        const response = await request(app.getHttpServer())
            .post('/holidays')
            .send(createHolidayDto)
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toEqual('New Year');
        holidayId = response.body._id;
    });

    it('/shift-definitions (POST)', async () => {
        const createShiftDto = {
            name: 'Morning Shift Definition',
            shiftType: shiftTypeId,
            startTime: '09:00',
            endTime: '17:00',
            active: true,
        };
        const response = await request(app.getHttpServer())
            .post('/shift-definitions')
            .send(createShiftDto)
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toEqual('Morning Shift Definition');
        shiftId = response.body._id;
    });

    it('/shifts/assign (POST)', async () => {
        const assignShiftDto: AssignShiftDto = {
            shiftId: shiftId,
            startDate: new Date() as any,
        };

        const response = await request(app.getHttpServer())
            .post('/shifts/assign')
            .send(assignShiftDto)
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.shiftId).toEqual(shiftId);
        shiftAssignmentId = response.body._id;
    });

    it('/shifts/my (GET)', async () => {
        const employeeId = 'some-employee-id';
        const assignShiftDto: AssignShiftDto = {
            shiftId: shiftId,
            startDate: new Date() as any,
            employeeId: employeeId,
        };

        await request(app.getHttpServer())
            .post('/shifts/assign')
            .send(assignShiftDto)
            .expect(201);

        const response = await request(app.getHttpServer())
            .get('/shifts/my')
            .query({ employeeId })
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].employeeId).toEqual(employeeId);
    });
});
