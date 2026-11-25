// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userId = Number.parseInt(id, 10);

  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: 'ID user tidak valid.' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nama: true,
        email: true,
        divisi: true,
        noTelp: true,
        status: true,
        companyId: true,
        branchId: true,
        company: { select: { id: true, nama: true } },
        branch: { select: { id: true, nama: true } },
        devices: {
          orderBy: { id: 'desc' },
          select: {
            id: true,
            nama: true,
            kodeInventaris: true,
            merk: true,
            tipe: true,
            status: true,
            type: { select: { nama: true } },
          },
        },
        assignments: {
          orderBy: { tglMulai: 'desc' },
          select: {
            id: true,
            tglMulai: true,
            tglSelesai: true,
            device: {
              select: {
                id: true,
                nama: true,
                kodeInventaris: true,
                merk: true,
                tipe: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        OR: [
          { userId },
          { userTerkendalaId: userId },
          { teknisiId: userId },
        ],
      },
      orderBy: { tglLapor: 'desc' },
      select: {
        id: true,
        noTiket: true,
        judul: true,
        status: true,
        tglLapor: true,
        device: {
          select: {
            id: true,
            nama: true,
            kodeInventaris: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...user,
      tickets,
    });
  } catch (error) {
    console.error('Error GET /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Gagal memuat detail pengguna.' },
      { status: 500 }
    );
  }
}