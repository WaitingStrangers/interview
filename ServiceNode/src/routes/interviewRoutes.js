const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

// GET 请求：获取面试列表
router.get('/InterviewList', interviewController.getInterviewList);

// POST 请求：获取面试详情
router.post('/InterviewData', interviewController.getInterviewData);

// POST 请求：新增面试数据
router.post('/insertInterviewData', interviewController.insertInterview);

module.exports = router;
