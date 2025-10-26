import { PrismaClient, GlobalRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password,
      role: GlobalRole.ADMIN,
    },
  });

  const project = await prisma.project.create({
    data: { name: 'Demo Project', description: 'Example project' },
  });

  await prisma.projectMember.create({
    data: { userId: admin.id, projectId: project.id },
  });
}

main().finally(() => prisma.$disconnect());
