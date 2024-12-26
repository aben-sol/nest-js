import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

// const prisma = new PrismaClient();

export async function main(prisma: PrismaClient) {
  const email = 'admin@gmail.com';
  const password = 'admin123'; // Use a strong password in production
  const hashedPassword =
    await argon.hash(password);

  const existingAdmin =
    await prisma.user.findUnique({
      where: { email },
    });

  if (!existingAdmin) {
    // Create the first admin user
    await prisma.user.create({
      data: {
        email,
        hash: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created.');
  } else {
    console.log('Admin user already exists.');
  }
}

// main().catch((e) => {
//   throw e;
// });
// .finally(async () => {
//   await prisma.$disconnect();
// });
