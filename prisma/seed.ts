import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Seed Categories
  const categories = [
    'Writing',
    'Coding',
    'Marketing',
    'Education',
    'Business',
    'Creative',
    'Data Analysis',
    'Research',
  ];

  console.log('Seeding categories...');
  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });
  }
  console.log(`✓ Seeded ${categories.length} categories`);

  // Seed Models
  const models = [
    'GPT-4',
    'GPT-3.5',
    'Claude 3 Opus',
    'Claude 3 Sonnet',
    'Claude 3 Haiku',
    'Gemini Pro',
    'Llama 3',
    'Mistral',
  ];

  console.log('Seeding models...');
  for (const modelName of models) {
    await prisma.model.upsert({
      where: { name: modelName },
      update: {},
      create: { name: modelName },
    });
  }
  console.log(`✓ Seeded ${models.length} models`);

  // Create a demo user for the prompts
  console.log('Creating demo user...');
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      image: null,
    },
  });
  console.log('✓ Created demo user');

  // Get category and model IDs for demo prompts
  const writingCategory = await prisma.category.findFirst({ where: { name: 'Writing' } });
  const codingCategory = await prisma.category.findFirst({ where: { name: 'Coding' } });
  const marketingCategory = await prisma.category.findFirst({ where: { name: 'Marketing' } });
  const educationCategory = await prisma.category.findFirst({ where: { name: 'Education' } });
  const businessCategory = await prisma.category.findFirst({ where: { name: 'Business' } });

  const gpt4 = await prisma.model.findFirst({ where: { name: 'GPT-4' } });
  const claude = await prisma.model.findFirst({ where: { name: 'Claude 3 Opus' } });
  const gemini = await prisma.model.findFirst({ where: { name: 'Gemini Pro' } });

  // Demo prompts with realistic content
  const demoPrompts = [
    {
      title: 'Professional Email Writer',
      promptText: 'You are a professional email writer. Write a clear, concise, and polite email based on the following context: [CONTEXT]. Maintain a professional tone while being friendly and approachable.',
      categoryId: writingCategory?.id!,
      modelId: gpt4?.id!,
      authorId: demoUser.id,
    },
    {
      title: 'Code Review Assistant',
      promptText: 'Review the following code for best practices, potential bugs, and performance improvements. Provide specific suggestions with explanations:\n\n[CODE]\n\nFocus on: 1) Code quality, 2) Security issues, 3) Performance optimizations, 4) Readability improvements.',
      categoryId: codingCategory?.id!,
      modelId: claude?.id!,
      authorId: demoUser.id,
    },
    {
      title: 'Social Media Caption Generator',
      promptText: 'Create 5 engaging social media captions for [PLATFORM] about [TOPIC]. Each caption should:\n- Be attention-grabbing\n- Include relevant hashtags\n- Encourage engagement\n- Match the brand voice: [BRAND_VOICE]',
      categoryId: marketingCategory?.id!,
      modelId: gpt4?.id!,
      authorId: demoUser.id,
    },
    {
      title: 'Explain Like I\'m Five',
      promptText: 'Explain [COMPLEX_TOPIC] in simple terms that a 5-year-old would understand. Use analogies, simple language, and relatable examples. Break it down step by step.',
      categoryId: educationCategory?.id!,
      modelId: gemini?.id!,
      authorId: demoUser.id,
    },
    {
      title: 'Bug Finder and Fixer',
      promptText: 'Analyze this code and identify any bugs or issues:\n\n[CODE]\n\nFor each issue found:\n1. Explain what the bug is\n2. Why it\'s a problem\n3. Provide the corrected code\n4. Suggest how to prevent similar issues',
      categoryId: codingCategory?.id!,
      modelId: claude?.id!,
      authorId: demoUser.id,
    },
    {
      title: 'Meeting Summary Generator',
      promptText: 'Summarize the following meeting notes into a clear, actionable format:\n\n[MEETING_NOTES]\n\nInclude:\n- Key decisions made\n- Action items with owners\n- Important discussion points\n- Next steps',
      categoryId: businessCategory?.id!,
      modelId: gpt4?.id!,
      authorId: demoUser.id,
    },
    {
      title: 'Creative Story Starter',
      promptText: 'Write an engaging opening paragraph for a story with these elements:\n- Genre: [GENRE]\n- Setting: [SETTING]\n- Main character: [CHARACTER]\n- Conflict: [CONFLICT]\n\nMake it compelling and hook the reader immediately.',
      categoryId: writingCategory?.id!,
      modelId: claude?.id!,
      authorId: demoUser.id,
    },
    {
      title: 'Product Description Optimizer',
      promptText: 'Transform this basic product description into a compelling, SEO-friendly version:\n\n[PRODUCT_DESCRIPTION]\n\nEnhance it with:\n- Emotional appeal\n- Key benefits (not just features)\n- Strong call-to-action\n- Relevant keywords naturally integrated',
      categoryId: marketingCategory?.id!,
      modelId: gemini?.id!,
      authorId: demoUser.id,
    },
  ];

  console.log('Seeding demo prompts...');
  let promptIndex = 0;
  for (const promptData of demoPrompts) {
    const prompt = await prisma.prompt.create({
      data: promptData,
    });

    // Add some random votes to make it realistic
    const voteCount = Math.floor(Math.random() * 15) + 3; // 3-17 votes
    const upvoteRatio = 0.7 + Math.random() * 0.2; // 70-90% upvotes

    for (let i = 0; i < voteCount; i++) {
      // Create unique voter for each vote
      const voter = await prisma.user.upsert({
        where: { email: `voter${promptIndex}_${i}@example.com` },
        update: {},
        create: {
          email: `voter${promptIndex}_${i}@example.com`,
          name: `Voter ${i + 1}`,
        },
      });

      const isUpvote = Math.random() < upvoteRatio;
      await prisma.vote.create({
        data: {
          promptId: prompt.id,
          userId: voter.id,
          type: isUpvote ? 'UP' : 'DOWN',
        },
      });
    }
    promptIndex++;
  }
  console.log(`✓ Seeded ${demoPrompts.length} demo prompts with votes`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
