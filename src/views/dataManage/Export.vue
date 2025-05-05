<script lang="ts" setup>
import { ITableInfo } from '@/typings/data';
import { ElEmpty } from 'element-plus';
import { onMounted, ref } from 'vue';
import TableAddForm from './components/TableAddForm.vue';
import { getTables } from '@/api/datamanage';

const tables = ref<Array<ITableInfo>>([])
const isLoading = ref(true)

onMounted(() => tableInfoInit())

const tableInfoInit = async () => {
    isLoading.value = true
    const response = await getTables()
    const { data } = response.data
    tables.value = data
    isLoading.value = false
}

</script>

<template>
    <div class="container">
        <div class="tables">
            <div v-if="tables.length === 0 && !isLoading">
                <ElEmpty description="数据库空空如也~"></ElEmpty>
            </div>
            <el-table v-else v-loading="isLoading" :data="tables" show-header style="width: 100%;"
                :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
                <el-table-column label="表名" prop="tablename" />
                <el-table-column label="最近更新" prop="lastupdate" />
                <el-table-column header-align="center" label="操作">
                    <template #default>
                        <span class="el-button el-button--text el-button--small" @click="">导出数据</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    .tables {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        gap: 40px;
    }
}
</style>