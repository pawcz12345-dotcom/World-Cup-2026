import { PrismaClient } from '@prisma/client';
import { GROUP_MATCHES } from '../lib/worldcup-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with group stage match results...');

  // Create MatchResult rows for all 48 group stage matches
  let created = 0;
  let skipped = 0;

  for (const match of GROUP_MATCHES) {
    const existing = await prisma.matchResult.findUnique({
      where: { matchId: match.matchId },
    });

    if (!existing) {
      await prisma.matchResult.create({
        data: {
          matchId: match.matchId,
          homeGoals: null,
          awayGoals: null,
          result: null,
          status: 'scheduled',
        },
      });
      created++;
    } else {
      skipped++;
    }
  }

  console.log(`Done! Created ${created} match results, skipped ${skipped} existing.`);
  console.log(`Total group stage matches: ${GROUP_MATCHES.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
