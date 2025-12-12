<template>
  <div>
    <div>面试题目列表</div>
    <div>
      <button @click="getTopicList()">手动加载数据</button>
      <button @click="QuestionToSpeek()">获取一条数据</button>
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>问题</td>
            <td>答案</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(topiclists, index) in topicList" :key="index">
            <td>{{ topiclists.id }}</td>
            <td>{{ topiclists.question }}</td>
            <td>{{ topiclists.answer }}</td>
          </tr>
        </tbody>
      </table>

      <input type="text" v-model="mp3Text" placeholder="请输入需要转换的值" />
      <button @click="mp3ToText">转换音频</button>
      <audio v-if="mp3Path" :src="mp3Path" controls autoplay></audio>

      <div>
        <!-- 开始录音按钮 -->
        <button @click="startRecording" :disabled="isRecording">
          开始录音
        </button>

        <!-- 停止录音按钮 -->
        <button @click="stopRecording" :disabled="!isRecording">
          停止录音
        </button>

        <!-- 播放录音的播放器 -->
        <audio v-if="audioUrl" :src="audioUrl" controls></audio>
      </div>

      <div>
        <button @click="startRecognition()" :disabled="isRecording">
          开始录音
        </button>
        <button @click="stopRecognition()" :disabled="!isRecording">
          停止录音
        </button>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          placeholder="转换的文字..."
          >{{ seekToText }}</textarea
        >
      </div>

      <div>
        <div>问题+答案+自己的答案</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
interface Question {
  id: number;
  question: string;
  answer: string | number;
}

const topicList = ref<Question[]>([]);

//音频文字
const mp3Text = ref();
//音频路径
const mp3Path = ref();
//选择的问题
const questionId = ref<number>();

//请求问题接口
const getTopicList = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/questions");
    const result = await response.json();
    console.log(result);
    
    if (response.ok) {
      topicList.value = [result];
      console.log(topicList.value,111);
    } else {
      console.error("获取失败:", result.msg);
    }
  } catch (e) {
    console.error("请求异常:", e);
  }
};
//请求文字转音频接口
const mp3ToText = async () => {
  console.log("前端准备发送的文字:", mp3Text.value); // 调试确认
  try {
    var formData = new FormData();
    formData.append("text", mp3Text.value);
    formData.append("filename", "test3.mp3");

    axios
      .post("http://localhost:3000/text-to-audio", formData, {})
      .then((res) => {
        console.log("生成成功", res.data.data.url);
        mp3Path.value = res.data.data.url;
      })
      .catch((err) => {
        console.error("生成失败", err);
      });
  } catch (error) {
    console.error("接口调用异常：", error);
  }
};
let oldQuestions = <number[]>[];
//获取一个随机数
function getCryptoRandomItem<T>(arr: T[]): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const num = buf[0] % arr.length;
  if (oldQuestions.some((item) => item == num)) {
    if (oldQuestions.length === arr.length) {
      console.log("数组已经全部取完不在获取");
      return -1;
    }
    console.log("已经存在于数组中，从新获取");
    return getCryptoRandomItem(arr);
  } else {
    oldQuestions.push(num);
    return num;
  }
}

//随机获取一个问题ID
//把获取的ID对应的问题调用后端接口生成语言播放
const QuestionToSpeek = async () => {
  //从数据中随机抽取一个id
  const num = getCryptoRandomItem(topicList.value);
  questionId.value = num;
  if (num == -1) {
    alert("问题已经全部提问完了，还有什么问题请及时补充");
    return;
  }
  const topic = topicList.value[num];
  console.log(topic);
  //把答案转换成音频然后播放
  const questionFromData = new FormData();
  questionFromData.append("text", topic.question);
  let filename = "第" + topic.id + "问.mp3";
  questionFromData.append("filename", filename);
  await axios
    .post("http://localhost:3000/text-to-audio", questionFromData, {})
    .then((res) => {
      console.log("生成成功", res.data.data.url);
      mp3Path.value = res.data.data.url;
    })
    .catch((error) => {
      console.log("生成失败", error);
    });
};

const isRecording = ref(false); // 是否正在录音
const audioUrl = ref(""); // 录音生成的音频URL（给audio标签播放）

let mediaRecorder: any; // MediaRecorder实例
let audioChunks: any = []; // 临时存储录音的音频分块

/**
 * 开始录音
 */
const startRecording = async () => {
  try {
    // 1. 请求麦克风权限，并返回音频流
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 2. 创建录音器（指定流和可选的MIME类型）
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm", // 大多数浏览器支持webm/opus
    });

    // 3. 每当有音频数据可用时触发
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data); // 收集音频分块
      }
    };

    // 4. 当录音停止时合并音频数据
    mediaRecorder.onstop = () => {
      // 合并所有分块生成一个完整的音频文件
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

      // 生成可播放的本地URL
      audioUrl.value = URL.createObjectURL(audioBlob);

      // 如果需要上传给后端，可以用FormData包装
      const num = questionId.value;
      const questionJsonStr = JSON.stringify(topicList.value[num]);
      var formData = new FormData();
      formData.append("file", audioBlob);
      formData.append("question", questionJsonStr);
      formData.append("filename", "问题" + (num + 1) + "答案.mp3");
      axios
        .post("http://localhost:3000/answer", formData, {})
        .then((res) => {
          console.log("生成成功", res.data.data);
          mp3Path.value = res.data.data;
        })
        .catch((err) => {
          console.error("生成失败", err);
        });
    };

    // 5. 开始录音
    audioChunks = []; // 清空之前的数据
    mediaRecorder.start(); // 开始采集数据
    isRecording.value = true;
  } catch (error) {
    console.error("无法访问麦克风:", error);
  }
};

/**
 * 停止录音
 */
const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop(); // 停止录音
    isRecording.value = false;
  }
};

//前端音频转文字
const seekToText = ref();
seekToText.value = "";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("❌ 你的浏览器不支持 Web Speech API，请用 Chrome 或 Edge 打开");
}

let recognition = new SpeechRecognition();
recognition.interimResults = false; // 是否返回中间结果
recognition.continuous = true; // 是否持续识别
recognition.lang = "zh-CN"; // 识别语言：中文
recognition.onresult = (event) => {
  const lastResult = event.results[event.results.length - 1][0].transcript;
  seekToText.value += lastResult;
};

recognition.onerror = (event) => {
  console.error("识别出错:", event.error);
  isRecording.value = false;
};

recognition.onend = () => {
  console.log("识别结束");
  isRecording.value = false;
};
function startRecognition() {
  //调用音频存储
  startRecording();
  if (recognition) {
    seekToText.value = "";
    recognition.start();
    isRecording.value = true;
  }
}

function stopRecognition() {
  stopRecording();
  if (recognition) {
    recognition.stop();
    isRecording.value = false;
  }
}
</script>