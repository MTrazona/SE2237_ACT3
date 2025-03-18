import { Router } from 'express';
import { prisma } from '../utils/prisma';

export const router = Router();

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.student.findMany();
    res.json(users);
  } catch {
    res.status(500).json({ error: 'An error occurred while fetching students' });
  }
});

router.post("/users", async (req, res) => {
    const {
        firstName,
        lastName,
        groupName,
        role,
        expectedSalary,
        expectedDateOfDefense
    } = req.body;
    console.log("req.body", req.body);

    const expectedSalaryToInt = parseInt(expectedSalary);

    try {
        const user = await prisma.student.create({
        data: {
            firstName,
            lastName,
            groupName,
            role,
            expectedSalary: expectedSalaryToInt,
            expectedDateOfDefense
        },
        });
        res.json(user);
    } catch {
        res.status(500).json({ error: 'An error occurred while creating student' });
    }
})

router.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const {
        firstName,
        lastName,
        groupName,
        role,
        expectedSalary,
        expectedDateOfDefense
    } = req.body;
    try {
        const user = await prisma.student.update({
        where: { id: parseInt(id) },
        data: {
            firstName,
            lastName,
            groupName,
            role,
            expectedSalary,
            expectedDateOfDefense
        },
        });
        res.json(user);
    } catch {
        res.status(500).json({ error: 'An error occurred while updating student' });
    }
})

router.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.student.delete({
        where: { id: parseInt(id) },
        });
        res.json(user);
    } catch {
        res.status(500).json({ error: 'An error occurred while deleting student' });
    }
})