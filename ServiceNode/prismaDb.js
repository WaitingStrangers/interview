// 引入Prisma Client
const { PrismaClient } = require('@prisma/client');

// 创建Prisma Client实例
const prisma = new PrismaClient();

/**
 * 查询所有问题列表数据
 */
async function selectQuestionList() {
    try {
        const questions = await prisma.question.findMany();
        return questions;
    } catch (error) {
        console.error('查询问题列表失败:', error);
        throw error;
    }
}

/**
 * 查询某个面试问题数据
 * @param {string} interviewId - 面试ID
 */
async function selectInterviewData(interviewId) {
    try {
        const interviewData = await prisma.interview.findMany({
            where: {
                interview_id: interviewId
            },
            include: {
                question: true
            },
            orderBy: {
                created_at: 'asc'
            }
        });
        
        // 转换数据格式以匹配原有接口
        return interviewData.map(item => ({
            questionText: item.question.question,
            rawAnswer: item.raw_answer,
            mp3Path: item.answer_path,
            correctAnswer: item.question.answer,
            refinedAnswer: item.refined_answer
        }));
    } catch (error) {
        console.error('查询面试数据失败:', error);
        throw error;
    }
}

/**
 * 查询面试列表
 */
async function selectInterviewList() {
    try {
        // 使用Prisma的groupBy和aggregate功能
        const interviewList = await prisma.interview.groupBy({
            by: ['interview_id'],
            _min: {
                created_at: true
            },
            _max: {
                created_at: true
            },
            _count: {
                interview_id: true
            },
            orderBy: {
                _min: {
                    created_at: 'asc'
                }
            }
        });
        
        // 转换数据格式以匹配原有接口
        return interviewList.map((item, index) => {
            const startTime = item._min.created_at;
            const endTime = item._max.created_at;
            const durationSeconds = Math.floor((endTime - startTime) / 1000);
            
            return {
                interviewId: item.interview_id,
                interviewIndex: index + 1,
                interviewTime: startTime,
                questionCount: item._count.interview_id,
                durationSeconds: durationSeconds
            };
        });
    } catch (error) {
        console.error('查询面试列表失败:', error);
        throw error;
    }
}

/**
 * 新增面试场景以及面试题和答案
 * @param {string} interview_id - 面试ID
 * @param {string} question_id - 问题ID
 * @param {string} answer_path - 音频路径
 * @param {string} raw_answer - 用户原始回答（可选）
 * @param {string} refined_answer - 系统优化后的答案（可选）
 */
async function insertInterviewData(interview_id, question_id, answer_path, raw_answer, refined_answer) {
    try {
        const result = await prisma.interview.create({
            data: {
                interview_id,
                question_id,
                answer_path,
                raw_answer,
                refined_answer
            }
        });
        
        console.log('✅ 插入面试数据成功, ID:', result.id);
        return result.id;
    } catch (error) {
        console.error('❌ 插入面试数据失败:', error);
        throw error;
    }
}

/**
 * 新增面试题
 * @param {string} question - 问题
 * @param {string} answer - 答案
 * @param {number} type - 类型
 */
async function insertQuestionData(question, answer, type) {
    try {
        const result = await prisma.question.create({
            data: {
                question,
                answer,
                type
            }
        });
        
        console.log('✅ 插入问题数据成功, ID:', result.id);
        return result.id;
    } catch (error) {
        console.error('❌ 插入问题数据失败:', error);
        throw error;
    }
}

/**
 * 批量新增面试题
 * @param {Array} questions - 问题数组，每个元素包含question、answer、typeData字段
 */
async function insertQuestionsData(questions) {
    try {
        const result = await prisma.question.createMany({
            data: questions.map(item => ({
                question: item.question,
                answer: item.answer,
                type: item.typeData
            }))
        });
        
        console.log('✅ 批量插入问题数据成功, 数量:', result.count);
        return result.count;
    } catch (error) {
        console.error('❌ 批量插入问题数据失败:', error);
        throw error;
    }
}

// 关闭Prisma Client连接
async function closePrisma() {
    await prisma.$disconnect();
}

// CommonJS 导出
module.exports = {
    selectQuestionList,
    selectInterviewData,
    selectInterviewList,
    insertInterviewData,
    insertQuestionData,
    insertQuestionsData,
    closePrisma
};
