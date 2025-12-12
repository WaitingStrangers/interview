#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取项目根目录
const projectRoot = path.resolve(__dirname, '..');
const backupDir = path.join(projectRoot, 'DB');

// 确保备份目录存在
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// 生成备份文件名
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFileName = `interview-backup-${timestamp}.sql`;
const backupPath = path.join(backupDir, backupFileName);

console.log('正在备份数据库...');

try {
    // 从.env文件获取数据库连接信息
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const dbUrlMatch = envContent.match(/DATABASE_URL="mysql:\/\/(.*?):(.*?)@(.*?):(.*?)\/(.*?)\?/);
    
    if (!dbUrlMatch) {
        throw new Error('无法从.env文件解析数据库连接URL');
    }
    
    const [, user, password, host, port, database] = dbUrlMatch;
    
    console.log(`数据库连接信息：`);
    console.log(`  用户: ${user}`);
    console.log(`  主机: ${host}`);
    console.log(`  端口: ${port}`);
    console.log(`  数据库: ${database}`);
    
    // 检查是否有运行中的MySQL容器
    let mysqlContainer = 'interview-mysql';
    let backupCommand;
    
    try {
        // 检查容器是否存在
        execSync(`docker ps -q -f name=${mysqlContainer}`, { stdio: 'ignore' });
        // 如果容器存在，使用容器中的mysqldump
        backupCommand = `docker exec ${mysqlContainer} mysqldump -u ${user} -p${password} ${database} > "${backupPath}"`;
        console.log(`使用Docker容器 ${mysqlContainer} 中的mysqldump工具`);
    } catch (error) {
        // 如果容器不存在，尝试使用系统的mysqldump
        try {
            execSync('mysqldump --version', { stdio: 'ignore' });
            backupCommand = `mysqldump -h ${host} -P ${port} -u ${user} -p${password} ${database} > "${backupPath}"`;
            console.log('使用系统mysqldump工具');
        } catch (systemError) {
            throw new Error('找不到mysqldump工具，请确保MySQL客户端已安装或MySQL容器正在运行');
        }
    }
    
    // 执行备份命令
    execSync(backupCommand, { stdio: 'inherit' });
    
    console.log(`✅ 数据库备份成功！`);
    console.log(`备份文件路径: ${backupPath}`);
    
    // 显示备份文件大小
    const stats = fs.statSync(backupPath);
    const fileSize = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`备份文件大小: ${fileSize} MB`);
    
    // 保留最近10个备份文件，删除旧的
    const backupFiles = fs.readdirSync(backupDir)
        .filter(file => file.startsWith('interview-backup-') && file.endsWith('.sql'))
        .map(file => ({
            name: file,
            path: path.join(backupDir, file),
            mtime: fs.statSync(path.join(backupDir, file)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);
    
    if (backupFiles.length > 10) {
        console.log('\n正在清理旧的备份文件（保留最近10个）...');
        for (let i = 10; i < backupFiles.length; i++) {
            fs.unlinkSync(backupFiles[i].path);
            console.log(`删除旧备份: ${backupFiles[i].name}`);
        }
    }
    
} catch (error) {
    console.error('❌ 数据库备份失败:', error.message);
    process.exit(1);
}
