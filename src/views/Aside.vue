<script setup lang="ts">
import {
    PieChart,
    Service,
    DataAnalysis,
    Menu as IconMenu,
    User,
    Setting,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

</script>

<template>
    <div class="nav-container" style="height: 100%;">
        <div class="title">电商数据管理系统</div>
        <el-menu router @open="handleOpen" @close="handleClose" style="border: none; flex-grow: 1">
            <el-sub-menu index="1">
                <template #title>
                    <el-icon>
                        <setting />
                    </el-icon>
                    <span>系统管理</span>
                </template>
            </el-sub-menu>
            <el-sub-menu index="2">
                <template #title>
                    <el-icon>
                        <User />
                    </el-icon>
                    <span>用户管理</span>
                </template>
            </el-sub-menu>
            <el-sub-menu index="3">
                <template #title>
                    <el-icon>
                        <PieChart />
                    </el-icon>
                    <span>数据管理</span>
                </template>
            </el-sub-menu>
            <el-sub-menu index="4">
                <template #title>
                    <el-icon>
                        <Service />
                    </el-icon>
                    <span>业务查询</span>
                </template>
            </el-sub-menu>
            <el-sub-menu index="5">
                <template #title>
                    <el-icon>
                        <DataAnalysis />
                    </el-icon>
                    <span>业务分析</span>
                </template>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<style lang="scss" scoped>
.nav-container {
    display: flex;
    flex-direction: column;
}

.title {
    text-align: center;
    font-size: 130%;
    padding: 20px;
    background-color: #fff;
}
</style>