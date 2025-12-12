# interview 编写与使用指南

## 1. 项目简介

### 1.1 项目概述
- **架构**: 前后端分离
- **前端**: Vue3 + Element Plus
- **后端**: Node.js + Express + Prisma ORM
- **数据库**: MySQL
- **存储**: 本地存储 (计划迁移到 Cloudflare R2 + Cloudflare Workers)
- **部署**: Docker + Kubernetes + Ingress-Nginx

### 1.2 快速启动

#### 前端启动
```bash
cd Interview
npm install
npm run dev
```

#### 后端启动
```bash
cd ServiceNode
npm install
npm start
```

### 1.3 目录结构
```
interview/
├── Interview/          # 前端项目
├── ServiceNode/        # 后端项目
├── docker-compose.yml  # Docker Compose 配置
├── Instructions.md     # 详细部署文档
└── AI_DEPLOYMENT_GUIDE.md  # AI 自动部署指南
```



## 2. 数据库操作

### 2.1 初始化数据库

#### 2.1.1 开发环境初始化

```bash
# 1. 进入后端目录
cd ServiceNode

# 2. 安装依赖
npm install

# 3. 配置环境变量（如果.env文件不存在）
cp .env.example .env  # 根据实际情况调整
# 编辑.env文件，配置数据库连接URL
# 格式：DATABASE_URL="mysql://用户名:密码@主机:端口/数据库名?sslmode=disable"

# 4. 初始化数据库并应用迁移（推荐）
npx prisma migrate dev --name init

# 或使用db push快速初始化
npx prisma db push

# 5. 生成Prisma Client（如果步骤4未自动生成）
npx prisma generate
```

#### 2.1.2 生产环境初始化

```bash
# 1. 进入后端目录
cd ServiceNode

# 2. 安装依赖
npm install

# 3. 配置环境变量
# 确保.env文件已正确配置

# 4. 生成Prisma Client
npx prisma generate

# 5. 应用数据库迁移
npx prisma migrate deploy
```

### 2.2 更新数据库结构

#### 2.2.1 开发环境更新

```bash
# 1. 修改prisma/schema.prisma文件，更新数据库模型

# 2. 验证Schema
npm run db validate

# 3. 创建并应用迁移
npx prisma migrate dev --name <migration-name>

# 或使用db push快速更新
npx prisma db push

# 4. 生成Prisma Client
npx prisma generate
```

#### 2.2.2 生产环境更新

```bash
# 1. 在开发环境创建迁移文件
# 确保迁移文件已提交到代码仓库

# 2. 拉取最新代码
# git pull

# 3. 进入后端目录
cd ServiceNode

# 4. 安装依赖（如果有更新）
npm install

# 5. 生成Prisma Client
npx prisma generate

# 6. 应用数据库迁移
npx prisma migrate deploy
```

### 2.3 Docker部署数据库

#### 2.3.1 使用Docker Compose部署

1. **配置docker-compose.yml**：

确保docker-compose.yml文件中包含MySQL服务配置：

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: interview-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: interview
      MYSQL_ALLOW_EMPTY_PASSWORD: "no"
    volumes:
      - mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - app-network

  backend:
    build: ./ServiceNode
    container_name: interview-backend
    restart: always
    environment:
      - DATABASE_URL=mysql://root:root123@mysql:3306/interview?sslmode=disable
    depends_on:
      - mysql
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mysql-data:
    driver: local
```

2. **启动服务**：

```bash
# 启动所有服务（包括MySQL）
docker-compose up -d
```

3. **初始化数据库**：

```bash
# 进入后端容器
docker exec -it interview-backend bash

# 应用数据库迁移
npx prisma migrate deploy
```

#### 2.3.2 连接Docker中的MySQL

**从宿主机连接**：

```bash
# 使用MySQL客户端连接
sudo mysql -h localhost -P 3306 -u root -proot123 interview

# 或使用Prisma Studio查看数据
cd ServiceNode
npx prisma studio
```

**从其他容器连接**：

```bash
# 使用Docker网络连接
# 例如从前端容器连接

docker exec -it interview-frontend bash

# 连接MySQL数据库
mysql -h mysql -P 3306 -u root -proot123 interview
```

### 2.4 数据库操作命令行工具

```bash
# 查看所有可用命令
npm run db

# 生成Prisma Client
npm run db generate

# 创建并应用迁移
npm run db migrate <migration-name>

# 仅创建迁移文件
npm run db migrate-create <migration-name>

# 应用所有未应用的迁移
npm run db migrate-apply

# 重置数据库
npm run db reset

# 打开Prisma Studio
npm run db studio

# 验证Schema
npm run db validate

# 查看数据库状态
npm run db status
```

### 2.5 常见数据库操作问题

#### 2.5.1 数据库连接失败

**症状**：`Error: connect ECONNREFUSED`

**解决方法**：
1. 确保MySQL服务正在运行
2. 检查.env文件中的数据库连接URL是否正确
3. 如果使用Docker，确保容器网络配置正确
4. 检查数据库用户权限

#### 2.5.2 迁移失败

**症状**：`P1014: The table does not exist in the current database.`

**解决方法**：
1. 检查Schema文件是否正确
2. 尝试使用`npx prisma db push`重新同步数据库
3. 或使用`npx prisma migrate reset`重置数据库（注意：会删除所有数据）

#### 2.5.3 Prisma Client生成失败

**症状**：`Generator "@prisma/client" failed: /bin/sh: @prisma/client: No such file or directory`

**解决方法**：
1. 确保依赖已正确安装：`npm install`
2. 尝试重新安装Prisma依赖：`npm install prisma@latest @prisma/client@latest`
3. 检查node_modules目录是否存在

## 3. 部署生产环境

### 3.1 环境要求

- Docker：[安装指南](https://docs.docker.com/get-docker/)
- Docker Compose：通常随 Docker 一起安装
- Git：用于拉取代码

### 3.2 部署流程

#### 3.2.1 拉取代码

```bash
git clone <your-github-repo-url>
cd <repo-directory>
```

#### 3.2.2 配置选择

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

#### 3.2.3 启动服务

**一键启动所有服务**：

```bash
docker-compose up -d
```

**启动指定服务**：

```bash
docker-compose up -d <service-name>
# 例如：docker-compose up -d backend
```

#### 3.2.4 验证服务

服务启动后，验证是否正常运行：

```bash
# 查看服务状态
docker-compose ps

# 验证前端是否正常
curl -I http://localhost

# 验证后端 API 是否正常
curl http://localhost/api/questions
```

### 3.3 访问方式

- **前端应用**：通过浏览器访问 `http://localhost`
- **后端 API**：
  - 通过 Nginx 代理：`http://localhost/api/`
  - 直接访问：`http://localhost:3000`

### 3.4 服务管理

#### 3.4.1 查看服务日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看单个服务日志
docker-compose logs -f <service-name>
# 例如：docker-compose logs -f backend
```

#### 3.4.2 停止服务

```bash
# 停止所有服务，但保留容器
docker-compose stop

# 停止并移除所有容器、网络和卷
docker-compose down
```

#### 3.4.3 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启单个服务
docker-compose restart <service-name>
```

#### 3.4.4 重新构建服务

```bash
# 构建并启动所有服务
docker-compose up --build -d

# 构建并启动单个服务
docker-compose up --build -d <service-name>
```

### 3.5 数据库初始化（旧版）

**注意**：本方法仅适用于未使用 Prisma ORM 的旧版部署。使用 Prisma 时，请参考 "2. 数据库操作" 章节。

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

### 3.6 常见问题处理

#### 3.6.1 端口冲突

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

#### 3.6.2 数据库连接失败

**症状**：后端日志显示 `Error: connect ECONNREFUSED`

**解决方法**：

1. 确保 MySQL 服务正在运行
2. 检查数据库配置是否正确：
   - 用户名和密码
   - 数据库名称
   - 端口号
3. 如果使用现有 MySQL，确保防火墙允许连接

#### 3.6.3 前端路由无法访问

**症状**：直接访问 `http://localhost/insert` 显示 404 错误

**解决方法**：

1. 确保前端容器使用了正确的 Nginx 配置
2. 检查 `Interview/nginx.conf` 文件是否包含 `try_files $uri $uri/ /index.html;`
3. 重新构建前端容器：
   ```bash
   docker-compose up --build -d frontend
   ```

#### 3.6.4 服务启动后无法访问

**解决方法**：

1. 检查服务状态：`docker-compose ps`
2. 查看服务日志：`docker-compose logs -f <service-name>`
3. 检查防火墙设置，确保端口已开放

### 3.7 开发环境部署

如果需要热更新功能，可配置开发环境：

#### 3.7.1 前端开发环境

```bash
cd Interview
npm install
npm run dev
```

#### 3.7.2 后端开发环境

```bash
cd ServiceNode
npm install
npx nodemon index.js
```

### 3.8 生产环境优化建议

1. **配置 HTTPS**：使用 Let's Encrypt 或其他证书颁发机构获取 SSL 证书
2. **使用持久化存储**：为音频文件和数据库数据配置持久化存储
3. **监控服务**：添加 Prometheus + Grafana 监控
4. **日志管理**：使用 ELK Stack 或 Loki 管理日志
5. **自动部署**：配置 CI/CD 流水线，实现自动构建和部署

### 3.9 升级指南

#### 3.9.1 拉取最新代码

```bash
git pull
```

#### 3.9.2 重新构建服务

```bash
docker-compose up --build -d
```

#### 3.9.3 数据库迁移（旧版）

**注意**：本方法仅适用于未使用 Prisma ORM 的旧版部署。使用 Prisma 时，请参考 "2. 数据库操作" 章节。

如果数据库结构有变化，执行：

```bash
# 进入后端容器
docker exec -it interview-backend-1 bash

# 执行数据库迁移脚本
node migration.js
```
