// db.js
const mysql = require('mysql2/promise');

// 创建数据库连接池，方便多次复用
const pool = mysql.createPool({
  host: 'localhost',       // 数据库地址
  user: 'root',            // 数据库用户名
  password: 'root123',     // 数据库密码
  database: 'interview',   // 数据库名
  port: 3306,              // MySQL 端口
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
