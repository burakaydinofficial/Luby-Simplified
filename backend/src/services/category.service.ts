import { prisma } from '../db/prisma';

export function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { lullabies: true } } },
  });
}
