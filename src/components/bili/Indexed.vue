<template>
  <el-form ref="searchObjRef" style="max-width: 600px" :model="searchObj" status-icon :rules="rules"
           label-width="auto" class="demo-ruleForm">
    <el-form-item label="分段视频名称">
      <el-input v-model="searchObj.name"/>
    </el-form-item>
    <el-form-item>
      <!-- <el-button type="primary" @click="submitForm(searchObjRef)">Submit</el-button>
      <el-button @click="resetForm(searchObjRef)">Reset</el-button> -->
      <el-button type="primary" :icon="Search" size="mini" @click="fetchData()">搜索</el-button>
      <el-button :icon="Refresh" size="mini" @click="resetData">重置</el-button>
    </el-form-item>
  </el-form>


  <el-table :data="tableData" border style="width: 100%" @sort-change="sort_data">
    <el-table-column
        sortable="custom"
        v-for="([head, width], index) in Object.entries(keys)"
        :key="index"
        :prop="head"
        :label="head"
        :width="width * 10"
    />

    <!--    <el-table-column sortable prop="name" label="name" width="100"-->
    <!--                     :filters="[-->
    <!--        { text: 'Home', value: 'Home' },-->
    <!--        { text: 'Office', value: 'Office' },-->
    <!--      ]"-->
    <!--                     :filter-method="filterTag"-->
    <!--                     filter-placement="bottom-end"-->
    <!--    />-->
  </el-table>

  <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4"
                 :page-sizes="[10, 20, 50, 100, 200, 500, 1000]" :small="small" :disabled="disabled"
                 :background="background"
                 layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"/>

</template>

<script setup>

import {reactive, ref} from 'vue'
import {Delete, Edit, Search, Refresh, Share, Upload, Download} from '@element-plus/icons-vue'
import {db_bili} from "@/utils/db/db.js";

const searchObjRef = ref()

let total = ref()

let tableData = ref([])

let currentPage4 = ref(1)
let pageSize4 = ref(10)

let searchObj = ref({
  name: '',
  mid: '',
  bvid: '',
  part: '',
})

let keys = ref(
    {
      'name': 10,
      'title.text': 45,
      'part.text': 45,
      'page': 8,
      'view': 8,
      'duration': 10,

      'mid': 10,
      'bvid': 12,
      'cid': 11,
      'url': 38,
    }
)

function sort_data({prop, order}) {
  console.log(prop, order)
}

async function fetchData() {
  tableData.value = await filter(searchObj.value.name, currentPage4.value, pageSize4.value)
}

async function filter(word, page, limit) {
  console.log(word)
  const collection = db_bili.cids
      .orderBy('view')
      .filter(item => {
        try {
          return item.part.text.includes(word)
        } catch (e) {
          console.log(e)
          console.log(item.part)
        }
      });
  // console.log(collection)

  const res = await collection.toArray();

  total.value = res.length

  const result = await collection.reverse().offset((page - 1) * limit).limit(limit).toArray();

  console.log(result)
  return result
}


// const submitForm = () => {
//     fetchData()
// }

const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val) => {
  console.log(`${val} items per page`)

  fetchData()
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)

  fetchData()
}

</script>
