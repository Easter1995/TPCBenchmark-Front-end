<script setup lang="ts">
import router from '@/router';
import { ElCard } from 'element-plus';

const onClick1 = () => {
    router.push('/usermanage')
}

const onClick2 = () => {
    router.push('/usermanage/delete')
}
</script>

<template>
    欢迎来到电商数据管理系统~
</template>

<style scoped lang="scss"></style>