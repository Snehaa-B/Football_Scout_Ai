import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function seedScoutUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('YourStaticScoutPassword', 10);

    // Upsert scout user (will create if not exists, update if exists)
    const scoutUser = await prisma.user.upsert({
      where: { email: 'scout@yourdomain.com' },
      update: {
        password: hashedPassword,
        role: 'SCOUT',
        name: 'Main Scout'
      },
      create: {
        name: 'Main Scout',
        email: 'scout@yourdomain.com',
        password: hashedPassword,
        role: 'SCOUT'
      }
    });

    console.log('Scout user created/updated successfully:', scoutUser);
  } catch (error) {
    console.error('Error seeding scout user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed script
seedScoutUser();