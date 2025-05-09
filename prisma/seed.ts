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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
