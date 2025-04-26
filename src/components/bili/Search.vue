<template>
  <div class="search-fab-wrapper">
    <el-button type="primary" 
      @click="openDialog" 
      v-if="!dialogVisible" 
      :icon="Search"
      circle 
      plain
      class="search-fab"
    />
  </div>
  <el-dialog
      v-model="dialogVisible"
      fullscreen
      top="40vh"
      width="70%"
      draggable
    >
    <Indexed/>
  </el-dialog>
</template>

<script setup>
import Indexed from '@/components/bili/Indexed.vue';
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue'

const dialogVisible = ref(false);

const openDialog = () => {
  dialogVisible.value = true;
};
</script>

<style scoped>
.search-fab-wrapper {
  position: fixed;
  left: 10px;
  bottom: 50px;
  z-index: 9999;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 鼠标移入区域更宽松 */
  padding: 10px;
}
.search-fab {
  transform: translateX(-25px);
  /* opacity: 0.6; */
  transition: transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.3s cubic-bezier(.4,0,.2,1);
}
.search-fab-wrapper:hover .search-fab {
  transform: translateX(0);
  opacity: 1;
}
</style>