<template>
        <el-upload
      multiple
      :auto-upload="false"
      accept=".json"
      :on-change="import_db"
      :show-file-list="false"
  >
    <el-button :icon="Upload" type="primary">import_db</el-button>
  </el-upload>
  <el-button :icon="Download" type="primary" @click="handleExportDb">export_db</el-button>

  <el-select 
  v-model="selectedDb"
  placeholder="选择数据库名称" 
  style="width: 100px; z-index: 10000;"
  popper-append-to-body
  popper-class="monkey-el-select-popper"
  >
    <el-option v-for="db in dbNames" :key="db" :label="db" :value="db" />
  </el-select>
  </template>

<script setup>

import { ref, onMounted } from "vue"
import {export_db, import_db} from "@/utils/db/db.js";
import Dexie from 'dexie'

let dbNames = ref([])
let selectedDb = ref('')

onMounted(async () => {
  
  let databases = await Dexie.getDatabaseNames()
  console.log(databases)

  dbNames.value = databases
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
.monkey-el-select-popper {
  z-index: 10001 !important;
}
</style>