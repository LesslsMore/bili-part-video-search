<template>
  <div style="display: flex; justify-content: center;">


  <el-form ref="searchObjRef" style="max-width: 100%;" :model="searchObj" status-icon :rules="rules"
           label-width="auto" class="demo-ruleForm" inline>
    <el-form-item label="数据来源">
      <el-select v-model="dataSource" placeholder="请选择" style="width: 100px">
        <el-option label="index" value="index" />
        <el-option label="mongo" value="mongo" />
      </el-select>
    </el-form-item>
    <el-form-item label="分段视频名称">
      <el-input v-model="searchObj.name" @keyup.enter="fetchData"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :icon="Search" size="mini" @click="fetchData()">搜索</el-button>
      <el-button :icon="Refresh" size="mini" @click="resetData">重置</el-button>
    </el-form-item>
  </el-form>
</div>

  <el-table :data="tableData" border style="width: 100%" @sort-change="sort_data">
    <el-table-column
        sortable="custom"
        v-for="([head, width], index) in Object.entries(keys)"
        :key="index"
        :prop="head"
        :label="head"
        :width="width * 10"
    />

  </el-table>

  <div style="display: flex; justify-content: center;">
    <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4"
                   :page-sizes="[10, 20, 50, 100, 200, 500, 1000]" :small="small" :disabled="disabled"
                   :background="background"
                   layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"/>
  </div>

</template>

<script setup>

import {reactive, ref} from 'vue'
import {Delete, Edit, Search, Refresh, Share, Upload, Download} from '@element-plus/icons-vue'
import {get_cids_items as get_cids_items_index} from "@/utils/db/db.js";
import {get_cids_items as get_cids_items_mongo} from "@/api/bili.js";

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

const dataSource = ref('index')

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
  if (dataSource.value === 'mongo') {
    const res = await get_cids_items_mongo(searchObj.value.name, currentPage4.value, pageSize4.value)
    tableData.value = res.data.data
    total.value = res.data.total
  } else if (dataSource.value ==='index')  {
    let res = await get_cids_items_index(searchObj.value.name, currentPage4.value, pageSize4.value)
    tableData.value = res.data
    total.value = res.total
  }
}

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
