const Interview = require('../models/Interview');
const Question = require('../models/Question');

/**
 * 查询某个面试的详细数据
 * @param {string} interviewId - 面试ID
 */
async function selectInterviewData(interviewId) {
    try {
        const interviewData = await Interview.findAll({
            where: {
                interview_id: interviewId
            },
            include: [{
                model: Question,
                required: true
            }],
            orderBy: {
                created_at: 'asc'
            }
        });
        
        // 转换数据格式以匹配原有接口
        return interviewData.map(item => ({
            questionText: item.Question.question,
            rawAnswer: item.raw_answer,
            mp3Path: item.answer_path,
            correctAnswer: item.Question.answer,
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
        // 使用Sequelize的group和aggregate功能
        const interviewList = await Interview.findAll({
            attributes: [
                'interview_id',
                [Interview.sequelize.fn('MIN', Interview.sequelize.col('created_at')), 'start_time'],
                [Interview.sequelize.fn('MAX', Interview.sequelize.col('created_at')), 'end_time'],
                [Interview.sequelize.fn('COUNT', Interview.sequelize.col('interview_id')), 'question_count']
            ],
            group: ['interview_id'],
            order: [[Interview.sequelize.fn('MIN', Interview.sequelize.col('created_at')), 'asc']]
        });
        
        // 转换数据格式以匹配原有接口
        return interviewList.map((item, index) => {
            const startTime = new Date(item.dataValues.start_time);
            const endTime = new Date(item.dataValues.end_time);
            const durationSeconds = Math.floor((endTime - startTime) / 1000);
            
            return {
                interviewId: item.dataValues.interview_id,
                interviewIndex: index + 1,
                interviewTime: startTime,
                questionCount: parseInt(item.dataValues.question_count),
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
        const result = await Interview.create({
            interview_id,
            question_id,
            answer_path,
            raw_answer,
            refined_answer
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
