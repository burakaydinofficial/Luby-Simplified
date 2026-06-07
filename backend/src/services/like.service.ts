import { prisma } from '../db/prisma';
import { HttpError } from '../utils/http-error';

// The "Liked" playlist is a virtual view over the Like table.
export async function listLikedLullabies(userId: string) {
  const likes = await prisma.like.findMany({
    where: { userId },
    include: { lullaby: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return likes.map((like) => like.lullaby);
}

export async function like(userId: string, lullabyId: string) {
  const lullaby = await prisma.lullaby.findUnique({
    where: { id: lullabyId },
    select: { id: true },
  });
  if (!lullaby) {
    throw new HttpError(404, 'Lullaby not found');
  }
  await prisma.like.upsert({
    where: { userId_lullabyId: { userId, lullabyId } },
    create: { userId, lullabyId },
    update: {},
  });
}

export async function unlike(userId: string, lullabyId: string) {
  await prisma.like.deleteMany({ where: { userId, lullabyId } });
}
