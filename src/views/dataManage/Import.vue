<script lang="ts" setup>
import { IDataImport, ITableInfo } from '@/typings/data';
import { ElEmpty, ElNotification } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import TableAddForm from './components/TableAddForm.vue';
import { getTables, importFile } from '@/api/datamanage';
import axios from 'axios';

const isAddingTable = ref(false)
const tables = ref<Array<ITableInfo>>([])
const isLoading = ref(true)
const form = reactive<IDataImport>({
    tableName: '',
    file: null,
})
const uploadPercentage = ref(0)
const uploadController = ref<AbortController | null>(null);

onMounted(() => tableInfoInit())

const tableInfoInit = async () => {
    isLoading.value = true
    const response = await getTables()
    const { data } = response.data
    tables.value = data
    isLoading.value = false
}
const onAddTableClick = () => {
    isAddingTable.value = true
}
const onCancelAddTableClick = async () => {
    isAddingTable.value = false
    await tableInfoInit()
}
const onFileChange = async (event: Event, row: ITableInfo) => {
    form.tableName = row.tablename
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        form.file = input.files[0];
    } else {
        form.file = null;
    }
}
const onFileUploadStart = async () => {
    if (!form.file) {
        ElNotification.error({
            message: '请先选择文件'
        })
        return;
    }
    if (uploadController.value) {
        uploadController.value.abort();
        uploadController.value = null;
    }
    const controller = new AbortController()
    uploadController.value = controller
    try {
        const response = await importFile(form.tableName, form.file, (percent: any) => {
            uploadPercentage.value = Math.round(percent * 9 / 10)
        }, uploadController.value.signal)
        uploadPercentage.value = 100
        console.log(response)
    } catch (err) {
        if (axios.isCancel(err)) {
            ElNotification.success({
                message: '取消成功'
            })
        }
    } finally {
        uploadController.value = null
    }
    
}
const onFileUploadCancel = () => {
    if (uploadController.value) {
        uploadController.value.abort()
        uploadController.value = null
    }
    uploadPercentage.value = 0
    form.tableName = ''
    form.file = null
}

</script>

<template>
    <div class="container">
        <div v-if="!isAddingTable" class="tables">
            <div v-if="tables.length === 0 && !isLoading">
                <ElEmpty description="数据库空空如也~"></ElEmpty>
            </div>
            <el-table v-else v-loading="isLoading" :data="tables" show-header style="width: 100%;"
                :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
                <el-table-column label="表名" prop="tablename" />
                <el-table-column header-align="center" label="操作">
                    <template #default="scoped">
                        <label v-if="form.file === null || form.tableName !== scoped.row.tablename" class="upload-btn">
                            <span class="el-button el-button--text el-button--small">上传文件</span>
                            <input type="file" style="display: none;" accept="*.csv,*.txt" @change="onFileChange($event, scoped.row)" />
                        </label>
                        <div class="file-upload" v-else>
                            <el-progress :percentage="uploadPercentage" :text-inside="true" :stroke-width="17"></el-progress>
                            <span class="el-button el-button--text el-button--small" @click="onFileUploadStart">开始</span>
                            <span class="el-button el-button--text el-button--small" @click="onFileUploadCancel">取消</span>
                        </div>
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