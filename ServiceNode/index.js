const express = require("express");
const path = require('path');
const app = express();
const { textToSpeech,saveMp3File } = require("./tts.mjs");
const { selectQuestionList,insertInterviewData,selectInterviewData,selectInterviewList,insertQuestionData, insertQuestionsData } = require("./dbData");
const port = 3000;
// example.js
const db = require('./db');

// 解析 JSON 请求体
app.use(express.json());
app.use('/audio', express.static(path.join(__dirname, 'audio')));
// 静态资源目录，暴露 /answer 文件夹
app.use("/answer", express.static(path.join(__dirname, "answer")));


// 配置跨域访问
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // 允许所有域
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 处理预检请求
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// GET 请求：获取问题接口展示
app.get("/api/questions",async (req, res) => {
  const rows =await selectQuestionList();
  // 返回 JSON 给前端
  res.json({
    code: 200,
    message: '查询成功',
    data: rows
  });
});

// GET 请求：获取面试列表
app.get("/api/InterviewList",async (req, res) => {
  const rows =await selectInterviewList();
  // 返回 JSON 给前端
  res.json({
    code: 200,
    message: '查询成功',
    data: rows
  });
});

// Post 请求：获取面试详情
app.post("/api/InterviewData",async (req, res) => {
  const id = req.body.id; 
  //console.log(id);
  
  const rows =await selectInterviewData(id);
  // 返回 JSON 给前端
  res.json({
    code: 200,
    message: '查询成功',
    data: rows
  });
});

// 接口：将文字转换为 MP3 并返回文件
app.post("/api/text-to-audio", async (req, res) => {
  try {
    console.log(req.body.text,req.body.fileName);
    
    const text = req.body.text; // 前端传入的文字
    const fileName = req.body.fileName; // 前端传入的文字
    if (!text) {
      return res.status(400).json({ error: "缺少 text 参数" });
    }

    const filePath = await textToSpeech(text,fileName);

    // 返回音频文件
    res.json({
      code: 200,
      message: "success",
      data: {
        url: `http://localhost:3000/`+filePath // 返回完整URL
      },
    });
  } catch (error) {
    res.status(500).json({ error: "生成语音失败", details: error.message });
  }
});

// POST /upload-mp3 - 接收前端上传的 MP3
app.post("/api/upload-mp3", async (req, res) => {
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
});

//详情新增
app.post("/api/insertInterviewData", async (req, res) => {
  try {
    const data  = req.body; // 前端传入的文字

    console.log("接收到的数据:", data);

    // 假设前端传过来的是 interview_id, question_id, answer_path, raw_answer , refined_answer 
    const interview_id = data.interview_id;
    const question_id = data.question_id;
    const answer_path = data.answer_path;
    const raw_answer = data.raw_answer;
    const refined_answer = data.refined_answer;
    insertInterviewData(interview_id, question_id, answer_path, raw_answer , refined_answer)

    res.json({
      code: 200,
      message: "面试详情存储成功",
      data: "success",
    });

  } catch (err) {
    console.error("上传失败:", err);
    res.status(500).json({
      code: 500,
      message: "MP3 文件上传失败",
      error: err.message,
    });
  }
});

//添加单条问题
app.post("/api/insertQuestionData", async (req, res) => {
  try {
    const data  = req.body; // 前端传入的文字

    // 假设前端传过来的是 interview_id, question_id, answer_path, raw_answer , refined_answer 
    const question = data.question;
    const answer = data.answer;
    const typeData = data.typeData;
    const insertID = await insertQuestionData(question,answer,typeData)

    res.json({
      code: 200,
      message: "面试题存储成功",
      data: insertID,
    });

  } catch (err) {
    console.error("面试题上传失败:", err);
    res.status(500).json({
      code: 500,
      message: "面试题上传失败",
      error: err.message,
    });
  }
});

//批量添加问题
app.post("/api/batchInsertQuestionData", async (req, res) => {
  try {
    const rows  = req.body; // 前端传入的文字

    console.log("接收到的数据:", rows);
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: "参数错误，不能为空" });
    }

      // 如果传的是对象（单条），转成数组
    if (!Array.isArray(rows)) {
      rows = [rows];
    }

    // 过滤掉无效数据
    const validRows = rows.filter(
      (item) => item.question && item.answer && item.typeData
    );
    insertQuestionsData(validRows)

    res.json({
      code: 200,
      message: "面试详情存储成功",
      data: "success",
    });

  } catch (err) {
    console.error("上传失败:", err);
    res.status(500).json({
      code: 500,
      message: "MP3 文件上传失败",
      error: err.message,
    });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
