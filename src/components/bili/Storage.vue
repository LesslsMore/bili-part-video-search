<template>
  <div class="storage-container">
    <div class="storage-row upload-row">
      <el-button :icon="Plus" 
              plain 
              style="width: 70px;"
      type="primary" @click="addCurrentMid">mids</el-button>
      <el-select v-model="midsArr" multiple default-first-option placeholder="请选择或输入mid" style="width:140px;">
        <el-option v-for="mid in defaultMids" :key="mid" :label="mid" :value="mid" />
      </el-select>
    </div>
    <div class="storage-row upload-row">
      <indexeddb/>
    </div>
    <div class="storage-row upload-row">
      <el-upload :auto-upload="false" accept=".xlsx, .xls" :on-change="import_excel" :show-file-list="false">
        <el-button :icon="Upload" 
        style="width: 80px;"
        type="primary">excel</el-button>
      </el-upload>
      <el-button :icon="Download" 
      plain
      type="primary"
      style="width: 80px;"
      @click="export_excel()">excel</el-button>
    </div>

    <div class="storage-row upload-row" style="display: none;">
      <el-upload multiple :auto-upload="false" accept=".json" :on-change="import_json_bvids" :show-file-list="false">
        <el-button :icon="Upload" 
                style="width: 80px;"
        type="primary">bvids</el-button>
      </el-upload>
      <el-upload multiple :auto-upload="false" accept=".json" :on-change="import_json_pages" :show-file-list="false">
        <el-button :icon="Upload" 
                style="width: 80px;"
        type="primary">pages</el-button>
      </el-upload>
    </div>

    <div class="storage-row upload-row">
      <el-button 
      style="width: 80px;"
            plain
      type="primary"
      @click="vlist2bvids">vlist2bvids</el-button>
      <el-button 
      
      style="width: 80px; margin: 0px;"
            plain
      type="primary"
      @click="bvids2cids">bvids2cids</el-button>
    </div>


  </div>
</template>

<script setup>
import {Delete, Edit, Search, Refresh, Share, Upload, Download, Plus} from '@element-plus/icons-vue'
import indexeddb from "@/components/common/indexeddb.vue"
import {export_excel, import_excel} from "@/utils/db/excel.js";
import {bvids2cids, import_json_bvids, import_json_pages, pages2vlist, vlist2bvids} from "@/utils/db/db_bili.js";
import { ref, watch } from 'vue'
import { mids as defaultMids } from '@/utils/db/db.js'

const midsInput = ref(JSON.stringify(defaultMids))
const midsArr = ref(Array.isArray(defaultMids) ? [...defaultMids] : [])

watch(midsArr, (arr) => {
  midsInput.value = JSON.stringify(arr)
}, {deep: true})

watch(midsInput, (val) => {
  try {
    midsArr.value = JSON.parse(val)
  } catch (e) {
    midsArr.value = []
  }
  try {
    window.monkeyMids = JSON.parse(val)
  } catch (e) {
    window.monkeyMids = []
  }
}, {immediate: true})

function addCurrentMid() {
  const url = window.location.href;
  const match = url.match(/space\.bilibili\.com\/(\d+)/);
  if (match) {
    let arr;
    try {
      arr = JSON.parse(midsInput.value);
      if (!Array.isArray(arr)) arr = [];
    } catch (e) {
      arr = [];
    }
    const mid = Number(match[1]);
    if (!arr.includes(mid)) {
      arr.push(mid);
      midsInput.value = JSON.stringify(arr);
    }
  } else {
    window.ElMessage && window.ElMessage.warning('未检测到mid');
  }
}
// 全局暴露 midsInput，便于 interceptor.js 访问
watch(midsInput, (val) => {
  try {
    window.monkeyMids = JSON.parse(val)
  } catch (e) {
    window.monkeyMids = []
  }
}, {immediate: true})


</script>

<style scoped>
.storage-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 240px;
}
.storage-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
}
.upload-row {
  justify-content: flex-start;
  gap: 5px;
}
</style>
