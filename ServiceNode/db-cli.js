#!/usr/bin/env node

const { execSync } = require('child_process');
const { program } = require('commander');
const path = require('path');

// 设置当前工作目录为脚本所在目录
process.chdir(path.dirname(__filename));

// 定义命令行参数
program
  .version('1.0.0')
  .description('数据库操作命令行工具');

// 生成Prisma Client
program
  .command('generate')
  .description('生成Prisma Client')
  .action(() => {
    try {
      console.log('正在生成Prisma Client...');
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma Client生成成功');
    } catch (error) {
      console.error('❌ Prisma Client生成失败:', error.message);
      process.exit(1);
    }
  });

// 创建数据库迁移
program
  .command('migrate <name>')
  .description('创建并应用数据库迁移')
  .action((name) => {
    try {
      console.log(`正在创建迁移: ${name}...`);
      execSync(`npx prisma migrate dev --name ${name}`, { stdio: 'inherit' });
      console.log('✅ 迁移创建并应用成功');
    } catch (error) {
      console.error('❌ 迁移创建失败:', error.message);
      process.exit(1);
    }
  });

// 应用所有未应用的迁移
program
  .command('migrate-apply')
  .description('应用所有未应用的数据库迁移')
  .action(() => {
    try {
      console.log('正在应用数据库迁移...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ 迁移应用成功');
    } catch (error) {
      console.error('❌ 迁移应用失败:', error.message);
      process.exit(1);
    }
  });

// 生成迁移但不应用
program
  .command('migrate-create <name>')
  .description('创建数据库迁移但不应用')
  .action((name) => {
    try {
      console.log(`正在创建迁移文件: ${name}...`);
      execSync(`npx prisma migrate dev --name ${name} --create-only`, { stdio: 'inherit' });
      console.log('✅ 迁移文件创建成功');
    } catch (error) {
      console.error('❌ 迁移文件创建失败:', error.message);
      process.exit(1);
    }
  });

// 重置数据库
program
  .command('reset')
  .description('重置数据库（危险操作，会删除所有数据）')
  .option('-f, --force', '强制重置，不询问确认')
  .action((options) => {
    if (!options.force) {
      console.log('⚠️  警告：此操作会删除所有数据库数据并重新创建表结构！');
      console.log('请确认是否继续？(y/N)');
      
      // 监听用户输入
      process.stdin.once('data', (data) => {
        const input = data.toString().trim().toLowerCase();
        if (input === 'y' || input === 'yes') {
          executeReset();
        } else {
          console.log('❌ 操作已取消');
          process.exit(0);
        }
      });
    } else {
      executeReset();
    }
  });

// 执行数据库重置
function executeReset() {
  try {
    console.log('正在重置数据库...');
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
    console.log('✅ 数据库重置成功');
  } catch (error) {
    console.error('❌ 数据库重置失败:', error.message);
    process.exit(1);
  }
}

// 查看数据库结构
program
  .command('studio')
  .description('打开Prisma Studio查看数据库结构')
  .action(() => {
    try {
      console.log('正在打开Prisma Studio...');
      execSync('npx prisma studio', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ 打开Prisma Studio失败:', error.message);
      process.exit(1);
    }
  });

// 验证Prisma Schema
program
  .command('validate')
  .description('验证Prisma Schema的正确性')
  .action(() => {
    try {
      console.log('正在验证Prisma Schema...');
      execSync('npx prisma validate', { stdio: 'inherit' });
      console.log('✅ Prisma Schema验证成功');
    } catch (error) {
      console.error('❌ Prisma Schema验证失败:', error.message);
      process.exit(1);
    }
  });

// 显示数据库连接状态
program
  .command('status')
  .description('显示数据库连接状态和迁移状态')
  .action(() => {
    try {
      console.log('正在检查数据库状态...');
      execSync('npx prisma migrate status', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ 检查数据库状态失败:', error.message);
      process.exit(1);
    }
  });

// 解析命令行参数
program.parse(process.argv);

// 如果没有提供命令，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
