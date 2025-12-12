#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取项目根目录
const projectRoot = path.resolve(__dirname, '..');
const backupDir = path.join(projectRoot, 'DB');

console.log('正在恢复数据库...');

// 检查备份目录是否存在
if (!fs.existsSync(backupDir)) {
    console.error('❌ 备份目录不存在:', backupDir);
    process.exit(1);
}

// 获取最新的备份文件
const backupFiles = fs.readdirSync(backupDir)
    .filter(file => file.startsWith('interview-backup-') && file.endsWith('.sql'))
    .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        mtime: fs.statSync(path.join(backupDir, file)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);

if (backupFiles.length === 0) {
    console.error('❌ 没有找到数据库备份文件');
    process.exit(1);
}

// 使用最新的备份文件
const latestBackup = backupFiles[0];
console.log(`使用最新的备份文件: ${latestBackup.name}`);

// 从.env文件获取数据库连接信息
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ .env文件不存在');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL="mysql:\/\/(.*?):(.*?)@(.*?):(.*?)\/(.*?)\?/);

if (!dbUrlMatch) {
    console.error('❌ 无法从.env文件解析数据库连接URL');
    process.exit(1);
}

const [, user, password, host, port, database] = dbUrlMatch;

console.log(`数据库连接信息：`);
console.log(`  用户: ${user}`);
console.log(`  主机: ${host}`);
console.log(`  端口: ${port}`);
console.log(`  数据库: ${database}`);

// 检查数据库是否存在，不存在则创建
console.log('\n检查数据库是否存在...');

// 检查是否有运行中的MySQL容器
let mysqlContainer = 'interview-mysql';
let checkDbCommand;

try {
    // 检查容器是否存在
    execSync(`docker ps -q -f name=${mysqlContainer}`, { stdio: 'ignore' });
    // 如果容器存在，使用容器中的mysql
    checkDbCommand = `docker exec ${mysqlContainer} mysql -u ${user} -p${password} -e "CREATE DATABASE IF NOT EXISTS ${database};"`;
    console.log(`使用Docker容器 ${mysqlContainer} 中的mysql工具`);
} catch (error) {
    // 如果容器不存在，尝试使用系统的mysql
    try {
        execSync('mysql --version', { stdio: 'ignore' });
        checkDbCommand = `mysql -h ${host} -P ${port} -u ${user} -p${password} -e "CREATE DATABASE IF NOT EXISTS ${database};"`;
        console.log('使用系统mysql工具');
    } catch (systemError) {
        throw new Error('找不到mysql工具，请确保MySQL客户端已安装或MySQL容器正在运行');
    }
}

try {
    execSync(checkDbCommand, { stdio: 'inherit' });
    console.log('✅ 数据库检查/创建成功');
} catch (error) {
    console.error('❌ 检查/创建数据库失败:', error.message);
    process.exit(1);
}

// 执行恢复命令
console.log('\n开始恢复数据库...');

// 检查是否有运行中的MySQL容器
let mysqlContainerRestore = 'interview-mysql';
let restoreCommand;

try {
    // 检查容器是否存在
    execSync(`docker ps -q -f name=${mysqlContainerRestore}`, { stdio: 'ignore' });
    // 如果容器存在，使用容器中的mysql
    restoreCommand = `docker exec -i ${mysqlContainerRestore} mysql -u ${user} -p${password} ${database} < "${latestBackup.path}"`;
    console.log(`使用Docker容器 ${mysqlContainerRestore} 中的mysql工具`);
} catch (error) {
    // 如果容器不存在，尝试使用系统的mysql
    try {
        execSync('mysql --version', { stdio: 'ignore' });
        restoreCommand = `mysql -h ${host} -P ${port} -u ${user} -p${password} ${database} < "${latestBackup.path}"`;
        console.log('使用系统mysql工具');
    } catch (systemError) {
        throw new Error('找不到mysql工具，请确保MySQL客户端已安装或MySQL容器正在运行');
    }
}

try {
    execSync(restoreCommand, { stdio: 'inherit' });
    
    console.log('\n✅ 数据库恢复成功！');
    console.log(`使用备份文件: ${latestBackup.path}`);
} catch (error) {
    console.error('\n❌ 数据库恢复失败:', error.message);
    process.exit(1);
}
