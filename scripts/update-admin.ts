import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('更新管理员信息...');

  // 更新管理员用户
  const adminUser = await prisma.user.update({
    where: { username: 'admin' },
    data: {
      email: '13617296551@163.com',
      password: await hashPassword('YangLiya02171998'),
    },
  });

  console.log('管理员信息更新成功:', adminUser.email);
  console.log('新的登录信息:');
  console.log('邮箱: 13617296551@163.com');
  console.log('密码: YangLiya02171998');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
