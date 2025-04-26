<template>
  <div class="setting-fab-wrapper">
    <el-popover
      placement="bottom"
      :width="250"
      trigger="click"
    >
      <Storage/>
      <!-- <Search/> -->
      <template #reference>
        <el-button 
            class="setting-fab"
            :icon="Setting"
            plain
            type="primary"
            circle>
        </el-button>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Storage from '@/components/bili/Storage.vue';
import { Setting } from '@element-plus/icons-vue';
</script>

<style scoped>
.setting-fab-wrapper {
  position: fixed;
  left: 10px;
  bottom: 10px;
  z-index: 9999;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 鼠标移入区域更宽松 */
  padding: 10px;
}
.setting-fab {
  transform: translateX(-25px);
  /* opacity: 0.6; */
  transition: transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.3s cubic-bezier(.4,0,.2,1);
}
.setting-fab-wrapper:hover .setting-fab {
  transform: translateX(0);
  opacity: 1;
}
</style>