<template>
    <div style="margin: 10px 0;">
    <el-tag>mids</el-tag>
    <el-input v-model="midsInput" placeholder="请输入 mids 数组，如 [1,2,3]"/>
  </div>
  <indexeddb/>
  <el-upload
      multiple
      :auto-upload="false"
      accept=".json"
      :on-change="import_json_bvids"
      :show-file-list="false"
  >
    <el-button :icon="Upload" type="primary">上传 bvids json</el-button>
  </el-upload>

  <el-upload
      multiple
      :auto-upload="false"
      accept=".json"
      :on-change="import_json_pages"
      :show-file-list="false"
  >
    <el-button :icon="Upload" type="primary">上传 pages json</el-button>
  </el-upload>

  <!-- <el-button @click="pages2vlist">pages2vlist</el-button> -->

  <el-button @click="vlist2bvids">vlist2bvids</el-button>
  
  <el-button @click="bvids2cids">bvids2cids</el-button>



  <el-upload
      :auto-upload="false"
      accept=".xlsx, .xls"
      :on-change="import_excel"
      :show-file-list="false"
  >
    <el-button :icon="Upload" type="primary">import_excel</el-button>
  </el-upload>
  <el-button :icon="Download" @click="export_excel()">export_excel</el-button>





</template>

<script setup>
import {Delete, Edit, Search, Refresh, Share, Upload, Download} from '@element-plus/icons-vue'
import indexeddb from "@/components/common/indexeddb.vue"
import {export_excel, import_excel} from "@/utils/db/excel.js";
import {bvids2cids, import_json_bvids, import_json_pages, pages2vlist, vlist2bvids} from "@/utils/db/db_bili.js";
import { ref, watch } from 'vue'
import { mids as defaultMids } from '@/utils/db/db.js'


const midsInput = ref(JSON.stringify(defaultMids))

// 全局暴露 midsInput，便于 interceptor.js 访问
watch(midsInput, (val) => {
  try {
    window.monkeyMids = JSON.parse(val)
  } catch (e) {
    window.monkeyMids = []
  }
}, {immediate: true})


</script>
