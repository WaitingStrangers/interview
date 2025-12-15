const express = require("express");
const path = require('path');
const app = express();
const port = 3000;

// 导入主路由
const apiRoutes = require('./src/routes/index');

// 导入Sequelize配置
const { testConnection } = require('./src/utils/sequelize');

// 导入所有模型
require('./src/models/Question');
require('./src/models/Interview');

// 解析 JSON 请求体
app.use(express.json());

// 静态资源目录
app.use('/audio', express.static(path.join(__dirname, 'audio')));
app.use("/answer", express.static(path.join(__dirname, "answer")));

// 配置跨域访问
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // 允许所有域
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 处理预检请求
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// 注册API路由
app.use('/api', apiRoutes);

// 仅在直接运行时启动服务器，测试时由测试框架控制
if (require.main === module) {
  // 测试数据库连接
  async function startServer() {
    await testConnection();
    
    // 启动服务器
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  }

  startServer();
}

module.exports = app;
