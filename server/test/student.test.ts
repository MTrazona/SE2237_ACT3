import request from 'supertest';
import app from '../app'; // not from index.ts

const { prisma } = require('../utils/prisma');


beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.student.deleteMany(); // clear students after each test
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /users', () => {
  it('should return empty array initially', async () => {
const res = await request(app).get('/api/users');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return students after creation', async () => {
    await prisma.student.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        groupName: 'G1',
        role: 'Developer',
        expectedSalary: 50000,
        expectedDateOfDefense: new Date("2025-05-01T00:00:00.000Z")
      },
    });

const res = await request(app).get('/api/users');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

describe('POST /users', () => {
  it('should create a student (happy path)', async () => {
    const res = await request(app).post('/api/users').send({
      firstName: 'Jane',
      lastName: 'Smith',
      groupName: 'G2',
      role: 'Designer',
      expectedSalary: '45000',
      expectedDateOfDefense: new Date("2025-05-01T00:00:00.000Z")
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe('Jane');
  });

  it('should fail when required fields are missing', async () => {
    const res = await request(app).post('/api/users').send({
      firstName: 'Incomplete'
    });

    expect(res.statusCode).toBe(500); // or 400 if you do validation
  });

  it('should fail with invalid salary type', async () => {
    const res = await request(app).post('/api/users').send({
      firstName: 'Bob',
      lastName: 'Builder',
      groupName: 'G4',
      role: 'Engineer',
      expectedSalary: 'notanumber',
      expectedDateOfDefense: new Date("2025-05-01T00:00:00.000Z")
    });

    expect(res.statusCode).toBe(500); // because parseInt will work weirdly
  });
});

describe('PUT /users/:id', () => {
  it('should update a student (happy path)', async () => {
    const student = await prisma.student.create({
      data: {
        firstName: 'Old',
        lastName: 'Name',
        groupName: 'G1',
        role: 'Old Role',
        expectedSalary: 30000,
        expectedDateOfDefense: new Date("2025-05-01T00:00:00.000Z")
      }
    });

    const res = await request(app).put(`/api/users/${student.id}`).send({
      firstName: 'New',
      lastName: 'Name',
      groupName: 'G1',
      role: 'New Role',
      expectedSalary: 40000,
      expectedDateOfDefense: new Date("2025-05-01T00:00:00.000Z")
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe('New');
  });

  it('should return 500 for invalid ID', async () => {
    const res = await request(app).put('/api/users/999999').send({
      firstName: 'Fake'
    });
    expect(res.statusCode).toBe(500);
  });

  it('should return 500 if required data is missing', async () => {
    const student = await prisma.student.create({
      data: {
        firstName: 'Update',
        lastName: 'Test',
        groupName: 'G1',
        role: 'Test Role',
        expectedSalary: 1000,
        expectedDateOfDefense: new Date("2025-05-01T00:00:00.000Z")
      }
    });

    const res = await request(app).put(`/api/users/${student.id}`).send({});
    expect(res.statusCode).toBe(500);
  });
});

describe('DELETE /users/:id', () => {
  it('should delete a student (happy path)', async () => {
    const student = await prisma.student.create({
      data: {
        firstName: 'Delete',
        lastName: 'Me',
        groupName: 'G5',
        role: 'Tester',
        expectedSalary: 2000,
        expectedDateOfDefense: new Date("2025-05-01T00:00:00.000Z")
      }
    });

    const res = await request(app).delete(`/api/users/${student.id}`);
    expect(res.statusCode).toBe(200);
  });

  it('should fail if student does not exist', async () => {
    const res = await request(app).delete(`/api/users/999999`);
    expect(res.statusCode).toBe(500);
  });

  it('should fail for invalid ID', async () => {
    const res = await request(app).delete(`/api/users/abc`);
    expect(res.statusCode).toBe(500);
  });
});
