# Sequelize ORM 集成文档

## 概述

本项目已成功从 Prisma ORM 迁移到 Sequelize ORM，用于管理和操作数据库。Sequelize 是一个成熟的 Node.js ORM，提供了丰富的数据库操作 API，支持多种数据库。

## 目录结构

```
ServiceNode/
├── src/
│   ├── routes/               # 路由层
│   ├── controllers/          # 控制器层
│   ├── services/             # 服务层
│   ├── models/               # Sequelize 模型定义
│   └── utils/                # 工具层
│       └── sequelize.js      # Sequelize 配置文件
├── DB/                       # 数据库备份文件目录
├── db-cli.js                   # 数据库操作命令行工具（已更新为 Sequelize）
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

# 初始化 Sequelize 迁移配置
npm run db init

# 生成迁移文件
npm run db migrate:generate <migration-name>

# 运行所有未执行的迁移
npm run db migrate

# 回滚上一次迁移
npm run db migrate:undo

# 回滚所有迁移
npm run db migrate:undo:all

# 生成 Sequelize 模型
npm run db model:generate --name <model-name> --attributes <attributes>

# 重置数据库（危险操作，会删除所有数据）
npm run db reset

# 查看数据库迁移状态
npm run db status
```

## 使用 Sequelize 数据库操作模块

### 模块化架构

项目采用了清晰的分层架构，使用 Sequelize ORM 进行数据库操作：

1. **路由层** (`src/routes/`)：处理 HTTP 请求路由
2. **控制器层** (`src/controllers/`)：处理请求逻辑，调用服务层
3. **服务层** (`src/services/`)：封装业务逻辑和数据库操作
4. **模型层** (`src/models/`)：定义数据库模型和关联关系
5. **工具层** (`src/utils/`)：提供 Sequelize 配置和连接

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
// 在服务层使用 Sequelize
const Question = require('../models/Question');

async function selectQuestionList() {
    try {
        const questions = await Question.findAll();
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

### 使用 Sequelize 迁移

1. **初始化迁移**：首次使用时运行 `npm run db init` 初始化迁移配置
2. **生成模型**：使用 `npm run db model:generate` 生成模型文件，或手动创建
3. **生成迁移**：运行 `npm run db migrate:generate <migration-name>` 创建迁移文件
4. **编辑迁移**：根据需要编辑生成的迁移文件
5. **应用迁移**：运行 `npm run db migrate` 将迁移应用到数据库
6. **测试功能**：确保应用功能正常

## 实际操作示例：添加新字段

### 场景：在现有 Interview 表中添加新字段

#### 步骤 1：修改模型文件

在 `src/models/Interview.js` 文件中添加新字段：

```javascript
const Interview = sequelize.define('Interview', {
  // 现有字段...
  newField: {
    type: DataTypes.STRING,
    allowNull: true
  }
  // 其他字段...
});
```

#### 步骤 2：生成迁移文件

```bash
npm run db migrate:generate --name add-new-field-to-interview
```

#### 步骤 3：编辑迁移文件

在生成的迁移文件中添加字段定义：

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Interview', 'newField', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Interview', 'newField');
  }
};
```

#### 步骤 4：应用迁移

```bash
npm run db migrate
```

#### 步骤 5：在应用中使用新字段

```javascript
// 在控制器中使用
const interviewData = await interviewService.selectInterviewData(interviewId);
// interviewData 会包含新字段
```

## 常见问题

### 1. Sequelize 连接失败

**问题**：应用无法连接到数据库

**解决方法**：
- 检查数据库服务是否正常运行
- 确保 `.env` 文件中的 DATABASE_URL 配置正确
- 检查数据库用户权限
- 确保数据库端口正确（默认 MySQL 端口为 3306）

### 2. 迁移失败

**问题**：运行 `npm run db migrate` 时失败

**解决方法**：
- 检查迁移文件语法是否正确
- 确保数据库连接正常
- 查看错误信息，针对性解决（如字段类型不匹配、缺少默认值等）
- 尝试回滚到上一个迁移状态，修复后重新迁移

### 3. 模型关联错误

**问题**：模型之间的关联关系无法正常工作

**解决方法**：
- 检查模型定义中的关联关系是否正确
- 确保外键字段已正确定义
- 检查关联查询时的 include 选项是否正确

## 迁移建议

1. **测试环境**：在测试环境充分测试后再迁移到生产环境
2. **备份数据**：迁移前备份原有数据库数据
3. **逐步迁移**：可以先在部分功能中使用 Sequelize，逐步替换原有代码
4. **监控日志**：迁移后监控应用日志，确保没有异常
5. **保留迁移文件**：迁移文件是数据库变更的历史记录，建议妥善保存

## 升级 Sequelize

```bash
# 升级 Sequelize
npm install sequelize@latest sequelize-cli@latest
```

## 文档资源

- [Sequelize 官方文档](https://sequelize.org/docs/v6/)
- [Sequelize CLI 文档](https://sequelize.org/docs/v6/other-topics/migrations/)
- [Sequelize 模型定义](https://sequelize.org/docs/v6/core-concepts/model-basics/)
- [Sequelize 查询 API](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/)

