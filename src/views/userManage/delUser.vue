<script setup lang="ts">
import { delUsers, getAllUsers } from '@/api/usermanage';
import { IUserAllData } from '@/typings/user';
import { ElCard, ElNotification, ElTable, TableColumnCtx, TableInstance } from 'element-plus';
import { onMounted, ref } from 'vue';

const userList = ref<Array<IUserAllData>>([])
const selectedNames = ref<Array<String>>([])
const tableRef = ref<TableInstance>()
const loading = ref(true)

const userListInit = async () => {
    loading.value = true
    const response = await getAllUsers()
    const { data } = response.data
    userList.value = data.users as IUserAllData[]
    loading.value = false
}
onMounted(() => userListInit())

const handleSelection = (selectedRows: IUserAllData[]) => {
    selectedNames.value = selectedRows.map(row => row.name)
}

const handleCancel = () => {
    tableRef.value?.clearSelection()
}

const handleSubmit = async () => {
    loading.value = true
    for (let name of selectedNames.value) {
        const response = await delUsers(name)
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
            await userListInit()
        }
    }
    loading.value = false
}

const filterHandler = (value: string, row: IUserAllData) => {
    return row.status === value
}

</script>

<template>
    <ElCard>
        <div class="title">用户删除</div>
        <div class="main">
            <ElTable :data="userList" v-loading="loading" row-key="name" ref="tableRef"
                @selection-change="handleSelection" style="width: 100%;">
                <el-table-column type="selection" width="55" />
                <el-table-column label="用户id" prop="id" />
                <el-table-column label="用户名" prop="name" />
                <el-table-column label="权限" prop="role" />
                <el-table-column label="当前状态" :filters="[
                    { text: 'PENDING', value: 'PENDING' },
                    { text: 'APPROVED', value: 'APPROVED' }
                ]" :filter-method="filterHandler">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 'PENDING' ? 'primary' : 'success'" 
                            disable-transitions>
                            {{ scope.row.status }}</el-tag>
                    </template>
                </el-table-column>
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