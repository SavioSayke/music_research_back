import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();

    // Agora o prisma funciona de forma independente
    const participantCount = await prisma.participant.count();
    const sessionCount = await prisma.session.count();
    const playCount = await prisma.play.count();
    const responseCount = await prisma.response.count();
    const stimulusSetCount = await prisma.stimulusSet.count();

    console.log('Counts:');
    console.log({
      participantCount,
      sessionCount,
      playCount,
      responseCount,
      stimulusSetCount,
    });
  } catch (err) {
    console.error('Error during DB test:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
