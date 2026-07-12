import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const mediaDir = path.resolve(process.cwd(), 'media');

// A record in media/catalog.json — the index of the audio library.
interface CatalogEntry {
  slug: string;
  title: string;
  category: string;
  style: string;
  tempo: string;
  durationSec: number;
  tags: string[];
  lyrics: string;
}

// Turn a category name into a URL-friendly slug ("Ocean & Water" -> "ocean-water").
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const catalog: CatalogEntry[] = JSON.parse(
    fs.readFileSync(path.join(mediaDir, 'catalog.json'), 'utf8'),
  );

  const categoryIdBySlug = new Map<string, string>();

  for (const entry of catalog) {
    // Only seed tracks that actually have an audio file.
    if (!fs.existsSync(path.join(mediaDir, `${entry.slug}.mp3`))) continue;

    const categorySlug = slugify(entry.category);
    let categoryId = categoryIdBySlug.get(categorySlug);
    if (!categoryId) {
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        create: { slug: categorySlug, name: entry.category },
        update: { name: entry.category },
      });
      categoryId = category.id;
      categoryIdBySlug.set(categorySlug, categoryId);
    }

    const data = {
      title: entry.title,
      style: entry.style,
      tempo: entry.tempo,
      durationSec: entry.durationSec,
      lyrics: entry.lyrics,
      tags: entry.tags,
      audioUrl: `/media/${entry.slug}.mp3`,
      categoryId,
    };

    await prisma.lullaby.upsert({
      where: { slug: entry.slug },
      create: { slug: entry.slug, ...data },
      update: data,
    });
  }

  const [categories, lullabies] = await Promise.all([
    prisma.category.count(),
    prisma.lullaby.count(),
  ]);
  console.log(`Seed complete: ${lullabies} lullabies across ${categories} categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
