const express = require('express');
const router = express.Router();

// 导入各个模块的路由
const questionRoutes = require('./questionRoutes');
const interviewRoutes = require('./interviewRoutes');
const ttsRoutes = require('./ttsRoutes');

// 注册各个模块的路由
router.use(questionRoutes);
router.use(interviewRoutes);
router.use(ttsRoutes);

module.exports = router;
