<template>
    <div class="flex flex-col items-center ">
        <div class="flex items-center justify-center text-2xl">
            语音测试
        </div>
        <div class="w-[90%] h-[800px]">
            <div>
                开始获取一个音频  
                <button @click="startAudio" class="ml-4 px-4 py-2 bg-blue-500 text-white rounded">开始获取音频</button>
                <button @click="stopAudio" class="ml-4 px-4 py-2 bg-red-500 text-white rounded">停止获取音频</button>
            </div>
            <div>
                音频转换成文字
                <audio :src="audioUrl" controls></audio>
                <textarea name="text" id="" cols="30" rows="10" readonly :value="audioText"></textarea>
            </div>
            <div>
                获取到特殊字符停止获取音频
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, h} from "vue"
var mediaRecorder = null;
var audioUrl = ref<string>("");
var audioText = ref<string>("");

// 开始获取音频(录取一个音频以后在进行处理)
function startAudio() {
    let audioChunks: BlobPart[] = [];
    // 1. 请求麦克风权限并开始录制
    navigator.mediaDevices.getUserMedia({ audio: true }) 
        .then(stream => { 
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' }); // 或 'audio/mp3' 
            mediaRecorder.ondataavailable = event => { audioChunks.push(event.data); }; mediaRecorder.onstop = () => {
                // 2. 录制结束，生成Blob
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); 
                audioUrl.value = URL.createObjectURL(audioBlob);
            }; 
            mediaRecorder.start();
            console.log('开始录制音频');
        }).catch(error => { console.error('获取麦克风权限失败:', error); });
}
// 停止获取音频
function stopAudio() {
    console.log('停止录制音频');
    mediaRecorder.stop();
}

</script>