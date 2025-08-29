const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleData() {
  try {
    console.log('开始创建示例数据...');

    // 创建分类
    const categories = [
      { name: '技术分享', description: '技术相关的文章和教程' },
      { name: '生活感悟', description: '生活中的思考和感悟' },
      { name: '项目经验', description: '项目开发经验分享' },
      { name: '学习笔记', description: '学习过程中的笔记和总结' },
      { name: '工具推荐', description: '实用工具和资源推荐' }
    ];

    console.log('创建分类...');
    for (const categoryData of categories) {
      const slug = categoryData.name.toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') + '-' + Date.now();

      await prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          name: categoryData.name,
          description: categoryData.description,
          slug
        }
      });
      console.log(`✓ 创建分类: ${categoryData.name}`);
    }

    // 创建标签
    const tags = [
      'React',
      'TypeScript',
      'Next.js',
      'Node.js',
      'JavaScript',
      'CSS',
      'HTML',
      'Vue.js',
      'Python',
      'AI/ML',
      '前端开发',
      '后端开发',
      '全栈开发',
      '数据库',
      '设计模式',
      '性能优化',
      '用户体验',
      '开源项目',
      '工具推荐',
      '学习方法'
    ];

    console.log('创建标签...');
    for (const tagName of tags) {
      const slug = tagName.toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') + '-' + Date.now();

      await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: {
          name: tagName,
          slug
        }
      });
      console.log(`✓ 创建标签: ${tagName}`);
    }

    console.log('示例数据创建完成！');
  } catch (error) {
    console.error('创建示例数据失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleData();
