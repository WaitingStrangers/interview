const { textToSpeech, saveMp3File } = require('../../tts.mjs');

/**
 * 将文字转换为 MP3 并返回文件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.textToAudio = async (req, res) => {
    try {
        console.log(req.body.text, req.body.fileName);
        
        const text = req.body.text; // 前端传入的文字
        const fileName = req.body.fileName; // 前端传入的文件名
        if (!text) {
            return res.status(400).json({ error: "缺少 text 参数" });
        }

        const filePath = await textToSpeech(text, fileName);

        // 返回音频文件
        res.json({
            code: 200,
            message: "success",
            data: {
                url: `http://localhost:3000/` + filePath // 返回完整URL
            },
        });
    } catch (error) {
        console.error('生成语音失败:', error);
        res.status(500).json({ 
            error: "生成语音失败", 
            details: error.message 
        });
    }
};

/**
 * 接收前端上传的 MP3 文件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.uploadMp3 = async (req, res) => {
    try {
        const savedPath = await saveMp3File(req, "answer");
        const fullUrl = `${req.protocol}://${req.get("host")}${savedPath}`;
        res.json({
            code: 200,
            message: "MP3 文件上传成功",
            data: fullUrl,
        });
    } catch (err) {
        console.error("上传失败:", err);
        res.status(500).json({
            code: 500,
            message: "MP3 文件上传失败",
            error: err.message,
        });
    }
};
