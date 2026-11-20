import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ⚠️ UBAH EMAIL DAN NAMA DI BAWAH INI SESUAI DENGAN DATA ANDA
  const emailTarget = "chairul.im@speedmark.co.id"; 
  const namaUser = "Chairul Imam";
  const passwordBaru = "SMT#2019*";

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(passwordBaru, salt);

  // Upsert: Jika email sudah ada, update password-nya. Jika belum ada, buat baru.
  const user = await prisma.user.upsert({
    where: { email: emailTarget },
    update: { 
      password: hashedPassword 
    },
    create: {
      email: emailTarget,
      nama: namaUser,
      password: hashedPassword,
      role: "Admin",
      status: "Aktif"
    }
  });

  console.log(`✅ Berhasil! Akun login siap digunakan.`);
  console.log(`Nama: ${user.nama}`);
  console.log(`Email: ${user.email}`);
  console.log(`Password: ${passwordBaru}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });