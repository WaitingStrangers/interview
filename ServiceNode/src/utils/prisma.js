const { PrismaClient } = require('@prisma/client');

// 创建Prisma Client实例
const prisma = new PrismaClient();

module.exports = prisma;
