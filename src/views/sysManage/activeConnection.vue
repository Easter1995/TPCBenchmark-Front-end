<script setup lang="ts">
import { getConnections } from '@/api/systemmange';
import { IConnectionsRes } from '@/typings/system';
import { onMounted, ref } from 'vue';

const form = ref<Array<IConnectionsRes>>([])
const loading = ref(false)

const dataInit = async () => {
    loading.value = true
    const { data } = await getConnections()
    form.value = data.data.filter(item => item.db !== null)
    loading.value = false
}

onMounted(() => {
    dataInit()
})

</script>

<template>
    <div class="title">数据库连接</div>
    <div class="main">
        <el-table :data="form" v-loading="loading" show-overflow-tooltip>
            <el-table-column prop="id" fixed label="id"></el-table-column>
            <el-table-column prop="db" fixed label="db"></el-table-column>
            <el-table-column prop="user" label="user"></el-table-column>
            <el-table-column prop="host" label="host"></el-table-column>
            <el-table-column prop="command" label="command"></el-table-column>
            <el-table-column prop="time" label="time"></el-table-column>
            <el-table-column prop="state" label="state"></el-table-column>
            <el-table-column prop="info" label="info" width="240"></el-table-column>
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