const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // 检查是否已存在该邮箱的用户
    const existingUser = await prisma.user.findUnique({
      where: { email: '13617296551@163.com' }
    });

    if (existingUser) {
      console.log('用户已存在，更新密码...');
      const hashedPassword = await bcrypt.hash('YangLiya02171998', 12);
      
      await prisma.user.update({
        where: { email: '13617296551@163.com' },
        data: {
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      console.log('管理员密码已更新');
    } else {
      console.log('创建新的管理员用户...');
      const hashedPassword = await bcrypt.hash('YangLiya02171998', 12);
      
      await prisma.user.create({
        data: {
          email: '13617296551@163.com',
          username: 'admin',
          password: hashedPassword,
          name: '管理员',
          role: 'ADMIN'
        }
      });
      console.log('管理员用户创建成功');
    }
  } catch (error) {
    console.error('创建管理员失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
