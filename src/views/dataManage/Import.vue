<script lang="ts" setup>
import { ITableInfo } from '@/typings/data';
import { ElEmpty } from 'element-plus';
import { onMounted, ref } from 'vue';
import TableAddForm from './components/TableAddForm.vue';
import { getTables } from '@/api/datamanage';

const isAddingTable = ref(false)
const tables = ref<Array<ITableInfo>>([])
const isLoading = ref(true)

onMounted(() => tableInfoInit())

const tableInfoInit = async () => {
    isLoading.value = true
    const response = await getTables()
    const { data } = response.data
    tables.value = data
}
const onAddTableClick = () => {
    isAddingTable.value = true
}
const onCancelAddTableClick = () => {
    isAddingTable.value = false
}

</script>

<template>
    <div class="container">
        <div v-if="!isAddingTable" class="tables">
            <div v-if="tables.length === 0">
                <ElEmpty description="数据库空空如也~"></ElEmpty>
            </div>
            <el-table v-else :data="tables" show-header style="width: 100%;"
                :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
                <el-table-column label="表名" prop="tablename" />
                <el-table-column label="最近更新" prop="lastupdate" />
                <el-table-column header-align="center" label="操作">
                    <template #default>
                        <label class="upload-btn">
                            <span class="el-button el-button--text el-button--small">上传文件</span>
                            <input type="file" style="display: none;" accept="*.csv,*.txt" @change="" />
                        </label>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="onAddTableClick" type="primary" size="large">新建表格</el-button>
        </div>
        <TableAddForm v-if="isAddingTable" @cancel="onCancelAddTableClick"></TableAddForm>
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