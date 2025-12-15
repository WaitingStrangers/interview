const Question = require('../models/Question');

/**
 * 查询所有问题列表
 */
async function selectQuestionList() {
    try {
        const questions = await Question.findAll();
        return questions;
    } catch (error) {
        console.error('查询问题列表失败:', error);
        throw error;
    }
}

/**
 * 新增单个问题
 * @param {string} question - 问题
 * @param {string} answer - 答案
 * @param {number} type - 类型
 */
async function insertQuestionData(question, answer, type) {
    try {
        const result = await Question.create({
            question,
            answer,
            type
        });
        
        return result.id;
    } catch (error) {
        console.error('插入问题数据失败:', error);
        throw error;
    }
}

/**
 * 批量新增问题
 * @param {Array} questions - 问题数组，每个元素包含question、answer、typeData字段
 */
async function insertQuestionsData(questions) {
    try {
        const result = await Question.bulkCreate(
            questions.map(item => ({
                question: item.question,
                answer: item.answer,
                type: item.typeData
            }))
        );
        
        return result.length;
    } catch (error) {
        console.error('批量插入问题数据失败:', error);
        throw error;
    }
}

module.exports = {
    selectQuestionList,
    insertQuestionData,
    insertQuestionsData
};
