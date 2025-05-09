<script lang="ts" setup>
import { IDataImport, IDataImportProgress, ITableInfo } from '@/typings/data';
import { ElEmpty, ElNotification } from 'element-plus';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import TableAddForm from './components/TableAddForm.vue';
import { getImportProgress, getTables, importFile, removeImportTask } from '@/api/datamanage';
import axios from 'axios';

interface taskStruct {
    progressData: IDataImportProgress, // 查询进度
    uploadController: AbortController | null, // 控制文件上传
    uploadPercentage: number, // 上传进度
    form: { tableName: string; file: File | null } | null, // 文件信息
    importStart: boolean, // 是否开始上传
    pollTimer: number | null, // 轮询
}

const importTasks = ref<Map<string, taskStruct>>(new Map())

const isAddingTable = ref(false)
const tables = ref<Array<ITableInfo>>([])
const isLoading = ref(true)

onMounted(() => tableInfoInit())

const startPolling = (task: taskStruct) => {
    const taskId = task.progressData.taskId
    if (taskId !== '') {
        task.pollTimer = window.setInterval(async () => {
            try {
                const { data } = await getImportProgress(taskId)
                // console.log('----progress', data)
                
                task.progressData.percentage = Math.floor(data.data.percentage)
                task.progressData.status = data.data.status
                task.progressData.processedLines = data.data.processedLines
                task.progressData.totalLines = data.data.totalLines
                if (data.data.status !== 'PROCESSING') {
                    ElNotification.success({
                        message: '导入完成'
                    })
                    stopPolling(task)
                }
            } catch(e) {
                console.log(e)
            }
        }, 2000)
    }
}

const stopPolling = (task: taskStruct) => {
    if (task.pollTimer) {
        clearInterval(task.pollTimer)
    }
    task.pollTimer = null
}

const tableInfoInit = async () => {
    isLoading.value = true
    const response = await getTables()
    const { data } = response.data
    // console.log('----table', data)
    tables.value = data.map(t => {
        if (t.progressVO) {
            const task: taskStruct = reactive({
                progressData: {
                    taskId: t.progressVO.taskId,
                    tableName: t.progressVO.tableName,
                    totalLines: t.progressVO.totalLines,
                    processedLines: t.progressVO.processedLines,
                    totalBytes: t.progressVO.totalBytes,
                    processedBytes: t.progressVO.processedBytes,
                    percentage: t.progressVO.percentage,
                    status: t.progressVO.status
                },
                uploadController: null,
                uploadPercentage: 0,
                form: null,
                importStart: true,
                pollTimer: null
            })
            importTasks.value.set(t.tablename, task)
            startPolling(task)
        }
        return t
    })
    // console.log('----importTasks', importTasks.value)

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
    // 新建任务
    const file = (event.target as HTMLInputElement).files![0]
    if (file) {
        const controller = new AbortController()
        const task: taskStruct = reactive({
            progressData: {
                taskId: '',
                tableName: row.tablename,
                totalLines: 0,
                processedLines: 0,
                totalBytes: 0,
                processedBytes: 0,
                percentage: 0,
                status: ''
            },
            uploadController: controller,
            uploadPercentage: 0,
            form: { tableName: row.tablename, file },
            importStart: false,
            pollTimer: null
        })
        importTasks.value.set(row.tablename, task)
    }
}
const onFileUploadStart = async (event: Event, row: ITableInfo) => {
    const task = importTasks.value.get(row.tablename)
    if (!task || !task?.form?.file) {
        ElNotification.error({
            message: '请先选择文件'
        })
        return;
    }
    try {
        const response = await importFile(task.form.tableName, task.form.file, (percent: any) => {
            task.uploadPercentage = percent
        }, task.uploadController?.signal)
        task.uploadPercentage = 100
        task.importStart = true
        task.progressData.taskId = response.data.taskId
        console.log('----task', task)
        startPolling(task)
        ElNotification.success({
            title: `${task.progressData.tableName}`,
            message: `${response.message}`
        })
    } catch (err) {
        if (axios.isCancel(err)) {
            ElNotification.success({
                message: '取消成功'
            })
        }
    } finally {
        task.uploadController = null
    }
}
const onFileUploadEnd = async (event: Event, row: ITableInfo) => {
    const task = importTasks.value.get(row.tablename)
    if (!task) {
        return
    }
    const { data } = await removeImportTask(task.progressData.taskId)
    if (data.message && data.message.length > 0) {
        ElNotification.success({
            title: `${data.message}`,
            message: '导入任务完成'
        })
        importTasks.value.delete(row.tablename)
    } else {
        ElNotification.error({
            message: '删除任务失败'
        })
    }
}
const onFileUploadCancel = (event: Event, row: ITableInfo) => {
    const task = importTasks.value.get(row.tablename)
    if (!task) return

    if (task.uploadController) {
        task.uploadController.abort()
        task.uploadController = null
    }
    task.uploadPercentage = 0
    if (task.form) {
        task.form.tableName = ''
        task.form.file = null
    }
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
                        <label v-if="!importTasks.get(scoped.row.tablename)" class="upload-btn">
                            <span class="el-button el-button--text el-button--small">上传文件</span>
                            <input type="file" style="display: none;" accept="*.csv,*.txt"
                                @change="onFileChange($event, scoped.row)" />
                        </label>
                        <div class="file-upload" v-else>
                            <div v-if="importTasks.get(scoped.row.tablename)?.importStart === false">
                                <el-progress :percentage="importTasks.get(scoped.row.tablename)?.uploadPercentage" :text-inside="true"
                                    :stroke-width="17"></el-progress>
                                <span class="el-button el-button--text el-button--small"
                                    @click="onFileUploadStart($event, scoped.row)">开始</span>
                                <span class="el-button el-button--text el-button--small"
                                    @click="onFileUploadCancel($event, scoped.row)">取消</span>
                            </div>
                            <div v-else-if="importTasks.get(scoped.row.tablename)?.progressData.status === 'COMPLETED'">
                                <el-progress :percentage="importTasks.get(scoped.row.tablename)?.progressData.percentage" :text-inside="true"
                                    :stroke-width="17"></el-progress>
                                <span class="el-button el-button--text el-button--small"
                                    @click="onFileUploadEnd($event, scoped.row)">完成</span>
                            </div>
                            <div v-else>
                                <el-progress :percentage="importTasks.get(scoped.row.tablename)?.progressData.percentage" :text-inside="true"
                                    :stroke-width="17"></el-progress>
                                <div>{{ importTasks.get(scoped.row.tablename)?.progressData.status }}</div>
                            </div>
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