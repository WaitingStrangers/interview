# Prisma ORM 集成文档

## 概述

本项目已成功集成 Prisma ORM，用于管理和操作数据库。Prisma 是一个现代的 Node.js ORM，提供了类型安全的数据库访问，支持多种数据库。

## 目录结构

```
ServiceNode/
├── prisma/
│   └── schema.prisma          # Prisma Schema 文件，定义数据库模型
├── src/
│   ├── routes/               # 路由层
│   ├── controllers/          # 控制器层
│   ├── services/             # 服务层
│   └── utils/                # 工具层
├── DB/                       # 数据库备份文件目录
├── db-cli.js                   # 数据库操作命令行工具
├── backup-db.js                # 数据库备份脚本
├── restore-db.js               # 数据库恢复脚本
├── package.json                # 项目依赖和脚本配置
├── .env                        # 环境变量配置（包含数据库连接信息）
└── index.js                    # 主应用入口
```

## 数据库模型

### Question 表（问题表）

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | Int | 主键，自增 |
| question | String | 问题内容 |
| answer | String | 答案内容 |
| type | Int | 问题类型：0-自我介绍, 1-简历面试，2-面试提问，3-vue面试题，4-前端热门面试，5-全部面试题 |
| created_at | DateTime | 创建时间 |
| updated_at | DateTime | 更新时间 |

### Interview 表（面试表）

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | Int | 主键，自增 |
| interview_id | String | 面试ID |
| question_id | Int | 问题ID，外键关联 Question.id |
| answer_path | String | 音频路径 |
| raw_answer | String | 用户原始回答（可选） |
| refined_answer | String | 系统优化后的答案（可选） |
| created_at | DateTime | 创建时间 |
| updated_at | DateTime | 更新时间 |

## 环境配置

### .env 文件配置

```env
# MySQL 数据库连接 URL
DATABASE_URL="mysql://root:root123@localhost:3306/interview?sslmode=disable"
```

## 命令行工具使用

### 基本命令

```bash
# 查看命令帮助
npm run db

# 生成 Prisma Client
npm run db generate

# 创建并应用数据库迁移
npm run db migrate <migration-name>

# 仅创建迁移文件，不应用
npm run db migrate-create <migration-name>

# 应用所有未应用的迁移（生产环境使用）
npm run db migrate-apply

# 重置数据库（危险操作，会删除所有数据）
npm run db reset

# 打开 Prisma Studio 查看数据库
npm run db studio

# 验证 Prisma Schema
npm run db validate

# 查看数据库状态
npm run db status
```

### 快捷脚本

```bash
# 生成 Prisma Client
npm run prisma:generate

# 创建并应用数据库迁移
npm run prisma:migrate

# 打开 Prisma Studio
npm run prisma:studio

# 验证 Prisma Schema
npm run prisma:validate
```

## 使用 Prisma 数据库操作模块

### 模块化架构

项目采用了清晰的分层架构，使用 Prisma ORM 进行数据库操作：

1. **路由层** (`src/routes/`)：处理 HTTP 请求路由
2. **控制器层** (`src/controllers/`)：处理请求逻辑，调用服务层
3. **服务层** (`src/services/`)：封装业务逻辑和数据库操作
4. **工具层** (`src/utils/`)：提供通用工具和配置

### 服务层说明

#### QuestionService

| 函数名 | 描述 |
|-------|------|
| selectQuestionList() | 查询所有问题列表 |
| insertQuestionData(question, answer, type) | 新增单个问题 |
| insertQuestionsData(questions) | 批量新增问题 |

#### InterviewService

| 函数名 | 描述 |
|-------|------|
| selectInterviewData(interviewId) | 查询某个面试的详细数据 |
| selectInterviewList() | 查询面试列表 |
| insertInterviewData(interview_id, question_id, answer_path, raw_answer, refined_answer) | 新增面试数据 |

### 数据库操作示例

```javascript
// 在服务层使用 Prisma
const prisma = require('../utils/prisma');

async function selectQuestionList() {
    try {
        const questions = await prisma.question.findMany();
        return questions;
    } catch (error) {
        console.error('查询问题列表失败:', error);
        throw error;
    }
}
```

### 路由配置

```javascript
// 在路由层配置 API 端点
const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// GET 请求：获取问题列表
router.get('/questions', questionController.getQuestions);

module.exports = router;
```

## 数据库更新流程

### 方式一：使用 db push（推荐用于开发环境和现有数据库）

1. **修改 Schema**：在 `prisma/schema.prisma` 文件中修改数据库模型
2. **验证 Schema**：运行 `npm run db validate` 确保 Schema 语法正确
3. **推送更改**：运行 `npx prisma db push` 将更改直接推送到数据库
   - 适用于现有数据库，保留现有数据
   - 自动处理字段添加、修改等操作
   - 不需要创建迁移文件
4. **生成 Client**：运行 `npm run db generate` 重新生成 Prisma Client
5. **测试功能**：确保应用功能正常

### 方式二：使用 migrate（推荐用于新项目和生产环境）

1. **修改 Schema**：在 `prisma/schema.prisma` 文件中修改数据库模型
2. **创建迁移**：运行 `npm run db migrate <migration-name>` 创建迁移文件
3. **应用迁移**：迁移文件会自动应用到数据库
4. **生成 Client**：Prisma Client 会自动重新生成
5. **测试功能**：确保应用功能正常

## 选择建议

- **现有数据库**：使用 `db push` 可以保留现有数据，适合开发和测试环境
- **新项目**：使用 `migrate` 可以生成完整的迁移历史，适合生产环境
- **简单更改**：如添加字段，使用 `db push` 更快捷
- **复杂更改**：如修改字段类型、添加约束，使用 `migrate` 更安全

## 实际操作示例：添加新字段

### 场景：在现有 Interview 表中添加 newData 字段

#### 步骤 1：修改 Schema

在 `prisma/schema.prisma` 文件中添加新字段：

```prisma
model Interview {
  // 现有字段...
  newData       String?  @map("newData")  // 新增字段：newData
  // 其他字段...
}
```

#### 步骤 2：验证 Schema

```bash
npm run db validate
```

#### 步骤 3：推送更改到数据库

```bash
npx prisma db push
```

**可能遇到的问题**：
- **错误**：`Added the required column 'updated_at' to the 'Interview' table without a default value.`
- **原因**：现有数据库中没有 `updated_at` 字段，且 Schema 中定义为必填
- **解决方法**：将 `updated_at` 字段改为可选
  ```prisma
  updated_at DateTime? @updatedAt @map("updated_at")
  ```

#### 步骤 4：生成 Prisma Client

```bash
npm run db generate
```

#### 步骤 5：在应用中使用新字段

1. **服务层**：服务层会自动包含新字段

2. **控制器层**：可以直接访问新字段

3. **API 响应**：查询时会自动返回新字段

```javascript
// 在控制器中使用
const interviewData = await interviewService.selectInterviewData(interviewId);
// interviewData 会自动包含 newData 字段
```

## 常见问题

### 1. Prisma Client 生成失败

**问题**：运行 `npm run db generate` 时失败

**解决方法**：
- 确保 `@prisma/client` 和 `prisma` 依赖已正确安装
- 检查 `.env` 文件中的数据库连接 URL 是否正确
- 尝试重新安装依赖：`npm install`
- 使用 `npx prisma generate --force` 强制生成

### 2. db push 失败

**问题**：运行 `npx prisma db push` 时失败

**解决方法**：
- 检查数据库服务是否正常运行
- 确保数据库连接 URL 正确
- 检查 Schema 中必填字段是否有默认值或设为可选
- 查看错误信息，针对性解决（如字段类型不匹配、缺少默认值等）

### 3. 连接数据库失败

**问题**：应用无法连接到数据库

**解决方法**：
- 检查数据库服务是否正常运行
- 确保 `.env` 文件中的 DATABASE_URL 配置正确
- 检查数据库用户权限
- 确保数据库端口正确（默认 MySQL 端口为 3306）

### 4. Schema 验证失败

**问题**：运行 `npm run db validate` 时失败

**解决方法**：
- 检查 Schema 文件语法是否正确
- 确保模型名称和字段名称符合要求
- 检查关联关系是否正确定义
- 查看错误信息，针对性修复

## 迁移建议

1. **测试环境**：在测试环境充分测试后再迁移到生产环境
2. **备份数据**：迁移前备份原有数据库数据
3. **逐步迁移**：可以先在部分功能中使用 Prisma，逐步替换原有代码
4. **监控日志**：迁移后监控应用日志，确保没有异常

## 升级 Prisma

```bash
# 升级 Prisma
npm install prisma@latest @prisma/client@latest

# 重新生成 Client
npx prisma generate
```

## 文档资源

- [Prisma 官方文档](https://www.prisma.io/docs/)
- [Prisma Schema 参考](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference/)
- [Prisma CLI 命令](https://www.prisma.io/docs/reference/api-reference/command-reference/)
