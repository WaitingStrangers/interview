# AI 部署指南

## 1. 项目概述

### 1.1 项目结构
```
interview/
├── Interview/          # 前端项目 (Vue3 + Element Plus)
├── ServiceNode/        # 后端项目 (Node.js + Express + Prisma)
├── DB/                 # 数据库备份文件目录
├── docker-compose.yml  # Docker Compose 配置
└── Instructions.md     # 详细部署文档
```

### 1.2 技术栈
- **前端**: Vue3 + Element Plus
- **后端**: Node.js + Express
- **数据库**: MySQL
- **ORM**: Prisma 6.x
- **容器化**: Docker + Docker Compose

## 2. 部署前准备

### 2.1 环境检查
```bash
# 检查 Docker 版本
docker --version

# 检查 Docker Compose 版本
docker-compose --version

# 检查 Git 版本
git --version
```

### 2.2 必要条件
- ✅ Docker 已安装并运行
- ✅ Docker Compose 已安装
- ✅ Git 已安装
- ✅ 至少 2GB 可用内存
- ✅ 至少 10GB 可用磁盘空间

## 3. 自动部署流程

### 3.1 克隆代码
```bash
git clone <repository-url>
cd <repository-directory>
```

### 3.2 配置环境变量
```bash
# 进入后端目录
cd ServiceNode

# 创建 .env 文件
cat > .env << EOF
# MySQL 数据库连接 URL
DATABASE_URL="mysql://root:root123@mysql:3306/interview?sslmode=disable"
EOF
```

### 3.3 启动服务
```bash
# 返回项目根目录
cd ..

# 使用 Docker Compose 启动所有服务
docker-compose up -d
```

### 3.4 初始化数据库
```bash
# 等待服务启动完成 (约 30 秒)
sleep 30

# 进入后端容器
docker exec -it interview-backend bash

# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 初始化数据库
npx prisma db push

# 检查是否有数据库备份文件
if [ -d "../DB" ] && [ "$(ls -A ../DB/interview-backup-*.sql 2>/dev/null)" ]; then
    echo "发现数据库备份文件，正在恢复数据..."
    npm run restore
else
    echo "没有发现数据库备份文件，使用空数据库"
fi

# 退出容器
exit
```

## 4. 数据库备份与恢复

### 4.1 备份数据库
```bash
# 进入后端目录
cd ServiceNode

# 执行备份命令
npm run save
# 或
npm run backup
```

### 4.2 恢复数据库
```bash
# 进入后端目录
cd ServiceNode

# 执行恢复命令
npm run restore
```

### 4.3 备份文件管理
- 备份文件存储在 `../DB/` 目录下
- 文件命名格式：`interview-backup-YYYY-MM-DDTHH-mm-ss.nnnZ.sql`
- 自动保留最近10个备份文件
- 备份文件包含完整的数据库结构和数据

## 5. 验证服务
```bash
# 检查服务状态
docker-compose ps

# 验证前端服务
curl -I http://localhost

# 验证后端 API
curl http://localhost/api/questions
```

## 6. 服务访问

### 6.1 访问地址
- **前端应用**: http://localhost
- **后端 API**: http://localhost/api/
- **Prisma Studio**: 执行 `npm run db studio` (在 ServiceNode 目录下)

### 6.2 常用端口
- **Nginx**: 80 (映射到宿主机 80 端口)
- **后端服务**: 3000 (映射到宿主机 3000 端口)
- **MySQL**: 3306 (映射到宿主机 3306 端口)

## 7. 服务管理

### 7.1 查看日志
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看单个服务日志
docker-compose logs -f <service-name>
# 例如: docker-compose logs -f backend
```

### 7.2 停止服务
```bash
# 停止所有服务
docker-compose stop

# 停止并移除所有容器、网络和卷
docker-compose down
```

### 7.3 重启服务
```bash
# 重启所有服务
docker-compose restart

# 重启单个服务
docker-compose restart <service-name>
```

### 7.4 更新服务
```bash
# 拉取最新代码
git pull

# 重新构建并启动所有服务
docker-compose up --build -d

# 初始化数据库（如果结构有变化）
docker exec -it interview-backend bash -c "npx prisma migrate deploy"
```

## 8. 数据库管理

### 8.1 数据库操作命令
```bash
# 进入后端目录
cd ServiceNode

# 查看所有数据库命令
npm run db

# 生成 Prisma Client
npm run db generate

# 验证 Schema
npm run db validate

# 打开 Prisma Studio
npm run db studio
```

### 8.2 数据库备份（手动）
```bash
# 手动备份数据库
docker exec interview-mysql mysqldump -u root -proot123 interview > interview_backup.sql

# 手动恢复数据库
docker exec -i interview-mysql mysql -u root -proot123 interview < interview_backup.sql
```

## 9. 故障排查

### 9.1 常见问题

#### 9.1.1 端口冲突
**症状**: 启动时出现 `port is already allocated` 错误
**解决方案**:
```bash
# 修改 docker-compose.yml 中的端口映射
# 例如将 Nginx 端口改为 8080
sed -i 's/80:80/8080:80/g' docker-compose.yml

# 重新启动服务
docker-compose up -d
```

#### 9.1.2 数据库连接失败
**症状**: 后端日志显示 `Error: connect ECONNREFUSED`
**解决方案**:
```bash
# 检查 MySQL 服务状态
docker-compose ps mysql

# 查看 MySQL 日志
docker-compose logs mysql

# 重启 MySQL 服务
docker-compose restart mysql
```

#### 9.1.3 前端页面无法访问
**症状**: 浏览器显示 404 或连接超时
**解决方案**:
```bash
# 检查 Nginx 服务状态
docker-compose ps nginx

# 查看 Nginx 日志
docker-compose logs nginx

# 检查前端容器状态
docker-compose ps frontend
```

## 10. 开发环境部署

### 10.1 前端开发环境
```bash
cd Interview
npm install
npm run dev
```

### 10.2 后端开发环境
```bash
cd ServiceNode
npm install
npx nodemon index.js
```

### 10.3 数据库开发环境
```bash
cd ServiceNode

# 初始化数据库
npx prisma db push

# 启动 Prisma Studio
npx prisma studio
```

## 11. 生产环境优化

### 11.1 配置 HTTPS
```bash
# 1. 获取 SSL 证书（例如使用 Let's Encrypt）
# 2. 修改 docker-compose.yml，添加 HTTPS 配置
# 3. 修改 Nginx 配置，启用 HTTPS
```

### 11.2 配置持久化存储
```bash
# 确保 docker-compose.yml 中配置了持久化卷
# 例如：
# volumes:
#   - ./interview_data:/app/data
```

### 11.3 配置监控
```bash
# 可以添加 Prometheus + Grafana 监控
# 或使用 Docker 自带的监控功能
docker stats
```

## 12. AI 执行建议

### 12.1 执行顺序
1. 克隆代码 → 2. 配置环境变量 → 3. 启动服务 → 4. 初始化数据库 → 5. 验证服务

### 12.2 条件判断
- ✅ 如果 `docker --version` 失败 → 安装 Docker
- ✅ 如果 `docker-compose --version` 失败 → 安装 Docker Compose
- ✅ 如果 `git --version` 失败 → 安装 Git
- ✅ 如果 `docker-compose ps` 显示服务未运行 → 检查日志并修复
- ✅ 如果 API 调用返回 500 → 检查后端日志和数据库连接

### 12.3 安全建议
- ❌ 不要在生产环境中使用默认密码
- ❌ 不要将 .env 文件提交到代码仓库
- ✅ 定期备份数据库
- ✅ 配置防火墙规则，限制访问
- ✅ 使用 HTTPS 加密传输

# 部署完成

✅ 服务已成功部署！
✅ 前端访问地址: http://localhost
✅ 后端 API 地址: http://localhost/api/
✅ 数据库已初始化完成

## 后续维护

1. **定期更新代码**: `git pull && docker-compose up --build -d`
2. **定期备份数据库**: 使用 `npm run save` 命令
3. **监控服务状态**: 定期检查服务日志
4. **更新依赖**: 定期运行 `npm update` 并重新构建镜像
