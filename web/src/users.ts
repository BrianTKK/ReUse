import { db } from "./prisma/db";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return EMAIL_PATTERN.test(email) ? email : null;
}

export async function findUserByEmail(email: string) {
  return db.orm.public.User.where({ email }).first();
}

export async function findOrCreateUser(email: string, name?: string | null) {
  const existing = await findUserByEmail(email);
  if (existing) return existing;

  return db.orm.public.User.create({ email, name: name?.trim() || null });
}
