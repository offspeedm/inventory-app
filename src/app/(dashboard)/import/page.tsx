import prisma from "@/lib/prisma";
import { ImportDataView } from "./import-data-view";
import { getFieldsForType } from "@/config/device-fields";

export default async function ImportDataPage() {
  const deviceTypesRaw = await prisma.deviceType.findMany({
    select: { nama: true, spesifikasi: true },
    orderBy: { nama: "asc" },
  });

  const jenisSpesifikasiMap: Record<string, string[]> = {};
  for (const dt of deviceTypesRaw) {
    jenisSpesifikasiMap[dt.nama] =
      dt.spesifikasi.length > 0 ? dt.spesifikasi : getFieldsForType(dt.nama);
  }

  return <ImportDataView jenisSpesifikasiMap={jenisSpesifikasiMap} />;
}
