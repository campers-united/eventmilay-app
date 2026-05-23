import "dotenv/config";
import bcrypt from "bcryptjs";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  const email    = process.env.ADMIN_EMAIL    || "admin@eventmilay.mg";
  const password = process.env.ADMIN_PASSWORD || "Admin1234!";
  const name     = process.env.ADMIN_NAME     || "Super Admin";

  const hash = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.upsert({
    where:  { email },
    update: { password: hash, name },
    create: { email, password: hash, name },
  });
  console.log(`Admin créé : ${admin.email}  /  mot de passe : ${password}`);
}
main().finally(() => prisma.$disconnect());
