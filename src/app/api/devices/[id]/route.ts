// src/app/api/devices/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { WHERE_USER_AKTIF } from '@/lib/status-filter';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const deviceId = Number.parseInt(id, 10);

  if (Number.isNaN(deviceId)) {
    return NextResponse.json({ error: 'ID perangkat tidak valid.' }, { status: 400 });
  }

  try {
    const [device, tickets, deviceTypes, companies, branches, users] =
      await Promise.all([
        prisma.device.findUnique({
          where: { id: deviceId },
          include: {
            type: true,
            company: true,
            branch: true,
            user: {
              select: { id: true, nama: true, email: true, divisi: true },
            },
            attributes: true,
            attachments: true,
            assignments: {
              include: {
                user: { select: { id: true, nama: true } },
              },
              orderBy: { tglMulai: 'desc' },
            },
          },
        }),
        prisma.ticket.findMany({
          where: { deviceId },
          orderBy: { tglLapor: 'desc' },
          select: {
            id: true,
            noTiket: true,
            judul: true,
            prioritas: true,
            status: true,
            tglLapor: true,
            teknisi: { select: { id: true, nama: true } },
            userTerkendala: { select: { id: true, nama: true } },
          },
        }),
        prisma.deviceType.findMany({
          select: { id: true, nama: true },
          orderBy: { nama: 'asc' },
        }),
        prisma.company.findMany({
          select: { id: true, nama: true },
          orderBy: { nama: 'asc' },
        }),
        prisma.branch.findMany({
          select: { id: true, nama: true, companyId: true },
          orderBy: { nama: 'asc' },
        }),
        prisma.user.findMany({
          where: {
            OR: [WHERE_USER_AKTIF, { devices: { some: { id: deviceId } } }],
          },
          select: { id: true, nama: true },
          orderBy: { nama: 'asc' },
        }),
      ]);

    if (!device) {
      return NextResponse.json(
        { error: 'Perangkat tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      device: {
        ...device,
        hargaBeli: device.hargaBeli ? Number(device.hargaBeli) : null,
        tickets,
      },
      options: {
        deviceTypes,
        companies,
        branches,
        users,
      },
    });
  } catch (error) {
    console.error('Error GET /api/devices/[id]:', error);
    return NextResponse.json(
      { error: 'Gagal memuat detail perangkat.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const deviceId = Number.parseInt(id, 10);

  if (Number.isNaN(deviceId)) {
    return NextResponse.json({ error: 'ID perangkat tidak valid.' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const nama = String(body.nama ?? '').trim();

    if (!nama) {
      return NextResponse.json(
        { error: 'Nama perangkat wajib diisi.' },
        { status: 400 }
      );
    }

    const toNullableInt = (v: unknown) => {
      if (v === null || v === undefined || v === '') return null;
      const n = Number.parseInt(String(v), 10);
      return Number.isNaN(n) ? null : n;
    };

    const toNullableStr = (v: unknown) => {
      if (v === null || v === undefined) return null;
      const s = String(v).trim();
      return s.length > 0 ? s : null;
    };

    const updated = await prisma.device.update({
      where: { id: deviceId },
      data: {
        nama,
        kodeInventaris: toNullableStr(body.kodeInventaris),
        merk: toNullableStr(body.merk),
        tipe: toNullableStr(body.tipe),
        serialNumber: toNullableStr(body.serialNumber),
        tglBeli: body.tglBeli ? new Date(body.tglBeli) : null,
        status: toNullableStr(body.status) ?? 'Aktif',
        keterangan: toNullableStr(body.keterangan),
        typeId: toNullableInt(body.typeId),
        companyId: toNullableInt(body.companyId),
        branchId: toNullableInt(body.branchId),
        userId: toNullableInt(body.userId),
      },
    });

    return NextResponse.json({ success: true, device: updated });
  } catch (error) {
    console.error('Error PATCH /api/devices/[id]:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan perubahan perangkat.' },
      { status: 500 }
    );
  }
}