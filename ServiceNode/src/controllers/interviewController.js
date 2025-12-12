const interviewService = require('../services/interviewService');

/**
 * 获取面试列表
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getInterviewList = async (req, res) => {
    try {
        const interviewList = await interviewService.selectInterviewList();
        res.json({
            code: 200,
            message: '查询成功',
            data: interviewList
        });
    } catch (error) {
        console.error('获取面试列表失败:', error);
        res.status(500).json({
            code: 500,
            message: '查询失败',
            error: error.message
        });
    }
};

/**
 * 获取面试详情
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getInterviewData = async (req, res) => {
    try {
        const { id } = req.body;
        const interviewData = await interviewService.selectInterviewData(id);
        res.json({
            code: 200,
            message: '查询成功',
            data: interviewData
        });
    } catch (error) {
        console.error('获取面试详情失败:', error);
        res.status(500).json({
            code: 500,
            message: '查询失败',
            error: error.message
        });
    }
};

/**
 * 新增面试数据
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.insertInterview = async (req, res) => {
    try {
        const data = req.body;
        console.log('接收到的数据:', data);
        
        // 假设前端传过来的是 interview_id, question_id, answer_path, raw_answer , refined_answer 
        const { interview_id, question_id, answer_path, raw_answer, refined_answer } = data;
        await interviewService.insertInterviewData(interview_id, question_id, answer_path, raw_answer, refined_answer);
        
        res.json({
            code: 200,
            message: '面试详情存储成功',
            data: 'success'
        });
    } catch (error) {
        console.error('新增面试数据失败:', error);
        res.status(500).json({
            code: 500,
            message: '面试详情存储失败',
            error: error.message
        });
    }
};
