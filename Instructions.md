库说明

使用前后端分离
数据库使用MySql
数据存储目前使用本地存储,计划使用:Cloudflare R2 + Cloudflare Workers
程序部署:docker + k8s + ingress-nginx

# interview 编写与使用指南

## 1. interview 简介

使用前后端分离.前端:vue3 + element-plus 后端:nodejs + express
数据库使用MySql
数据存储目前使用本地存储,计划使用:Cloudflare R2 + Cloudflare Workers
程序部署:docker + k8s + ingress-nginx

前端启动:
```
cd interview
npm install
npm run dev
```

后端启动:
```
cd serverNode
npm install
npm start
```

## 2. 部署生产环境

### 2.1 环境要求

- Docker：[安装指南](https://docs.docker.com/get-docker/)
- Docker Compose：通常随 Docker 一起安装
- Git：用于拉取代码

### 2.2 部署流程

#### 2.2.1 拉取代码

```bash
git clone <your-github-repo-url>
cd <repo-directory>
```

#### 2.2.2 配置选择

根据您的环境选择合适的部署方案：

##### 方案 A：使用现有 MySQL 数据库（推荐）

**前提条件**：
- 目标电脑上已有 MySQL 服务运行
- MySQL 端口：3306
- 数据库名称：interview
- 用户名：root
- 密码：root123

**配置修改**：

1. 确保 `ServiceNode/db.js` 中的数据库配置与您的现有 MySQL 一致：
   ```javascript
   const pool = mysql.createPool({
     host: process.env.DB_HOST || 'mysql',  // 使用 host.docker.internal 连接宿主机 MySQL
     user: process.env.DB_USER || 'root',
     password: process.env.DB_PASSWORD || 'root123',
     database: process.env.DB_NAME || 'interview',
     port: process.env.DB_PORT || 3306
   });
   ```

2. 确保 `docker-compose.yml` 中后端服务的环境变量配置正确：
   ```yaml
   environment:
     - DB_HOST=host.docker.internal  # 连接宿主机 MySQL
     - DB_USER=root
     - DB_PASSWORD=root123
     - DB_NAME=interview
     - DB_PORT=3306
   ```

##### 方案 B：使用容器化 MySQL（首次部署推荐）

**配置修改**：

1. 取消 `docker-compose.yml` 中 MySQL 服务的注释（如果已注释）：
   ```yaml
   mysql:
     image: mysql:8.0
     networks:
       - app-network
     environment:
       MYSQL_ROOT_PASSWORD: root123
       MYSQL_DATABASE: interview
       MYSQL_ALLOW_EMPTY_PASSWORD: "no"
     volumes:
       - mysql-data:/var/lib/mysql
   ```

2. 确保 MySQL 端口 3306 未被占用

#### 2.2.3 启动服务

**一键启动所有服务**：

```bash
docker-compose up -d
```

**启动指定服务**：

```bash
docker-compose up -d <service-name>
# 例如：docker-compose up -d backend
```

#### 2.2.4 验证服务

服务启动后，验证是否正常运行：

```bash
# 查看服务状态
docker-compose ps

# 验证前端是否正常
curl -I http://localhost

# 验证后端 API 是否正常
curl http://localhost/api/questions
```

### 2.3 访问方式

- **前端应用**：通过浏览器访问 `http://localhost`
- **后端 API**：
  - 通过 Nginx 代理：`http://localhost/api/`
  - 直接访问：`http://localhost:3000`

### 2.4 服务管理

#### 2.4.1 查看服务日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看单个服务日志
docker-compose logs -f <service-name>
# 例如：docker-compose logs -f backend
```

#### 2.4.2 停止服务

```bash
# 停止所有服务，但保留容器
docker-compose stop

# 停止并移除所有容器、网络和卷
docker-compose down
```

#### 2.4.3 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启单个服务
docker-compose restart <service-name>
```

#### 2.4.4 重新构建服务

```bash
# 构建并启动所有服务
docker-compose up --build -d

# 构建并启动单个服务
docker-compose up --build -d <service-name>
```

### 2.5 数据库初始化

如果使用新的 MySQL 数据库，需要初始化表结构：

```bash
# 进入后端容器
docker exec -it interview-backend-1 bash

# 执行初始化命令
node -e "
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root123',
  database: process.env.DB_NAME || 'interview',
  port: process.env.DB_PORT || 3306
});

(async () => {
  // 创建 Question 表
  await pool.query(`CREATE TABLE IF NOT EXISTS Question (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    type INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  // 创建 Interview 表
  CREATE TABLE IF NOT EXISTS Interview (
    id INT AUTO_INCREMENT PRIMARY KEY,
    interview_id VARCHAR(255) NOT NULL,
    question_id INT NOT NULL,
    answer_path VARCHAR(255) NOT NULL,
    raw_answer TEXT,
    refined_answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES Question(id) ON DELETE CASCADE
  );`);
  
  console.log('数据库表初始化完成');
  process.exit();
})();
"
```

### 2.6 常见问题处理

#### 2.6.1 端口冲突

**症状**：启动服务时出现 `port is already allocated` 错误

**解决方法**：

1. 停止占用端口的进程
2. 或修改 `docker-compose.yml` 中的端口映射：
   ```yaml
   nginx:
     ports:
       - "8080:80"  # 将 8080 改为其他可用端口
   
   backend:
     ports:
       - "3001:3000"  # 将 3001 改为其他可用端口
   ```

#### 2.6.2 数据库连接失败

**症状**：后端日志显示 `Error: connect ECONNREFUSED`

**解决方法**：

1. 确保 MySQL 服务正在运行
2. 检查数据库配置是否正确：
   - 用户名和密码
   - 数据库名称
   - 端口号
3. 如果使用现有 MySQL，确保防火墙允许连接

#### 2.6.3 前端路由无法访问

**症状**：直接访问 `http://localhost/insert` 显示 404 错误

**解决方法**：

1. 确保前端容器使用了正确的 Nginx 配置
2. 检查 `Interview/nginx.conf` 文件是否包含 `try_files $uri $uri/ /index.html;`
3. 重新构建前端容器：
   ```bash
   docker-compose up --build -d frontend
   ```

#### 2.6.4 服务启动后无法访问

**解决方法**：

1. 检查服务状态：`docker-compose ps`
2. 查看服务日志：`docker-compose logs -f <service-name>`
3. 检查防火墙设置，确保端口已开放

### 2.7 开发环境部署

如果需要热更新功能，可配置开发环境：

#### 2.7.1 前端开发环境

```bash
cd Interview
npm install
npm run dev
```

#### 2.7.2 后端开发环境

```bash
cd ServiceNode
npm install
npx nodemon index.js
```

### 2.8 生产环境优化建议

1. **配置 HTTPS**：使用 Let's Encrypt 或其他证书颁发机构获取 SSL 证书
2. **使用持久化存储**：为音频文件和数据库数据配置持久化存储
3. **监控服务**：添加 Prometheus + Grafana 监控
4. **日志管理**：使用 ELK Stack 或 Loki 管理日志
5. **自动部署**：配置 CI/CD 流水线，实现自动构建和部署

### 2.9 升级指南

#### 2.9.1 拉取最新代码

```bash
git pull
```

#### 2.9.2 重新构建服务

```bash
docker-compose up --build -d
```

#### 2.9.3 数据库迁移

如果数据库结构有变化，执行：

```bash
# 进入后端容器
docker exec -it interview-backend-1 bash

# 执行数据库迁移脚本
node migration.js
```

---

通过以上步骤，您可以成功部署和管理前后端服务。如果遇到任何问题，建议查看服务日志或参考 Docker 官方文档。
