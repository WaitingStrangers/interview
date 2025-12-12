const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// GET 请求：获取问题列表
router.get('/questions', questionController.getQuestions);

// POST 请求：添加单条问题
router.post('/insertQuestionData', questionController.insertQuestion);

// POST 请求：批量添加问题
router.post('/batchInsertQuestionData', questionController.batchInsertQuestions);

module.exports = router;
