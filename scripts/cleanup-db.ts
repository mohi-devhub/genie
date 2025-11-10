import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database cleanup...');

  // Find and delete prompts from "Mohith Achu"
  const mohithUser = await prisma.user.findFirst({
    where: {
      name: 'Mohith Achu',
    },
  });

  if (mohithUser) {
    console.log(`Found user: ${mohithUser.name} (${mohithUser.email})`);
    
    // Delete all prompts by this user
    const deletedPrompts = await prisma.prompt.deleteMany({
      where: {
        authorId: mohithUser.id,
      },
    });
    
    console.log(`✓ Deleted ${deletedPrompts.count} prompt(s) from Mohith Achu`);
  } else {
    console.log('No user found with name "Mohith Achu"');
  }

  // Update "Demo User" to random names
  const randomNames = [
    'Alex Chen',
    'Sarah Johnson',
    'Marcus Rodriguez',
    'Emily Zhang',
    'David Kim',
    'Jessica Martinez',
    'Ryan Patel',
    'Olivia Brown',
  ];

  const demoUser = await prisma.user.findFirst({
    where: {
      name: 'Demo User',
    },
  });

  if (demoUser) {
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    await prisma.user.update({
      where: { id: demoUser.id },
      data: { name: randomName },
    });
    console.log(`✓ Updated "Demo User" to "${randomName}"`);
  }

  // Update voter names to be more realistic
  const voters = await prisma.user.findMany({
    where: {
      name: {
        startsWith: 'Voter ',
      },
    },
  });

  console.log(`Found ${voters.length} voters to update...`);
  
  for (const voter of voters) {
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    await prisma.user.update({
      where: { id: voter.id },
      data: { name: randomName },
    });
  }
  
  console.log(`✓ Updated ${voters.length} voter names to random names`);

  console.log('Database cleanup completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
