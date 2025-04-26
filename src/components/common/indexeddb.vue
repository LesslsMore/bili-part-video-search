<template>
  <div class="storage-row upload-row">
    <el-upload
      multiple
      :auto-upload="false"
      accept=".json"
      :on-change="import_db"
      :show-file-list="false"
    >
      <el-button 
          :icon="Upload" 
          style="width: 70px;"
          type="primary"
          >
            db</el-button>
    </el-upload>
    <el-button :icon="Download" 
    type="primary" 
    plain
    style="width: 70px;"
    @click="handleExportDb">db</el-button>
    <el-select 
      v-model="selectedDb"
      placeholder="选择数据库名称" 
      style="width: 70px;"
      popper-append-to-body
      popper-class="monkey-el-select-popper"
    >
      <el-option v-for="db in dbNames" :key="db" :label="db" :value="db" />
    </el-select>
  </div>
</template>

<script setup>
import {Delete, Edit, Search, Refresh, Share, Upload, Download, Plus} from '@element-plus/icons-vue'

import { ref, onMounted } from "vue"
import {export_db, import_db} from "@/utils/db/db.js";
import Dexie from 'dexie'

let dbNames = ref([])
let selectedDb = ref("")

const dbWhiteList = ["bili", "json"] // 这里填写你的白名单数据库名称

onMounted(async () => {
  
  let databases = await Dexie.getDatabaseNames()
  console.log(databases)
  dbNames.value = databases.filter(db => dbWhiteList.includes(db))
  if (dbNames.value.length > 0) selectedDb.value = dbNames.value[0];
})

function handleExportDb() {
  if (!selectedDb.value) {
    ElMessage.error('请选择数据库名称');
    return;
  }
  export_db(null, selectedDb.value);
}
</script>

<style scoped>
</style>