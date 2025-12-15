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

// 初始化Sequelize迁移
program
  .command('init')
  .description('初始化Sequelize迁移配置')
  .action(() => {
    try {
      console.log('正在初始化Sequelize迁移配置...');
      execSync('npx sequelize-cli init', { stdio: 'inherit' });
      console.log('✅ Sequelize迁移配置初始化成功');
    } catch (error) {
      console.error('❌ Sequelize迁移配置初始化失败:', error.message);
      process.exit(1);
    }
  });

// 创建迁移文件
program
  .command('migrate:generate <name>')
  .description('生成迁移文件')
  .action((name) => {
    try {
      console.log(`正在生成迁移文件: ${name}...`);
      execSync(`npx sequelize-cli migration:generate --name ${name}`, { stdio: 'inherit' });
      console.log('✅ 迁移文件生成成功');
    } catch (error) {
      console.error('❌ 迁移文件生成失败:', error.message);
      process.exit(1);
    }
  });

// 运行迁移
program
  .command('migrate')
  .description('运行所有未执行的迁移')
  .action(() => {
    try {
      console.log('正在运行数据库迁移...');
      execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
      console.log('✅ 迁移运行成功');
    } catch (error) {
      console.error('❌ 迁移运行失败:', error.message);
      process.exit(1);
    }
  });

// 回滚迁移
program
  .command('migrate:undo')
  .description('回滚上一次迁移')
  .action(() => {
    try {
      console.log('正在回滚上一次迁移...');
      execSync('npx sequelize-cli db:migrate:undo', { stdio: 'inherit' });
      console.log('✅ 迁移回滚成功');
    } catch (error) {
      console.error('❌ 迁移回滚失败:', error.message);
      process.exit(1);
    }
  });

// 回滚所有迁移
program
  .command('migrate:undo:all')
  .description('回滚所有迁移')
  .action(() => {
    try {
      console.log('正在回滚所有迁移...');
      execSync('npx sequelize-cli db:migrate:undo:all', { stdio: 'inherit' });
      console.log('✅ 所有迁移回滚成功');
    } catch (error) {
      console.error('❌ 迁移回滚失败:', error.message);
      process.exit(1);
    }
  });

// 创建模型
program
  .command('model:generate')
  .description('生成Sequelize模型')
  .option('-n, --name <name>', '模型名称')
  .option('-a, --attributes <attributes>', '模型属性')
  .action((options) => {
    if (!options.name || !options.attributes) {
      console.error('❌ 请提供模型名称和属性');
      console.error('使用示例: node db-cli.js model:generate --name User --attributes firstName:string,lastName:string,email:string');
      process.exit(1);
    }
    
    try {
      console.log(`正在生成模型: ${options.name}...`);
      execSync(`npx sequelize-cli model:generate --name ${options.name} --attributes ${options.attributes}`, { stdio: 'inherit' });
      console.log('✅ 模型生成成功');
    } catch (error) {
      console.error('❌ 模型生成失败:', error.message);
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
    execSync('npx sequelize-cli db:migrate:undo:all', { stdio: 'inherit' });
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
    console.log('✅ 数据库重置成功');
  } catch (error) {
    console.error('❌ 数据库重置失败:', error.message);
    process.exit(1);
  }
}

// 显示迁移状态
program
  .command('status')
  .description('显示数据库迁移状态')
  .action(() => {
    try {
      console.log('正在检查数据库迁移状态...');
      execSync('npx sequelize-cli db:migrate:status', { stdio: 'inherit' });
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
