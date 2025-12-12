import { createRouter, createWebHistory } from 'vue-router'
import choose from "../views/choose.vue"
import index from "../views/Index.vue"
import insert from "../views/Insert.vue"
import interviewDetails from "../views/interviewDetails.vue"
import interview from "../views/Interview.vue"
import auto from "../views/auto.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path:"/",
    component: index
  },{
    path:"/choose",
    component: choose
  },{
    path:"/insert",
    component: insert
  },{
    path:"/interview",
    component: interview
  },{
    path:"/interviewDetails",
    component: interviewDetails
  },{
    path:"/auto",
    component: auto
  }],
})

export default router
