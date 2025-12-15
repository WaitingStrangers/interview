#!/usr/bin/env node

const { sequelize } = require('./src/utils/sequelize');
const { execSync } = require('child_process');
const path = require('path');

// 导入所有模型
require('./src/models/Question');
require('./src/models/Interview');

async function saveAndBackup() {
  console.log('开始执行数据库同步和备份操作...');
  
  try {
    // 1. 测试数据库连接
    console.log('1. 测试数据库连接...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    
    // 2. 根据JS模型同步数据库结构
    console.log('2. 根据JS模型同步数据库结构...');
    await sequelize.sync({ alter: true });
    console.log('✅ 数据库结构同步成功');
    
    // 3. 执行数据库备份
    console.log('3. 执行数据库备份...');
    const backupScript = path.join(__dirname, 'backup-db.js');
    execSync(`node ${backupScript}`, { stdio: 'inherit' });
    console.log('✅ 数据库备份成功');
    
    console.log('\n🎉 所有操作执行完成！');
    console.log('   - 数据库结构已根据JS模型更新');
    console.log('   - 数据库数据已备份到DB文件夹');
  } catch (error) {
    console.error('❌ 操作失败:', error.message);
    process.exit(1);
  }
}

// 执行主函数
saveAndBackup();
