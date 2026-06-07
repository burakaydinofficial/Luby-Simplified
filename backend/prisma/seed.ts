import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const mediaDir = path.resolve(process.cwd(), 'media');

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Reads a "- **Label**: value" line from the markdown body.
function field(body: string, label: string): string {
  const match = body.match(new RegExp(`\\*\\*${label}\\*\\*:\\s*(.+)`));
  return match ? match[1].trim() : '';
}

function parseDuration(value: string): number {
  const match = value.match(/(\d+):(\d+)/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : 0;
}

interface ParsedLullaby {
  slug: string;
  title: string;
  categoryName: string;
  style: string;
  tempo: string;
  durationSec: number;
  tags: string[];
  lyrics: string;
}

function parse(file: string): ParsedLullaby | null {
  const slug = path.basename(file, '.md');
  const raw = fs.readFileSync(path.join(mediaDir, file), 'utf8');

  const categoryName = field(raw, 'Topic');
  if (!categoryName) return null; // skip anything that isn't a track

  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const lyricsHeader = '## Lyrics';
  const lyricsIdx = raw.indexOf(lyricsHeader);

  return {
    slug,
    title: titleMatch ? titleMatch[1].trim() : slug,
    categoryName,
    style: field(raw, 'Style'),
    tempo: field(raw, 'Tempo'),
    durationSec: parseDuration(field(raw, 'Duration')),
    tags: field(raw, 'Tags')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    lyrics: lyricsIdx >= 0 ? raw.slice(lyricsIdx + lyricsHeader.length).trim() : '',
  };
}

async function main() {
  const files = fs
    .readdirSync(mediaDir)
    .filter((file) => file.endsWith('.md'))
    // only seed tracks that have an accompanying audio file
    .filter((file) => fs.existsSync(path.join(mediaDir, file.replace(/\.md$/, '.mp3'))));

  const categoryIdBySlug = new Map<string, string>();

  for (const file of files) {
    const parsed = parse(file);
    if (!parsed) continue;

    const categorySlug = slugify(parsed.categoryName);
    let categoryId = categoryIdBySlug.get(categorySlug);
    if (!categoryId) {
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        create: { slug: categorySlug, name: parsed.categoryName },
        update: { name: parsed.categoryName },
      });
      categoryId = category.id;
      categoryIdBySlug.set(categorySlug, categoryId);
    }

    const data = {
      title: parsed.title,
      style: parsed.style,
      tempo: parsed.tempo,
      durationSec: parsed.durationSec,
      lyrics: parsed.lyrics,
      tags: parsed.tags,
      audioUrl: `/media/${parsed.slug}.mp3`,
      categoryId,
    };

    await prisma.lullaby.upsert({
      where: { slug: parsed.slug },
      create: { slug: parsed.slug, ...data },
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
