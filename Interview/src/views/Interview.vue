<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
      <div class="text-center text-lg font-medium mb-4">第 {{ title }} 次面试</div>

      <!-- 问题区域：问题文本 + 隐藏音频播放器（自动播放）-->
      <div class="mb-4">
        <div class="text-sm text-gray-600 mb-2">提问：</div>
        <div class="mb-2 flex items-center gap-4">
          <div class="flex-1 text-base text-gray-800" v-if="currentQuestion">{{ currentQuestion.question }}</div>
          <div v-else class="text-gray-400">正在准备题目...</div>
        </div>

        <!-- 隐藏的 audio 元素，用于播放问题音频 -->
        <audio ref="questionAudio" :src="currentAudioUrl" @ended="onAudioEnded" preload="auto"></audio>
      </div>

      <!-- 回答区域：实时识别显示 -->
      <div>
        <div class="text-sm text-gray-600 mb-2">回答（实时识别）：</div>
        <div class="min-h-[140px] p-3 border rounded bg-gray-50 text-gray-800 whitespace-pre-wrap">
          {{ displayText }}
        </div>
      </div>

      <!-- 进度 / 状态 -->
      <div class="mt-4 text-sm text-gray-500">
        <span>进度：{{ currentIndex + 1 }} / {{ questionsOrder.length }}</span>
        <span class="ml-4">状态：{{ statusText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * interview.vue
 * 自动播放题目音频 -> 自动录音并实时识别 -> 识别触发结束词后上报音频并插入 DB -> 进入下一题
 *
 * 主要逻辑说明：
 * - onMounted() 拉取题库（或使用你已有的 interviewData store）
 * - 生成 questionsOrder（题目播放顺序）
 * - 调用 prepareAndPlayQuestion() 顺序播放并处理每题
 * - 播放结束时自动 startCaptureAndRecognize()
 * - 识别到结束触发词（例如 "回答到此结束"）后 stop 并上传音频和插入数据库
 *
 * 请根据自己后端接口返回的数据结构（url字段）做小调整
 */

import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { useInterviewDataStore} from "../stores/counter"
import { ElMessage } from 'element-plus'

const interviewDatastore = useInterviewDataStore();

// ---------------------- 配置区 ----------------------
const BACKEND_BASE = "http://localhost:3000"; // 后端地址（改成你的）
const TRIGGER_PHRASE = "回答结束"; // 识别到这句就结束本题录音（可按需修改）
// ----------------------------------------------------

/** 页面状态 */
const title = ref("");
const interview_id = ref("");
const questionsOrder = ref<any[]>([]); // 按顺序的题目数组（每项包含 id, question, type...）
const currentIndex = ref(0);
const currentQuestion = ref<any | null>(null);
const currentAudioUrl = ref<string | null>(null); // 当前题目的音频 URL
const status = ref<"idle" | "preparing" | "playing" | "recording" | "uploading" | "done">("idle");

const statusTextMap: Record<string, string> = {
  idle: "空闲",
  preparing: "准备中",
  playing: "播放题目中",
  recording: "录音识别中",
  uploading: "上传中",
  done: "已完成",
};
const statusText = ref(statusTextMap[status.value]);

/** 识别与录音相关 */
const seekToText = ref(""); // 最终累加文本
const displayText = ref(""); // 页面显示 = seekToText + interim
let recognition: SpeechRecognition | null = null;
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: BlobPart[] = [];
const questionAudio = ref<HTMLAudioElement | null>(null);

// 当前时间，格式化为 YYYYMMDDHHmmss
function getCurrentTimeId(): string {
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const DD = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${YYYY}${MM}${DD}${HH}${mm}${ss}`;
}
// 页面挂载后执行
onMounted(async () => {
  // 1. 获取题库（这里示例从后端接口获取，也可以使用你已有的 store）
  // 假设接口 GET /api/interview-questions 返回 { data: [ { id, question, type, ... } ] }
  status.value = "preparing";
  statusText.value = statusTextMap[status.value];
  console.log(statusText.value,1111111);
  if(!interviewDatastore.data.value){
    ElMessage({
      message: '还未选择面试题,请选择面试题以后在进行模拟面试',
      type: 'warning',
    })
    return;
  }
  
  interview_id.value = getCurrentTimeId();
  try {
    // 如果你已有 interviewData store，请替换下面请求逻辑为 store 的数据
    const res = await axios.get(`${BACKEND_BASE}/api/InterviewList`); // 旧接口，按需替换
    const list = (res.data && res.data.data) ? res.data.data : [];

    // 计算本次面试标题（次数）
    title.value = (list.length || 0) + 1;

    // 示例：如果你有 interviewData（全部题目），这里使用它；否则使用获取的 list
    // 这里默认用 list 作为题库（每项必须包含 id & question 字段）
    questionsOrder.value = interviewDatastore.data.value; // 做一次拷贝
    console.log(questionsOrder.value.value);
    
    if (!questionsOrder.value.length) {
      // 空题库处理
      status.value = "done";
      statusText.value = "没有题目";
      return;
    }

    // 等 1.5 秒后开始第一题（给用户缓冲）
    await delay(1500);

    // 顺序处理每一题
    currentIndex.value = 0;
    await processNextQuestion();
  } catch (err) {
    console.error("获取题库失败:", err);
    statusText.value = "获取题库失败";
  }
});

/** 处理下一题（主要控制流程） */
async function processNextQuestion() {
 // 判断是否结束
  if (currentIndex.value >= questionsOrder.value.length) {
    status.value = "done";
    statusText.value = "面试全部完成";
    currentQuestion.value = null;
    currentAudioUrl.value = null;
    seekToText.value = "";
    displayText.value = "";
    audioChunks = [];
    return;
  }

  // 开始新题前清理上一题状态
  stopTriggered = false;
  seekToText.value = "";
  displayText.value = "";
  audioChunks = [];

  currentQuestion.value = questionsOrder.value[currentIndex.value];
  currentAudioUrl.value = null;

  status.value = "preparing";
  statusText.value = statusTextMap[status.value];

  try {
    // 1) 确保当前题目有音频，若无则请求后端生成（text-to-audio）
    currentAudioUrl.value = await ensureAudioForQuestion(currentQuestion.value);

    // 2) 播放音频（隐藏 audio 控件播放），播放结束会触发 onAudioEnded -> start record
    status.value = "playing";
    statusText.value = statusTextMap[status.value];
    await playAudio(currentAudioUrl.value);

    // NOTE: 播放结束后会自动触发 onAudioEnded -> startCaptureAndRecognize
    // 在识别完成（上传并入库）后继续下一题
  } catch (err) {
    console.error("处理题目失败:", err);
    // 如果出错，跳到下一题
    currentIndex.value++;
    await processNextQuestion();
  }
}

/** 确保题目有音频：如果 currentQuestion 已包含音频 URL 就直接返回，否则请求后端生成并返回 URL */
async function ensureAudioForQuestion(questionObj: any): Promise<string> {
  if (questionObj.audioUrl) return questionObj.audioUrl;

  const filename = `${questionObj.id || Date.now()}.mp3`;

  // 直接用 JSON
  const resp = await axios.post(`${BACKEND_BASE}/api/text-to-audio`, {
    text: questionObj.question,
    fileName: filename,
  });

  const audioUrl = resp.data?.data?.url;
  if (!audioUrl) throw new Error("后端未返回音频路径");

  return audioUrl.startsWith("http") ? audioUrl : `${BACKEND_BASE}${audioUrl}`;
}

/** 播放音频并返回 Promise（播放结束或错误后 resolve/reject） */
let isPlayingAudio = false; // 播放锁，确保一次只播放一个音频

function playAudio(url: string | null): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!url) return reject(new Error("音频 URL 缺失"));

    if (!questionAudio.value) {
      questionAudio.value = document.querySelector("audio") as HTMLAudioElement;
    }
    const audioEl = questionAudio.value as HTMLAudioElement;

    // 如果正在播放，先暂停并重置
    if (isPlayingAudio) {
      audioEl.pause();
      audioEl.src = "";
      audioEl.load();
      isPlayingAudio = false;
    }

    isPlayingAudio = true;

    audioEl.src = url;
    audioEl.autoplay = true;

    // 尝试播放（捕获浏览器阻止）
    audioEl.play().catch((err) => {
      console.warn("音频播放被阻止:", err);
    });

    // 播放结束事件
    const onEnded = () => {
      audioEl.removeEventListener("ended", onEnded);
      audioEl.removeEventListener("error", onError);
      isPlayingAudio = false;
      resolve();
    };
    audioEl.addEventListener("ended", onEnded);

    // 播放错误事件
    const onError = (e: any) => {
      audioEl.removeEventListener("ended", onEnded);
      audioEl.removeEventListener("error", onError);
      console.warn("音频播放错误:", e);
      isPlayingAudio = false;
      resolve(); // 错误也继续下一步
    };
    audioEl.addEventListener("error", onError);

    // 超时保险：防止浏览器阻止播放或卡住
    const timeout = setTimeout(() => {
      audioEl.removeEventListener("ended", onEnded);
      audioEl.removeEventListener("error", onError);
      if (isPlayingAudio) {
        isPlayingAudio = false;
        resolve();
      }
    }, 15000); // 15 秒
  });
}


/** audio ended 事件回调（当用户交互许可后也会触发） */
async function onAudioEnded() {
  // 在播放结束后自动开启录音和识别
  try {
    status.value = "recording";
    statusText.value = "";
    statusText.value = statusTextMap[status.value];
    console.log(statusText.value);

    
    await startCaptureAndRecognize();
    // 当 startCaptureAndRecognize 完成后（即本题识别并上传完成），继续下一题
    currentIndex.value++;
    await processNextQuestion();
  } catch (err) {
    console.error("录音/识别出错:", err);
    // 尝试继续下一题
    currentIndex.value++;
    await processNextQuestion();
  }
}

/* ------------------ 录音 + 识别 逻辑 ------------------ */

/** 启动 MediaRecorder 采集音频并启动 SpeechRecognition */
async function startCaptureAndRecognize(): Promise<void> {
  // 请求麦克风权限并获取流
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioChunks = [];
  mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });

  // 收集录音分片
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) audioChunks.push(e.data);
  };

// 定时触发 ondataavailable，避免长时间空闲无数据
mediaRecorder.start(2000); // 每 1 秒生成一次音频片段

  // 初始化识别（Web Speech API）
  initRecognition();

  // 识别开始
  try {
    recognition && recognition.start();
  } catch (err) {
    console.warn("recognition.start 可能被阻止:", err);
  }

  // 返回一个 Promise，直到本题识别结束并完成上传（由 stopRecording resolve）
  return new Promise((resolve, reject) => {
    // 内部会在 stopRecording 时调用 resolve
    // 我们把 resolve 挂到函数对象上以便 stopRecording 调用
    (startCaptureAndRecognize as any)._resolve = resolve;
    (startCaptureAndRecognize as any)._reject = reject;
  });
}

/** 初始化或重置 recognition，并设置事件逻辑 */
function initRecognition() {
  // 初始化对象（浏览器原生）
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    throw new Error("浏览器不支持 SpeechRecognition");
  }
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  // 如果已有 recognition 对象，先停止并清理
  if (recognition) {
    try { recognition.onresult = null; recognition.onend = null; recognition.onerror = null; recognition.stop(); } catch (e) {}
    recognition = null;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "zh-CN";

  // 用于临时拼接本次回调的中间结果
  recognition.onresult = (event: any) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const text = result[0].transcript || "";
      if (result.isFinal) {
        // 累加最终结果
        seekToText.value += text;
        // 检查是否包含触发词（最终结果里才算）
        if (text.includes(TRIGGER_PHRASE)) {
          // 当检测到结束词，停止识别与录音
          // 注意：触发词一般会包含在 final 中
          stopAfterTrigger();
          seekToText.value = "";
          displayText.value = "";
        }
      } 
      else {
        // 中间结果拼接用于实时显示（不会累加到 seekToText）
        interimTranscript += text;
        // // 有时用户可能在中间识别就说出触发词，这里也做检测（谨慎触发）
        // if (text.includes(TRIGGER_PHRASE)) {
        //   stopAfterTrigger();
        //   seekToText.value = "";
        //   displayText.value = "";
        // }
      }
    }
    displayText.value = seekToText.value + interimTranscript;
  };

  recognition.onerror = (event: any) => {
    console.warn("recognition.onerror:", event);
  };

  // recognition.onend = () => {
  //   // recognition 可能因网络或浏览器自动停止，这里不直接认为题目结束，
  //   // 只有当我们主动 stopRecording 并完成上传时才进入下一题。
  //   console.log("recognition ended");
  // };
  recognition.onend = () => {
  if (status.value === "recording" && !stopTriggered) {
    console.log("recognition 自动重启");
    try {
      recognition.start();
    } catch (err) {
      console.warn("recognition restart failed:", err);
    }
  } else {
    console.log("recognition ended（已停止或触发结束）");
  }
};
}

/** 在检测到触发词时调用：停止识别与录音并处理上传/入库 */
let stopTriggered = false; // 全局标记

// 在stopAfterTrigger函数中增强资源清理
async function stopAfterTrigger() {
  if (stopTriggered) return;
  stopTriggered = true;

  try {
    // 停止录音并清理资源
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      // 断开MediaRecorder与stream的连接
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      mediaRecorder = null;
    }
    
    // 停止并清理识别器
    if (recognition) {
      recognition.stop();
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition = null;
    }
    
    status.value = "uploading";
    statusText.value = statusTextMap[status.value];

    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    const uploadedPath = await uploadAudioBlob(audioBlob, `${currentQuestion.value.id || Date.now()}.webm`);

    const payload = {
      interview_id: interview_id.value,
      question_id: currentQuestion.value.id,
      answer_path: uploadedPath,
      raw_answer: displayText.value,
      refined_answer: ""
    };
    await axios.post(`${BACKEND_BASE}/api/insertInterviewData`, payload);

    // 清空当前题目的答案
    seekToText.value = "";
    displayText.value = "";
    audioChunks = [];

    status.value = "idle";
    statusText.value = statusTextMap[status.value];

    // resolve promise
    (startCaptureAndRecognize as any)._resolve?.();

  } catch (err) {
    console.error("上传失败:", err);
    (startCaptureAndRecognize as any)._reject?.(err);
  } finally {
    stopTriggered = false;
  }
}




/** 上传音频 Blob 到后端，返回后端存储的访问路径 */
async function uploadAudioBlob(blob: Blob, filename = "record.mp3"): Promise<string> {
  const fd = new FormData();
  // 注意：字段名 "file" 对应后端 multer 配置
  fd.append("file", blob, filename);

  const resp = await axios.post(`${BACKEND_BASE}/api/upload-mp3`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // 假设后端返回 { data: "/uploads/xxx.mp3" } 或 { data: { path: "/uploads/xxx.mp3" } }
  const data = resp.data && (resp.data.data || resp.data);
  const pathStr = data.url || data.path || data;
  return (String(pathStr).startsWith("http") ? pathStr : `${BACKEND_BASE}${pathStr}`);
}

/* ------------------ 辅助函数 ------------------ */
function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// 替换防抖函数，使用requestAnimationFrame
function optimizedUpdateText() {
  let pendingUpdate: string | null = null;
  let animationFrameId: number | null = null;
  
  return function(text: string) {
    pendingUpdate = text;
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(() => {
        if (pendingUpdate !== null) {
          displayText.value = pendingUpdate;
          pendingUpdate = null;
        }
        animationFrameId = null;
      });
    }
  };
}

const updateDisplayText = optimizedUpdateText();

</script>

<style scoped>
/* 简单美化：隐藏 audio 控件（但仍可播放） */
audio {
  display: none;
}
</style>