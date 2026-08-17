import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Data master: perusahaan beserta cabangnya (sesuai blueprint)
const dataPerusahaan = [
  {
    nama: "PT. Speedmark Logistics Indonesia",
    cabang: [
      "Jakarta", "Bandung", "Denpasar", "Medan",
      "Surabaya", "Semarang", "Cengkareng", "Tanjung Priok",
    ],
  },
  {
    nama: "PT. Sarana Allport Cargo Services",
    cabang: ["Jakarta", "Medan", "Surabaya", "Semarang"],
  },
  {
    nama: "PT. Glorindo Oksana Logistics",
    cabang: ["Bekasi"],
  },
  {
    nama: "PT. Swift Kargonize",
    cabang: ["Jakarta", "Denpasar"],
  },
  {
    nama: "PT. CNL Logistics Indonesia",
    cabang: ["Jakarta", "Denpasar", "Medan", "Surabaya", "Semarang", "Bekasi"],
  },
];

// Data master: jenis perangkat
const jenisPerangkat = [
  "Laptop", "Desktop", "Monitor", "Printer",
  "Router", "CCTV", "Perangkat Lainnya",
];

async function main() {
  console.log("🌱 Mulai mengisi data master...");

  // 1. Isi perusahaan + cabang
  for (const p of dataPerusahaan) {
    const company = await prisma.company.create({
      data: { nama: p.nama },
    });
    console.log(`✅ Perusahaan dibuat: ${company.nama}`);

    for (const namaCabang of p.cabang) {
      await prisma.branch.create({
        data: {
          nama: namaCabang,
          kota: namaCabang,
          companyId: company.id,
        },
      });
    }
    console.log(`   ↳ ${p.cabang.length} cabang ditambahkan`);
  }

  // 2. Isi jenis perangkat
  for (const nama of jenisPerangkat) {
    await prisma.deviceType.create({ data: { nama } });
  }
  console.log(`✅ ${jenisPerangkat.length} jenis perangkat ditambahkan`);

  console.log("🎉 Selesai! Data master berhasil diisi.");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi kesalahan:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
