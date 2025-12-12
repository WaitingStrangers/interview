<template>
  <div>
    <!-- 开始录音按钮 -->
    <button @click="startRecording" :disabled="isRecording">开始录音</button>

    <!-- 停止录音按钮 -->
    <button @click="stopRecording" :disabled="!isRecording">停止录音</button>

    <!-- 播放录音的播放器 -->
    <audio v-if="audioUrl" :src="audioUrl" controls></audio>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from 'axios';

const isRecording = ref(false); // 是否正在录音
const audioUrl = ref("");       // 录音生成的音频URL（给audio标签播放）

let mediaRecorder;              // MediaRecorder实例
let audioChunks = [];           // 临时存储录音的音频分块

/**
 * 开始录音
 */
const startRecording = async () => {
  try {
    // 1. 请求麦克风权限，并返回音频流
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 2. 创建录音器（指定流和可选的MIME类型）
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm" // 大多数浏览器支持webm/opus
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
        console.log(audioUrl.value);
      // 如果需要上传给后端，可以用FormData包装
       var formData = new FormData();
        formData.append("file",audioBlob);
        formData.append("filename", "问题1答案.mp3");
        axios.post("http://localhost:3000/upload-audio", formData, {
            }).then(res => {
                console.log("生成成功", res.data.data);
                mp3Path.value = res.data.data;
            }).catch(err => {
                console.error("生成失败", err);
            });
    };

    // 5. 开始录音
    audioChunks = [];       // 清空之前的数据
    mediaRecorder.start();  // 开始采集数据
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
    mediaRecorder.stop();    // 停止录音
    isRecording.value = false;
  }
};
</script>
