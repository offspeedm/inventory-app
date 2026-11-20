import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@inventory.com";
  const passwordLahir = "admin12345";

  // Cek apakah admin sudah ada
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("⚠️ Admin sudah ada di database!");
    return;
  }

  // Acak password menggunakan bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(passwordLahir, salt);

  // Buat user admin baru ke database
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nama: "Super Admin",
      role: "Admin",
      status: "Aktif",
    },
  });

  console.log(`✅ Admin berhasil dibuat!`);
  console.log(`Email: ${user.email}`);
  console.log(`Password: ${passwordLahir}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });