import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import firestore from '@/lib/db/firestore';
import { DBRegistrant } from '@/@types/firestore';
import APIResponse from '@/lib/classes/APIResponse';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongEnoughPassword(password: string): boolean {
  return password.length >= 6;
}

function emailToDocId(email: string): string {
  return email.replace(/[.@]/g, '_');
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { email, password, rsn, twitchUsername } = body as DBRegistrant;

  if (!email || !password) {
    return APIResponse.error('Email and password are required.');
  }

  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    return APIResponse.error('Invalid email.');
  }

  if (!isStrongEnoughPassword(password)) {
    return APIResponse.error('Password must be at least 10 characters.');
  }

  const userId = emailToDocId(normalizedEmail);
  const userRef = firestore.collection('users').doc(userId);

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    await firestore.runTransaction(async (tx) => {
      tx.create(userRef, {
        email: normalizedEmail,
        roles: ['user'],
        passwordHash,
        ...(rsn && { rsn: rsn.trim() }),
        ...(twitchUsername && { twitchUsername: twitchUsername.trim() }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    return APIResponse.success('User registered successfully.', {
      id: userId,
      email: normalizedEmail,
    }, 201);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';

    if (msg.includes('ALREADY_EXISTS') || msg.toLowerCase().includes('already exists')) {
      return APIResponse.error('An account with this email already exists.', 409);
    }

    console.error('register error:', err);
    return APIResponse.error('Internal Server Error', 500);
  }
}
