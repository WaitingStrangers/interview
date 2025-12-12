const questionService = require('../services/questionService');

/**
 * 获取所有问题列表
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getQuestions = async (req, res) => {
    try {
        const questions = await questionService.selectQuestionList();
        res.json({
            code: 200,
            message: '查询成功',
            data: questions
        });
    } catch (error) {
        console.error('获取问题列表失败:', error);
        res.status(500).json({
            code: 500,
            message: '查询失败',
            error: error.message
        });
    }
};

/**
 * 新增单个问题
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.insertQuestion = async (req, res) => {
    try {
        const { question, answer, typeData } = req.body;
        const insertID = await questionService.insertQuestionData(question, answer, typeData);
        res.json({
            code: 200,
            message: '面试题存储成功',
            data: insertID
        });
    } catch (error) {
        console.error('新增问题失败:', error);
        res.status(500).json({
            code: 500,
            message: '面试题上传失败',
            error: error.message
        });
    }
};

/**
 * 批量新增问题
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.batchInsertQuestions = async (req, res) => {
    try {
        let rows = req.body;
        
        console.log('接收到的数据:', rows);
        
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(400).json({
                code: 400,
                message: "参数错误，不能为空"
            });
        }

        // 如果传的是对象（单条），转成数组
        if (!Array.isArray(rows)) {
            rows = [rows];
        }

        // 过滤掉无效数据
        const validRows = rows.filter(
            (item) => item.question && item.answer && item.typeData
        );
        
        const count = await questionService.insertQuestionsData(validRows);
        
        res.json({
            code: 200,
            message: '面试题批量存储成功',
            data: {
                success: true,
                insertedCount: count
            }
        });
    } catch (error) {
        console.error('批量新增问题失败:', error);
        res.status(500).json({
            code: 500,
            message: '批量新增面试题失败',
            error: error.message
        });
    }
};
