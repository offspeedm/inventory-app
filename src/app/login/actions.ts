// src/app/login/actions.ts
'use server'

import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/session'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return redirect('/login?error=Invalid credentials')
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.password) {
    return redirect('/login?error=Invalid credentials')
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return redirect('/login?error=Invalid credentials')
  }

  await createSession(user.id.toString());
  redirect('/dashboard')
}

// FUNGSI INI YANG HILANG DAN MEMBUAT ERROR
export async function logout() {
  const { deleteSession } = await import('@/lib/session');
  await deleteSession();
  redirect('/login');
}