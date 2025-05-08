import { PrismaClient, UserType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create manager
  const manager = await prisma.user.upsert({
    where: { email: "micey97158@harinv.com" },
    update: {},
    create: {
      email: "micey97158@harinv.com",
      name: "John Manager",
      type: UserType.MANAGER,
      emailVerified: new Date(),
    },
  });

  // Create employee
  const employee = await prisma.user.upsert({
    where: { email: "ruzysy892@chapsmail.com" },
    update: {},
    create: {
      email: "ruzysy892@chapsmail.com",
      name: "Jane Employee",
      type: UserType.EMPLOYEE,
      emailVerified: new Date(),
    },
  });

  // Create additional managers
  const managers = await Promise.all([
    prisma.user.upsert({
      where: { email: "portadmin@example.com" },
      update: {},
      create: {
        email: "portadmin@example.com",
        name: "Sarah Port Admin",
        type: UserType.MANAGER,
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "operations@example.com" },
      update: {},
      create: {
        email: "operations@example.com",
        name: "Michael Operations",
        type: UserType.MANAGER,
        emailVerified: new Date(),
      },
    }),
  ]);

  // Create additional employees
  const employees = await Promise.all([
    prisma.user.upsert({
      where: { email: "monitoring@example.com" },
      update: {},
      create: {
        email: "monitoring@example.com",
        name: "David Monitoring",
        type: UserType.EMPLOYEE,
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "environment@example.com" },
      update: {},
      create: {
        email: "environment@example.com",
        name: "Lisa Environment",
        type: UserType.EMPLOYEE,
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "security@example.com" },
      update: {},
      create: {
        email: "security@example.com",
        name: "Robert Security",
        type: UserType.EMPLOYEE,
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "maintenance@example.com" },
      update: {},
      create: {
        email: "maintenance@example.com",
        name: "Emily Maintenance",
        type: UserType.EMPLOYEE,
        emailVerified: new Date(),
      },
    }),
  ]);

  console.log({ manager, employee, managers, employees });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 