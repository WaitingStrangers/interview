<template>
  <div class="common-layout h-screen">
    <el-container class="h-full">
      <!-- 顶部 -->
      <el-header class="bg-blue-500 text-white flex items-center h-16">
        面试机器人
      </el-header>

      <!-- 主体区域 -->
      <el-container class="h-[calc(100%-4rem)]"> <!-- 扣掉 header 高度 -->
        <!-- 左侧导航 -->
        <el-aside width="200px" class="bg-gray-100">
          <input type="button" 
          class="w-full h-10 bg-cyan-600 text-white text-center mb-[1px] 
              flex items-center justify-center cursor-pointer 
              hover:bg-cyan-700 active:bg-cyan-800 transition-colors duration-200
              text-lg font-medium"
          :value="item.name"
           @click="activeFun(item.path)" v-for="item in routerTitle" :key="item.id">
        </el-aside>

        <!-- 右侧内容 -->
        <el-main class="p-4 bg-white">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();
const routerTitle = [{
  id : 1,
  name: "选择题目",
  path: "/choose"
},{
  id : 2,
  name: "模拟面试",
  path: "/interview"
},{
  id : 4,
  name: "面试详情",
  path: "/interviewDetails"
},{
  id : 3,
  name: "新增题目",
  path: "/insert"
},{
  id : 4,
  name: "语音测试",
  path: "/auto"
}]

const activeFun = (path) =>{
router.push(path);
}



</script>

<style scoped>

</style>
