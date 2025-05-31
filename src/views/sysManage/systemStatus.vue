<script setup lang="ts">
import { getStatus } from '@/api/systemmange';
import { IVariable } from '@/typings/system';
import { onMounted, ref } from 'vue';

const form = ref<Array<IVariable>>([])
const loading = ref(false)

const dataInit = async () => {
    loading.value = true
    const { data } = await getStatus()
    form.value = data.data
    loading.value = false
}

onMounted(() => {
    dataInit()
})

</script>

<template>
    <div class="title">数据库状态变量</div>
    <div class="main">
        <el-table :data="form" v-loading="loading">
            <el-table-column prop="Variable_name" label="Variable Name"></el-table-column>
            <el-table-column prop="Value" label="Value"></el-table-column>
        </el-table>
    </div>
</template>

<style scoped lang="scss">
.main {
    margin-top: 40px;
}

::v-deep .cell {
    text-align: center;
}
</style>