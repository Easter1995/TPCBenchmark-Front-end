<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import '@fortawesome/fontawesome-free/css/all.min.css';

const locale = zhCn
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<style lang="scss" scoped>
html,
body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    width: 100%;
    overscroll-behavior: none;
    overflow-y: overlay;
    overflow-x: hidden;
    &body.el-popup-parent--hidden {
        height: 100vh !important;
    }
    .el-drawer__body {
        --el-drawer-padding-primary: 0;
    }
}
</style>
