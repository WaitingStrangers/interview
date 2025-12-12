<template>
    <div>
        <div>
            面试详情
        </div>
        <div class="mb-[50px]">
          <div class="h-[400px]">
            <el-auto-resizer>
                  <template #default="{ height, width }">
                      <el-table-v2
                      :columns="columns"
                      :data="tableListData"
                      :width="width"
                      :height="height"
                      fixed
                      />
                  </template>
              </el-auto-resizer>
          </div>
        </div>

        <div>
          <div>详情数据</div>
          <div class="h-[800px]">
            <el-auto-resizer>
                  <template #default="{ height, width }">
                      <el-table-v2
                      :columns="columns2"
                      :data="tableData"
                      :width="width"
                      :height="height"
                      fixed
                      />
                  </template>
              </el-auto-resizer>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, h} from "vue"
import { ElTooltip, ElButton } from "element-plus";
import { ElMessage } from 'element-plus'
import axios from "axios"

const tableListData = ref<dataInterviewListType[]>([]);

class dataInterviewListType {
  interviewId:string
  interviewIndex:string
  interviewTime:string
  questionCount:string
  durationSeconds:string
  durationMinutes:string
}
const tableData = ref<dataInterviewType[]>([]);

class dataInterviewType {
  questionText:string
  rawAnswer:string
  mp3Path:string
  correctAnswer:string
  refinedAnswer:string
}

onMounted(async ()=>{
  //调用接口获取问题列表
  const res = await (await axios.get("http://localhost:3000/api/InterviewList")).data;
  console.log(res.data);
  
  tableListData.value = res.data.map(item => ({...item,durationMinutes:  Math.round(Number(item.durationSeconds) / 60)}));
  // console.log(res.data, tableListData.value);
})


const handleEdit = async (rowData) =>{
  console.log(rowData);
  const returnData = await axios.post(`http://localhost:3000/api/InterviewData`, {
      id : rowData.interviewId
    });
    if(returnData.status === 200){
      console.log(returnData);
      console.log(returnData.data);
      tableData.value = returnData.data.data
    }else{
      ElMessage.error('添加失败:'+ returnData)
    }
  
  tableListData.value = res.data.map(item => ({...item,durationMinutes:  Math.round(Number(item.durationSeconds) / 60)}));
}


const columns = [
    { key: 'interviewId', dataKey: 'interviewId', title: '面试ID', width: 180 },
    { key: 'interviewIndex', dataKey: 'interviewIndex', title: '面试次数', width: 80 },
    { key: 'interviewTime', dataKey: 'interviewTime', title: '面试时间', width: 200 },
    { key: 'questionCount', dataKey: 'questionCount', title: '面试题目/个', width: 200 },
    { key: 'durationMinutes', dataKey: 'durationMinutes', title: '面试用时/分钟', width: 200 },
    //{ key: 'created_at', dataKey: '', title: '评分', width: 200 },
    {
        key: 'action',
        title: '操作',
        width: 120,
        cellRenderer: ({ rowData }) => h(ElButton, {
            size: 'small',
            onClick: () => handleEdit(rowData)
        }, 
        () => "查看")
    }
]

const tooltipClass = 'custom-tooltip';

const columns2 = [{
    key: 'questionText',
    dataKey: 'questionText',
    title: '题目',
    width: 180,
    cellRenderer: ({ rowData }) =>
      h(ElTooltip, { 
        content: rowData.questionText, 
        placement: 'top', 
        effect: 'dark', 
        popperClass: tooltipClass 
      }, {
        default: () =>
          h('span', {
            style: {
              display: 'inline-block',
              maxWidth: '160px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }
          }, rowData.questionText)
      })
  },{
    key: 'rawAnswer',
    dataKey: 'rawAnswer',
    title: '回答文本',
    width: 280,
    cellRenderer: ({ rowData }) =>
      h(ElTooltip, { 
        content: rowData.rawAnswer, 
        placement: 'top', 
        effect: 'dark', 
        popperClass: tooltipClass 
      }, {
        default: () =>
          h('span', {
            style: {
              display: 'inline-block',
              maxWidth: '260px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }
          }, rowData.rawAnswer)
      })
  },{
    key: 'mp3Path',
    dataKey: 'mp3Path',
    title: '音频',
    width: 200,
    cellRenderer: ({ rowData }) =>
      h('audio', { controls: true, src: rowData.mp3Path })
  },{
    key: 'correctAnswer',
    dataKey: 'correctAnswer',
    title: '正确答案',
    width: 400,
    cellRenderer: ({ rowData }) =>
      h(ElTooltip, { 
        content: rowData.correctAnswer, 
        placement: 'top', 
        effect: 'dark', 
        popperClass: tooltipClass 
      }, {
        default: () =>
          h('span', {
            style: {
              display: 'inline-block',
              maxWidth: '380px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }
          }, rowData.correctAnswer)
      })
  },{
    key: 'refinedAnswer',
    dataKey: 'refinedAnswer',
    title: '优化后的答案',
    width: 200,
    cellRenderer: ({ rowData }) =>
      h(ElTooltip, { 
        content: rowData.refinedAnswer, 
        placement: 'top', 
        effect: 'dark', 
        popperClass: tooltipClass 
      }, {
        default: () =>
          h('span', {
            style: {
              display: 'inline-block',
              maxWidth: '180px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }
          }, rowData.refinedAnswer)
      })
  },{
    key: 'action',
    title: '操作',
    width: 120,
    cellRenderer: ({ rowData }) =>
      h(ElButton, { size: 'small', onClick: () => handleEdit(rowData) }, () => "修改")
  }];
</script>
