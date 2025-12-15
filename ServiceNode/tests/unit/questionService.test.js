// 导入服务和模型
const questionService = require('../../src/services/questionService');
const Question = require('../../src/models/Question');

// 模拟Sequelize模型
jest.mock('../../src/models/Question', () => ({
    findAll: jest.fn(),
    create: jest.fn(),
    bulkCreate: jest.fn()
}));

describe('Question Service', () => {
    beforeEach(() => {
        // 清除所有模拟调用
        jest.clearAllMocks();
    });

    describe('selectQuestionList', () => {
        it('should return a list of questions', async () => {
            // 模拟数据
            const mockQuestions = [
                {
                    id: 1,
                    question: '测试问题1',
                    answer: '测试答案1',
                    type: 0,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    id: 2,
                    question: '测试问题2',
                    answer: '测试答案2',
                    type: 1,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ];

            // 设置模拟返回值
            Question.findAll.mockResolvedValue(mockQuestions);

            // 调用服务方法
            const result = await questionService.selectQuestionList();

            // 验证结果
            expect(result).toEqual(mockQuestions);
            expect(Question.findAll).toHaveBeenCalledTimes(1);
        });

        it('should handle errors when fetching questions', async () => {
            // 设置模拟抛出错误
            const mockError = new Error('数据库查询失败');
            Question.findAll.mockRejectedValue(mockError);

            // 验证是否抛出错误
            await expect(questionService.selectQuestionList()).rejects.toThrow(mockError);
            expect(Question.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('insertQuestionData', () => {
        it('should create a new question and return its id', async () => {
            // 测试数据
            const question = '新测试问题';
            const answer = '新测试答案';
            const type = 2;
            const mockResult = { id: 3 };

            // 设置模拟返回值
            Question.create.mockResolvedValue(mockResult);

            // 调用服务方法
            const result = await questionService.insertQuestionData(question, answer, type);

            // 验证结果
            expect(result).toBe(mockResult.id);
            expect(Question.create).toHaveBeenCalledTimes(1);
            expect(Question.create).toHaveBeenCalledWith({
                question,
                answer,
                type
            });
        });

        it('should handle errors when creating a question', async () => {
            // 测试数据
            const question = '新测试问题';
            const answer = '新测试答案';
            const type = 2;
            const mockError = new Error('创建问题失败');

            // 设置模拟抛出错误
            Question.create.mockRejectedValue(mockError);

            // 验证是否抛出错误
            await expect(questionService.insertQuestionData(question, answer, type)).rejects.toThrow(mockError);
            expect(Question.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('insertQuestionsData', () => {
        it('should create multiple questions and return the count', async () => {
            // 测试数据
            const mockQuestions = [
                { question: '批量问题1', answer: '批量答案1', typeData: 0 },
                { question: '批量问题2', answer: '批量答案2', typeData: 1 }
            ];
            const mockResult = mockQuestions.map((item, index) => ({ id: index + 3 }));

            // 设置模拟返回值
            Question.bulkCreate.mockResolvedValue(mockResult);

            // 调用服务方法
            const result = await questionService.insertQuestionsData(mockQuestions);

            // 验证结果
            expect(result).toBe(mockResult.length);
            expect(Question.bulkCreate).toHaveBeenCalledTimes(1);
            expect(Question.bulkCreate).toHaveBeenCalledWith(
                mockQuestions.map(item => ({
                    question: item.question,
                    answer: item.answer,
                    type: item.typeData
                }))
            );
        });

        it('should handle errors when creating multiple questions', async () => {
            // 测试数据
            const mockQuestions = [
                { question: '批量问题1', answer: '批量答案1', typeData: 0 }
            ];
            const mockError = new Error('批量创建问题失败');

            // 设置模拟抛出错误
            Question.bulkCreate.mockRejectedValue(mockError);

            // 验证是否抛出错误
            await expect(questionService.insertQuestionsData(mockQuestions)).rejects.toThrow(mockError);
            expect(Question.bulkCreate).toHaveBeenCalledTimes(1);
        });
    });
});
