import { PrismaClient } from '@prisma/client';
import slug from 'elegant-slug';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const user = {
    firstName: 'Durin',
    lastName: 'Tasondock',
    password: 'albafikaforNestAuthApp@84',
    email: 'temgoua484@gmail.com',
    username: 'durin237',
    gid: new uuidv4(),
    urlSlug: slug('durin-tasondocok', {
      unique: true,
      letterCase: 'lowercase',
    }),
  };

  prisma.user.upsert({
    where: {
      email: user.email,
    },
    create: user,
    update: {
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      username: user.username,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
