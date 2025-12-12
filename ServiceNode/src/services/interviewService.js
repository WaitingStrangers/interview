const prisma = require('../utils/prisma');

/**
 * 查询某个面试的详细数据
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
 * 新增面试数据
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
        
        return result.id;
    } catch (error) {
        console.error('插入面试数据失败:', error);
        throw error;
    }
}

module.exports = {
    selectInterviewData,
    selectInterviewList,
    insertInterviewData
};
