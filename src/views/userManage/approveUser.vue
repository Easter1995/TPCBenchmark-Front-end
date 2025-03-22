<script setup lang="ts">
import { approveUsers, getApproveList } from '@/api/usermanage';
import { IUserApproveData } from '@/typings/user';
import { ElCard, ElNotification, ElTable } from 'element-plus';
import { onMounted, ref } from 'vue';

const userList = ref<IUserApproveData[]>([])
const selectedIds = ref<Array<number>>([])
const tableRef = ref()
const loading = ref(true)

const approveListInit = async () => {
    loading.value = true
    const response = await getApproveList()
    const { data } = response.data
    userList.value = data.users
    loading.value = false
}
onMounted(() => approveListInit())

const handleSelection = (selectedRows: IUserApproveData[]) => {
    selectedIds.value = selectedRows.map(row => row.id)
}

const handleCancel = () => {
    tableRef.value?.clearSelection()
}

const handleSubmit = async () => {
    loading.value = true
    const response = await approveUsers(selectedIds.value)
    const { message, data, code } = response.data
    if (code !== 200) {
        ElNotification.error({
            message,
        })
    } else {
        ElNotification.success({
            message,
            duration: 1000
        })
        await approveListInit()
    }
    loading.value = false
}
</script>

<template>
    <ElCard>
        <div class="title">用户审批</div>
        <div class="main">
            <ElTable 
                :data="userList" 
                v-loading="loading"
                row-key="id" 
                ref="tableRef" 
                @selection-change="handleSelection"
                style="width: 100%;"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column label="用户id" prop="id" />
                <el-table-column label="用户名" prop="name" />
                <el-table-column label="当前状态" prop="status" />
            </ElTable>
            <div class="submit">
                <el-button type="primary" @click="handleSubmit" plain>提 交</el-button>
                <el-button type="danger" @click="handleCancel" plain>取 消</el-button>
            </div>
        </div>
    </ElCard>
</template>

<style scoped lang="scss">
.main {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
}
</style>