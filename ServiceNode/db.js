// db.js
const mysql = require('mysql2/promise');

// 从环境变量中获取数据库配置
const host = process.env.DB_HOST || 'mysql';
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || 'root123';
const database = process.env.DB_NAME || 'interview';
const port = process.env.DB_PORT || 3306;

// 创建数据库连接池，方便多次复用
const pool = mysql.createPool({
  host: host,       // 数据库地址
  user: user,        // 数据库用户名
  password: password, // 数据库密码
  database: database,   // 数据库名
  port: port,          // MySQL 端口
  waitForConnections: true,
  connectionLimit: 10,     // 连接池大小
  queueLimit: 0
});

// 测试数据库连接
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully!');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err);
  }
}

// 执行测试
testConnection();

module.exports = pool;
