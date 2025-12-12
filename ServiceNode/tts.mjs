import fs from 'fs';
import path from 'path';
import { EdgeTTS } from 'edge-tts-universal';
import multer from "multer";
import { fileURLToPath } from "url";

// 在 ESM 下恢复 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 默认配置
const TTS_CONFIG = {
  voice: 'zh-CN-YunjianNeural', 
  rate: '-5%',                  
  volume: '+10%',               
  style: 'angry',               
  outputDir: 'audio/Question',  
};

// 确保目录存在
if (!fs.existsSync(TTS_CONFIG.outputDir)) {
  fs.mkdirSync(TTS_CONFIG.outputDir, { recursive: true });
}

/**
 * 将文字转换为 MP3 并保存到文件
 */
export async function textToSpeech(
  text,
  filename,
  voice = TTS_CONFIG.voice,
  rate = TTS_CONFIG.rate,
  volume = TTS_CONFIG.volume,
  style = TTS_CONFIG.style
) {
  try {
    const filePath = path.join(TTS_CONFIG.outputDir, filename);

    if (fs.existsSync(filePath)) return filePath;

    const tts = new EdgeTTS(text, voice, { rate, volume, style });
    const result = await tts.synthesize();
    const audioBuffer = Buffer.from(await result.audio.arrayBuffer());
    await fs.promises.writeFile(filePath, audioBuffer);

    console.log(`✅ 音频文件生成成功: ${filePath}`);
    return filePath;
  } catch (err) {
    console.error('❌ 生成音频失败:', err);
    throw err;
  }
}

/**
 * 保存上传的 MP3 文件（不再转码）
 * @param req Express 请求对象
 * @param folderName 保存目录
 * @returns 上传文件访问路径
 */
export async function saveMp3File(req, folderName = "answer") {
  return new Promise((resolve, reject) => {
    try {
      const uploadDir = path.join(__dirname, folderName);
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
          // 使用时间戳 + 随机数生成唯一文件名，保持原始后缀名
          const outputFile = `${Date.now()}-${Math.floor(Math.random() * 1e6)}${path.extname(file.originalname)}`;
          cb(null, outputFile);
        },
      });

      const upload = multer({ storage }).single("file");

      upload(req, {}, function (err) {
        if (err) return reject(err);
        if (!req.file) return reject(new Error("没有上传的文件"));

        const savedPath = `/${folderName}/${req.file.filename}`;
        resolve(savedPath);
      });

    } catch (err) {
      reject(err);
    }
  });
}
