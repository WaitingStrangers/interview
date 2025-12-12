const express = require('express');
const router = express.Router();
const ttsController = require('../controllers/ttsController');

// POST 请求：将文字转换为 MP3 并返回文件
router.post('/text-to-audio', ttsController.textToAudio);

// POST 请求：接收前端上传的 MP3
router.post('/upload-mp3', ttsController.uploadMp3);

module.exports = router;
