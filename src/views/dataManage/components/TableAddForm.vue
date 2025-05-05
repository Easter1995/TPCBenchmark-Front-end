<script lang="ts" setup>
import { createTable } from '@/api/datamanage';
import { INewTable, ITableKeyConstrain } from '@/typings/data';
import { ElNotification, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

const dialogVisible = ref(false)
const isEdit = ref(false)
const editIndex = ref(0)
const newTable = reactive<INewTable>({
    tableName: '',
    columns: []
})
const newKey = reactive(new ITableKeyConstrain())
const keyFormRef = ref<FormInstance>()
const rules = reactive<FormRules<ITableKeyConstrain>>({
    name: [
        { required: true, message: '必须填写属性名' }
    ],
    type: [
        { required: true, message: '必须填写属性类型' }
    ]
})

const emit = defineEmits(['cancel'])

const onAddKeyClick = () => {
    dialogVisible.value = true
}

const onAddKeyClose = () => {
    dialogVisible.value = false
    Object.assign(newKey, new ITableKeyConstrain())
    keyFormRef.value?.resetFields()
    handleKeyValue()
    isEdit.value = false
}

const onKeySubmit = () => {
    if (isEdit.value) {
        newTable.columns.splice(editIndex.value, 1)
        isEdit.value = false
    }
    const newInstance = new ITableKeyConstrain({ ...newKey })
    newTable.columns.push(newInstance)
    dialogVisible.value = false
    ElNotification.success({
        title: `${newKey.name}`,
        message: '添加成功'
    })
    onAddKeyClose()
}

const handleKeyValue = () => {
    for (let key of newTable.columns) {
        if (key.length && typeof key.length === 'string') { key.length = parseInt(key.length) }
        if (key.upperLimit && typeof key.upperLimit === 'string') { key.upperLimit = parseInt(key.upperLimit) }
        if (key.lowerLimit && typeof key.lowerLimit === 'string') { key.length = parseInt(key.lowerLimit) }
        key.name = key.name.trim().toLocaleUpperCase()
        key.type = key.type.trim().toLocaleUpperCase()
    }
}

const onTableSubmit = async () => {
    // console.log('----newTable', newTable)
    try {
        const response = await createTable(newTable.tableName, newTable.columns)
        const { data, message } = response.data
        if (data) {
            ElNotification.success({
                title: '添加成功',
                message: `表格${data.tablename}已添加`
            })
        } else {
            ElNotification.error({
                message
            })
        }
        emit('cancel')
    } catch {
        ElNotification.error({ message: '请求失败' })
    }
}

const handleEdit = (index: number, row: ITableKeyConstrain) => {
    dialogVisible.value = true
    isEdit.value = true
    editIndex.value = index
    Object.assign(newKey, JSON.parse(JSON.stringify(row)))
    console.log(newTable)
}

const handleDel = (index: number) => {
    newTable.columns.splice(index, 1)
    console.log(newTable)
}

</script>

<template>
    <div class="title">新建表</div>
    <div class="container">
        <el-form :model="newTable" label-width="auto">
            <el-form-item label="表名" style="width: 300px;">
                <el-input v-model="newTable.tableName"></el-input>
            </el-form-item>
            <el-form-item label="属性">
                <el-button type="primary" @click="onAddKeyClick" plain>新增属性</el-button>
                <el-table :data="newTable.columns">
                    <el-table-column prop="name" label="属性名" />
                    <el-table-column prop="type" label="类型" />
                    <el-table-column prop="notNull" label="非空" />
                    <el-table-column prop="primaryKey" label="主键" />
                    <el-table-column header-align="center" label="操作">
                        <template #default="scoped">
                            <span class="el-button el-button--text el-button--small" @click="handleEdit(scoped.$index, scoped.row)">编辑</span>
                            <span class="el-button el-button--text el-button--small" @click="handleDel(scoped.$index)">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </div>
    <div class="submit">
        <el-button type="info" @click="emit('cancel')">取 消</el-button>
        <el-button type="primary" @click="onTableSubmit">提 交</el-button>
    </div>
    <el-dialog title="新增属性" v-model="dialogVisible" @close="onAddKeyClose">
        <div class="key-form-container">
            <el-form :model="newKey" :rules="rules" ref="keyFormRef" label-width="auto">
                <!-- 名字和类型 -->
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item prop="name" label="属性名">
                            <el-input v-model="newKey.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="type" label="属性类型">
                            <el-input v-model="newKey.type"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 可选字段 -->
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="下限(>=)">
                            <el-input v-model.number="newKey.lowerLimit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="上限(<=)">
                            <el-input v-model.number="newKey.upperLimit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="(字符)长度">
                            <el-input v-model.number="newKey.length"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="其他约束">
                    <el-checkbox v-model="newKey.primaryKey" label="主键" size="large"></el-checkbox>
                    <el-checkbox v-model="newKey.notNull" label="非空" size="large"></el-checkbox>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="success" @click="onKeySubmit">提 交</el-button>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.submit {
    text-align: center;
    margin-top: 30px;
}

.title {
    font-size: large;
    margin-bottom: 30px;
}
</style>
