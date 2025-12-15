const { Sequelize } = require('sequelize');
require('dotenv').config();

// 从环境变量中获取数据库连接参数
// 优先使用docker-compose.yml中定义的环境变量，其次使用.env文件中的DATABASE_URL
let sequelize;

if (process.env.DB_HOST) {
  // 使用docker-compose中定义的环境变量
  sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
} else {
  // 使用.env文件中的DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  const parsedUrl = new URL(dbUrl);
  
  sequelize = new Sequelize({
    dialect: 'mysql',
    host: parsedUrl.hostname,
    port: parseInt(parsedUrl.port),
    username: parsedUrl.username,
    password: parsedUrl.password,
    database: parsedUrl.pathname.slice(1), // 移除开头的斜杠
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
}

// 测试数据库连接
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
}

module.exports = {
  sequelize,
  Sequelize,
  testConnection
};
