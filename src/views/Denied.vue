<script lang="ts" setup>
import router from '@/router';
import { ElEmpty } from 'element-plus'

const onBack = () => {
    router.go(-1)
}

</script>

<template>
    <section class="sectionbox">
        <div class="pic">
            <el-empty description="无权限"></el-empty>
        </div>
        <div class="back-btn">
            <el-button size="large" type="info" @click="onBack" plain>返回</el-button>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.sectionbox {
    background-image: linear-gradient(to left, #BDBBBE 0%, #9D9EA3 100%), radial-gradient(88% 271%, rgba(255, 255, 255, 0.25) 0%, rgba(254, 254, 254, 0.25) 1%, rgba(0, 0, 0, 0.25) 100%), radial-gradient(50% 100%, rgba(255, 255, 255, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%);
    background-blend-mode: normal, lighten, soft-light;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}
</style>