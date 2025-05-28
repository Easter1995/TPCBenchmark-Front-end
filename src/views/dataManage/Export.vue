<script lang="ts" setup>
import { ITableInfo } from '@/typings/data';
import { ElEmpty, ElLoading, ElNotification } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { exportTable, getExportableTables } from '@/api/datamanage';

const tables = ref<Array<any>>([])
const isLoading = ref(true)
const fullscreenLoading = ref(false)
const dialogVisible = ref(false)

const exportParam = reactive({
    tableName: '',
    exportPath: ''
})

onMounted(() => tableInfoInit())

const tableInfoInit = async () => {
    isLoading.value = true
    const { data } = await getExportableTables()
    tables.value = data.data.map(item => ({ name: item }))
    isLoading.value = false
}

const handleExport = async (tableName: string) => {
    exportParam.exportPath = ''
    exportParam.tableName = tableName
    dialogVisible.value = true
}

const cancelExport = () => {
    dialogVisible.value = false
}

const submitExport = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: '导出中',
    })
    const { data } = await exportTable(exportParam.tableName, exportParam.exportPath)
    loading.close()
    if (data) {
        ElNotification.success({
            message: `导出成功, 文件${exportParam.tableName}.csv被保存在${exportParam.exportPath}`
        })
    } else {
        ElNotification.error({
            message: '导出出错'
        })
    }
    dialogVisible.value = false
}

</script>

<template>
    <div class="container">
        <el-dialog title="导出表" v-model="dialogVisible">
            <div>
                <el-input style="margin-bottom: 20px;" v-model="exportParam.exportPath" placeholder="输入导出路径"></el-input>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button @click="cancelExport">取 消</el-button>
                <el-button type="primary" @click="submitExport">确 定</el-button>
            </div>
        </el-dialog>
        <div class="tables">
            <div v-if="tables.length === 0 && !isLoading">
                <ElEmpty description="数据库空空如也~"></ElEmpty>
            </div>
            <el-table v-else v-loading="isLoading" :data="tables" show-header style="width: 100%;"
                :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
                <el-table-column label="表名" prop="name" />
                <el-table-column header-align="center" label="操作">
                    <template #default="scoped">
                        <span class="el-button el-button--text el-button--small"
                            @click="handleExport(scoped.row.name)">导出数据</span>
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