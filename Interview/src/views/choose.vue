<template>
    <div>
        <div>{{title}}</div>
        <div>
            <div style="height: 400px">
                <el-auto-resizer>
                  <template #default="{ height, width }">
                      <el-table-v2
                      :columns="columns"
                      :data="tableData"
                      :width="width"
                      :height="height"
                      fixed
                      />
                  </template>
                </el-auto-resizer>
            </div>
        </div>
        <div class="mt-[50px]">
            <div class="mb-[10px]">
                面试题获取（根据需要选择每个类型面试题数量,最多7个）
            </div>
            <div>
              <div class="grid grid-cols-3 gap-5">
                <div>
                  <span class="mr-[40px]">简历面试</span>  <el-input-number v-model="questionCounts[1]" :min="1" :max="7"/>
                </div>
                <div>
                  <span class="mr-[40px]">面试提问</span> <el-input-number v-model="questionCounts[2]" :min="1" :max="7"/>
                </div>
                <div>
                  <span class="mr-[30px]">vue面试题</span> <el-input-number v-model="questionCounts[3]" :min="1" :max="7"/>
                </div>
                <div>
                  <span class="mr-[10px]">前端热门面试</span> <el-input-number v-model="questionCounts[4]" :min="1" :max="7"/>
                </div>
                <div>
                  <span class="mr-[20px]">全部面试题</span> <el-input-number v-model="questionCounts[5]" :min="1" :max="7"/>
                </div>
                <div>
                  <span class="mr-[30px]">自我介绍</span> <el-input-number v-model="questionCounts[0]" :min="1" :max="7"/>
                </div>
              </div>
            </div>
            <div class="flex justify-center mt-[20px]">
              <el-button @click="goInterviewData">获取面试题</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, h, onMounted, reactive} from "vue"
import {ElButton, inputTagEmits} from "element-plus"
import axios from "axios";
import { useRouter } from "vue-router";
import {useInterviewDataStore} from "../stores/counter"
import { ElMessage } from 'element-plus'

const title = ref("面试题选择")
const columns = [
    { key: 'id', dataKey: 'id', title: '问题ID', width: 80 },
    { key: 'question', dataKey: 'question', title: '问题', width: 280 },
    { key: 'created_at', dataKey: 'created_at', title: '创建时间', width: 200 },
    {
      key: 'type',
      dataKey: 'type',
      title: '状态',
      width: 100,
      cellRenderer: ({ rowData }) => {
        // 这里根据不同的状态返回不同显示
        const statusMap = {
          0: { text: '自我介绍', color: 'gray' },
          1: { text: '简历面试', color: 'gray' },
          2: { text: '面试提问', color: 'blue' },
          3: { text: 'vue面试题', color: 'green' },
          4: { text: '前端热门面试', color: 'red' },
          5: { text: '全部面试题', color: 'red' }
        }
        const item = statusMap[rowData.type] || { text: '未知', color: 'black' }
        return h('span', { style: { color: item.color } }, item.text)
      }
    },
    {
        key: 'action',
        title: '操作',
        width: 120,
        cellRenderer: ({ rowData }) => h(ElButton, {
            size: 'small',
            onClick: () => handleEdit(rowData)
        }, 
        () => "编辑")
    }
]

const tableData = ref([]);
const interviewData = ref([]);
const router = useRouter();
const stores = useInterviewDataStore();

onMounted(async ()=>{
  //调用接口获取问题列表
  const res = await (await axios.get("http://localhost:3000/api/questions")).data;
  console.log(res.data);
  tableData.value = res.data;
});

const handleEdit = (row) => {
    console.log('编辑行数据:', row)
}

//进行面试
const goInterview = ()=>{
  
  
}
//简历面试 5个，面试提问 3个，vue面试题 3个，前端热门面试 3个，全部面试题 5个，自我介绍 1个
const questionCounts = ref({
  0: 1, // 0 => 自我介绍
  1: 5, // 1 => 简历面试
  2: 5, // 2 => 面试提问
  3: 5, // 3 => vue面试题
  4: 5, // 4 => 前端热门面试
  5: 7  // 5 => 全部面试题
});

const goInterviewData = () =>{
  interviewData.value = [];
  Object.entries(questionCounts.value).forEach(([key, value]) => {
    console.log("当前类型:", key, "需要数量:", value);

    // 过滤出当前类型的数据
    const currentList = tableData.value.filter(item => item.type === Number(key));

    if (currentList.length === 0) return; // 如果没有数据，直接跳过

    // 抽取随机数据（这里返回的是对象，而不是 id）
    const randomItems = getRandomIdsById(currentList, value as number);
    console.log(randomItems.length);
    
    // 批量添加到 interviewData
    interviewData.value.push(...randomItems);
  });
  console.log(interviewData.value,"获取到的值");
  stores.data.value = interviewData.value;
  //router.push({path:"/interview"});
  ElMessage({
        message: '面试题选择成功,请到面试测试页面进行测试',
        type: 'success',
  })

}

/**
 * 根据 id 随机排序并取前 n 个
 * @param data - 原始数组，每个元素必须包含 id 字段
 * @param n - 需要取的数量
 * @returns 随机抽取的 id 数组
 */
function getRandomIdsById<T extends { id: any }>(data: T[], n: number): any[] {
  if (!Array.isArray(data) || data.length === 0 || n <= 0) return [];

  // 克隆数组，避免修改原数组
  const cloned = [...data];

  // Fisher-Yates 洗牌算法随机排序
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }

  // 截取前 n 个
  return cloned.slice(0, n);
}


</script>
