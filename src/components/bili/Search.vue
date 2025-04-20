<template>
    <el-button type="primary" 
    @click="openDialog" 
    v-if="!dialogVisible" 
    style="position:fixed;left:20px;bottom:20px;z-index:9999;">
    搜索
    </el-button>
  <el-dialog
      v-model="dialogVisible"
      fullscreen
      top="40vh"
      width="70%"
      draggable
    >
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <!-- <el-tab-pane label="Storage" name="Storage">
          <Storage v-if="activeTab==='Storage'" />
        </el-tab-pane> -->
        <el-tab-pane label="Indexed" name="Indexed">
          <Indexed v-if="activeTab==='Indexed'" />
        </el-tab-pane>
        <el-tab-pane label="Mongo" name="Mongo">
          <Mongo v-if="activeTab==='Mongo'" />
        </el-tab-pane>

      </el-tabs>
    </el-dialog>
</template>

<script setup>
import Indexed from '@/components/bili/Indexed.vue';
import Mongo from '@/components/bili/Mongo.vue';
import { ref } from 'vue';

const dialogVisible = ref(false);
const activeTab = ref('Indexed');

const openDialog = () => {
  dialogVisible.value = true;
};
</script>