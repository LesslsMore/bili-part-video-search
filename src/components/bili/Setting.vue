<template>
    <el-popover
    placement="bottom"
    :width="220"
    trigger="click"
  >
    <Storage/>
      <!-- <Search/> -->
    <template #reference>
      <el-button class="m-2"
      style="position:fixed;left:80px;bottom:20px;z-index:9999;"
      >设置</el-button>
    </template>
  </el-popover>
</template>

<script setup>
import Indexed from '@/components/bili/Indexed.vue';
import Mongo from '@/components/bili/Mongo.vue';
import { ref } from 'vue';
import Storage from '@/components/bili/Storage.vue';
import Search from '@/components/bili/Search.vue';
const dialogVisible = ref(false);
const activeTab = ref('Indexed');

const openDialog = () => {
  dialogVisible.value = true;
};
</script>