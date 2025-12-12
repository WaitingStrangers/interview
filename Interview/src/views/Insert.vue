<template>
    <div>
      <div class="mb-[50px]">
        <div>新增题目</div>
        <div class="flex gap-5">
            <div>题目: <el-input v-model="question" style="width: 240px" placeholder="请输入题目" /></div>
            <div>答案:<el-input v-model="answer" style="width: 240px" placeholder="请输入答案" /></div>
            <div>类型:
                <el-select v-model="typeDatas" placeholder="选择类型" style="width: 240px">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
            </div>
            <div><el-button type="primary" @click="insertData()">添加</el-button></div>
        </div>
      </div>
      <!-- 批量添加 -->
    <div>
      <div class="mb-3 flex gap-3 items-center">
        <span>批量添加</span>
        <el-button size="small" type="success" @click="addRow">加一行</el-button>
        <el-button size="small" type="primary" @click="batchInsert">批量添加</el-button>
      </div>

      <!-- 批量输入表格 -->
      <el-table :data="batchList" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="题目">
          <template #default="{ row }">
            <el-input v-model="row.question" placeholder="题目" />
          </template>
        </el-table-column>
        <el-table-column label="答案">
          <template #default="{ row }">
            <el-input v-model="row.answer" placeholder="答案" />
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template #default="{ row }">
            <el-select v-model="row.typeData" placeholder="选择类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue"
import { ElMessage } from 'element-plus'
import axios from "axios";

const options = [{
    value: '0',
    label: '自我介绍',
  },
  {
    value: '1',
    label: '简历面试',
  },
  {
    value: '2',
    label: '面试提问',
  },
  {
    value: '3',
    label: 'vue面试题',
  },
  {
    value: '4',
    label: '前端热门面试',
  },{
    value: '5',
    label: '全部面试题',
  }]

const question = ref();
const answer = ref();
const typeDatas = ref();

const questionData = ref({
  question :"",
  answer :"",
  type :"",
});

class questionDataClass  {
  question :string
  answer :string
  type :string
};

const insertData = async ()=>{
  if(answer.value && question.value && typeDatas.value){
    console.log("新增数据");
    const data:questionDataClass = {
      question:question.value,
      answer:answer.value,
      type:typeDatas.value,
    }
    const success =  await insertAllData(data);
    if(success){
      ElMessage({
        message: '面试题新增成功',
        type: 'success',
      })
    }
  }else{
    console.log("有空数据");
    ElMessage({
      message: '数据有空',
      type: 'warning',
    })
  }
}

const insertAllData = async (data:questionDataClass): Promise<boolean> =>{
  const returnData = await axios.post(`http://localhost:3000/api/insertQuestionData`, {
      question : data.question,
      answer : data.answer,
      typeData :data.type
    });
    if(returnData.status === 200){
      question.value = "";
      answer.value = "";
      console.log(returnData);
      console.log(returnData.data);
      const Id = returnData.data.data;
      // 直接用 JSON
      axios.post(`http://localhost:3000/api/text-to-audio`, {
        text: data.question,
        fileName: Id+".mp3",
      })
      .then(res =>{
        return true;
      })
      .catch(error =>{
        ElMessage.error('添加失败:'+ error)
      });
      
    }else{
      ElMessage.error('添加失败:'+ returnData)
    }
}

/* ---------------- 批量添加 ---------------- */
const batchList = ref<{ question: string; answer: string; typeData: string }[]>(
  []
);
const selectedRows = ref<any[]>([]);

const addRow = () => {
  batchList.value.push({ question: "", answer: "", typeData: "" });
};

// el-table 的 selection-change 事件
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows;
};

const batchInsert = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage({ message: "请至少选择一行", type: "warning" });
    return;
  }

  try {
    console.log(selectedRows.value,selectedRows.value[0]);
    selectedRows.value.forEach(item => {
      console.log(item.question);
      const data:questionDataClass = {
        question:item.question,
        answer:item.answer,
        type:item.typeData,
      }
      console.log(data);
      
      const success = insertAllData(data);
    });
    

    batchList.value = []; // 清空表格
  } catch (err) {
    ElMessage.error("请求出错:" + err);
  }
};

</script>
