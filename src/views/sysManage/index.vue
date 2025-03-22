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
    <ElCard>
        <button @click="onClick1">点击</button>
        <button @click="onClick2">点击</button>
    </ElCard>
</template>

<style scoped lang="scss"></style>