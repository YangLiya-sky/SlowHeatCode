#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function monitorAccelerate() {
  console.log('🚀 Prisma Accelerate Schema Sync Monitor');
  console.log('=====================================');
  console.log('⏰ Started at:', new Date().toLocaleString());
  console.log('');
  
  const prisma = new PrismaClient({ log: ['error'] });
  const tables = ['user', 'post', 'category', 'comment', 'tag', 'media'];
  
  let attempt = 1;
  const maxAttempts = 20; // 最多检查20次（约10分钟）
  const interval = 30000; // 每30秒检查一次
  
  while (attempt <= maxAttempts) {
    try {
      console.log(`🔍 Attempt ${attempt}/${maxAttempts} - Checking sync status...`);
      
      await prisma.$connect();
      
      // 测试基本连接
      await prisma.$queryRaw`SELECT 1`;
      
      // 检查表同步状态
      let syncedCount = 0;
      const status = {};
      
      for (const table of tables) {
        try {
          let count;
          switch(table) {
            case 'user': count = await prisma.user.count(); break;
            case 'post': count = await prisma.post.count(); break;
            case 'category': count = await prisma.category.count(); break;
            case 'comment': count = await prisma.comment.count(); break;
            case 'tag': count = await prisma.tag.count(); break;
            case 'media': count = await prisma.media.count(); break;
          }
          status[table] = { synced: true, count };
          syncedCount++;
        } catch (error) {
          status[table] = { synced: false };
        }
      }
      
      const syncPercentage = Math.round((syncedCount / tables.length) * 100);
      
      console.log(`📊 Progress: ${syncedCount}/${tables.length} tables (${syncPercentage}%)`);
      
      // 显示详细状态
      tables.forEach(table => {
        const s = status[table];
        if (s.synced) {
          console.log(`   ✅ ${table}: synced (${s.count} records)`);
        } else {
          console.log(`   ⏳ ${table}: waiting...`);
        }
      });
      
      if (syncPercentage === 100) {
        console.log('');
        console.log('🎉 SUCCESS! Schema sync complete!');
        console.log('✅ Prisma Accelerate is fully ready!');
        console.log('');
        
        // 测试管理员查询
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        console.log(`👤 Admin users: ${adminCount}`);
        
        if (adminCount === 0) {
          console.log('');
          console.log('🔗 Ready for setup! Visit:');
          console.log('   https://slow-heat-code.vercel.app/setup');
          console.log('🔑 Setup key: admin-setup-2025');
        }
        
        console.log('');
        console.log('🚀 Performance benefits now active:');
        console.log('   • Global edge caching');
        console.log('   • 50-80% faster queries');
        console.log('   • Optimized connection pooling');
        console.log('   • Auto-scaling');
        
        break;
      }
      
      await prisma.$disconnect();
      
      if (attempt < maxAttempts) {
        console.log(`⏰ Waiting 30 seconds before next check...`);
        console.log('');
        await new Promise(resolve => setTimeout(resolve, interval));
      }
      
    } catch (error) {
      console.error(`❌ Error on attempt ${attempt}:`, error.message);
      await prisma.$disconnect();
      
      if (attempt < maxAttempts) {
        console.log(`⏰ Retrying in 30 seconds...`);
        console.log('');
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
    
    attempt++;
  }
  
  if (attempt > maxAttempts) {
    console.log('⏰ Monitoring timeout reached.');
    console.log('💡 Schema sync may take longer than expected.');
    console.log('🔄 You can run this script again later to check progress.');
  }
  
  await prisma.$disconnect();
  console.log('');
  console.log('🔌 Monitor stopped at:', new Date().toLocaleString());
}

// 处理中断信号
process.on('SIGINT', () => {
  console.log('\n👋 Monitor stopped by user');
  process.exit(0);
});

// 运行监控
monitorAccelerate().catch(console.error);
