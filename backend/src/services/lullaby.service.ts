import { prisma } from '../db/prisma';
import { HttpError } from '../utils/http-error';

export function listLullabies(opts: { category?: string; search?: string }) {
  return prisma.lullaby.findMany({
    where: {
      ...(opts.category ? { category: { slug: opts.category } } : {}),
      ...(opts.search
        ? { title: { contains: opts.search, mode: 'insensitive' } }
        : {}),
    },
    include: { category: true },
    orderBy: { title: 'asc' },
  });
}

export async function getLullaby(id: string) {
  const lullaby = await prisma.lullaby.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!lullaby) {
    throw new HttpError(404, 'Lullaby not found');
  }
  return lullaby;
}
