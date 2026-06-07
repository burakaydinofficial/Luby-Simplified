import { prisma } from '../db/prisma';
import { HttpError } from '../utils/http-error';

async function assertOwned(userId: string, playlistId: string) {
  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId },
    select: { id: true },
  });
  if (!playlist) {
    throw new HttpError(404, 'Playlist not found');
  }
}

export function listPlaylists(userId: string) {
  return prisma.playlist.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { items: true } } },
  });
}

export function createPlaylist(userId: string, name: string) {
  return prisma.playlist.create({ data: { userId, name } });
}

export async function getPlaylist(userId: string, playlistId: string) {
  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId },
    include: {
      items: {
        orderBy: { position: 'asc' },
        include: { lullaby: { include: { category: true } } },
      },
    },
  });
  if (!playlist) {
    throw new HttpError(404, 'Playlist not found');
  }
  return playlist;
}

export async function renamePlaylist(userId: string, playlistId: string, name: string) {
  await assertOwned(userId, playlistId);
  return prisma.playlist.update({ where: { id: playlistId }, data: { name } });
}

export async function deletePlaylist(userId: string, playlistId: string) {
  await assertOwned(userId, playlistId);
  await prisma.playlist.delete({ where: { id: playlistId } });
}

export async function addItem(userId: string, playlistId: string, lullabyId: string) {
  await assertOwned(userId, playlistId);
  const lullaby = await prisma.lullaby.findUnique({
    where: { id: lullabyId },
    select: { id: true },
  });
  if (!lullaby) {
    throw new HttpError(404, 'Lullaby not found');
  }
  const last = await prisma.playlistItem.findFirst({
    where: { playlistId },
    orderBy: { position: 'desc' },
    select: { position: true },
  });
  const position = (last?.position ?? -1) + 1;
  return prisma.playlistItem.upsert({
    where: { playlistId_lullabyId: { playlistId, lullabyId } },
    create: { playlistId, lullabyId, position },
    update: {},
  });
}

export async function removeItem(userId: string, playlistId: string, lullabyId: string) {
  await assertOwned(userId, playlistId);
  await prisma.playlistItem.deleteMany({ where: { playlistId, lullabyId } });
}
