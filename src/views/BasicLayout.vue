<script setup lang="ts">
import { ElCard } from 'element-plus';
import Header from '@/views/Header.vue';

</script>

<template>
    <div class="common-layout">
        <el-container style="height: 100%; width: 100%;">
            <el-aside width="200px">Aside</el-aside>
            <el-container style="margin: 10px;">
                <el-header height="100px">
                    <Header></Header>
                </el-header>
                <el-main><router-view></router-view></el-main>
                <el-footer>Footer</el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<style scoped lang="scss">
.common-layout {
    height: 100%;
    width: 100%;
    background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
}
</style>