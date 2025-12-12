const express = require("express");
const path = require('path');
const app = express();
const port = 3000;

// 导入主路由
const apiRoutes = require('./src/routes/index');

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

// 启动服务器
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
