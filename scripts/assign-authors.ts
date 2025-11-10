import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting author assignment...');

  // Different author names for each prompt
  const authorNames = [
    'Alex Chen',
    'Sarah Johnson',
    'Marcus Rodriguez',
    'Emily Zhang',
    'David Kim',
    'Jessica Martinez',
    'Ryan Patel',
    'Olivia Brown',
  ];

  // Get all prompts
  const prompts = await prisma.prompt.findMany({
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Found ${prompts.length} prompts to update...`);

  // Assign a different author to each prompt
  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    const authorName = authorNames[i % authorNames.length];
    
    // Find or create the author
    const author = await prisma.user.upsert({
      where: { email: `${authorName.toLowerCase().replace(' ', '.')}@example.com` },
      update: { name: authorName },
      create: {
        email: `${authorName.toLowerCase().replace(' ', '.')}@example.com`,
        name: authorName,
      },
    });

    // Update the prompt's author
    await prisma.prompt.update({
      where: { id: prompt.id },
      data: { authorId: author.id },
    });

    console.log(`✓ Assigned "${prompt.title}" to ${authorName}`);
  }

  console.log('Author assignment completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during author assignment:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
