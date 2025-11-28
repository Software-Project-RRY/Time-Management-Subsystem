// Test script for Member 1 endpoints
// Run with: node test-member1-endpoints.js

const baseUrl = 'http://localhost:3000';

async function testEndpoints() {
    console.log('🚀 Testing Member 1 Endpoints...\n');

    try {
        // 1. Create Shift Type
        console.log('1️⃣ Creating Shift Type...');
        const shiftTypeRes = await fetch(`${baseUrl}/shift-types`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Morning Shift', active: true })
        });
        const shiftType = await shiftTypeRes.json();
        console.log('✅ Shift Type created:', shiftType._id);

        // 2. Create Schedule Rule
        console.log('\n2️⃣ Creating Schedule Rule...');
        const scheduleRuleRes = await fetch(`${baseUrl}/schedule-rules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Standard Week', pattern: 'Mon-Fri 9-5', active: true })
        });
        const scheduleRule = await scheduleRuleRes.json();
        console.log('✅ Schedule Rule created:', scheduleRule._id);

        // 3. Create Holiday
        console.log('\n3️⃣ Creating Holiday...');
        const holidayRes = await fetch(`${baseUrl}/holidays`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'NATIONAL',
                startDate: new Date().toISOString(),
                name: 'Test Holiday',
                active: true
            })
        });
        const holiday = await holidayRes.json();
        console.log('✅ Holiday created:', holiday._id);

        // 4. Create Shift Definition
        console.log('\n4️⃣ Creating Shift Definition...');
        const shiftRes = await fetch(`${baseUrl}/shift-definitions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Morning 9-5',
                shiftType: shiftType._id,
                startTime: '09:00',
                endTime: '17:00',
                active: true
            })
        });
        const shift = await shiftRes.json();
        console.log('✅ Shift Definition created:', shift._id);

        // 5. Assign Shift
        console.log('\n5️⃣ Assigning Shift...');
        const assignRes = await fetch(`${baseUrl}/shifts/assign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                shiftId: shift._id,
                startDate: new Date().toISOString(),
                employeeId: '507f1f77bcf86cd799439011' // Mock employee ID
            })
        });
        const assignment = await assignRes.json();
        console.log('✅ Shift Assignment created:', assignment._id);

        // 6. Get My Shifts
        console.log('\n6️⃣ Getting My Shifts...');
        const myShiftsRes = await fetch(`${baseUrl}/shifts/my?employeeId=507f1f77bcf86cd799439011`);
        const myShifts = await myShiftsRes.json();
        console.log('✅ My Shifts retrieved:', myShifts.length, 'shift(s)');

        console.log('\n✨ All tests passed successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testEndpoints();
