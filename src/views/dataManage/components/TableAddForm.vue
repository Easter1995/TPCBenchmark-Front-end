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
const tableFormRef = ref<FormInstance>()

const numberValidate = (_rule: any, value: any, callback: any) => {
    if (!value) {
        callback()
    }
    if (!Number.isInteger(value)) {
        callback(new Error('必须输入数字'))
    } else {
        callback()
    }
}

const rules = reactive<FormRules<ITableKeyConstrain>>({
    name: [
        { required: true, message: '必须填写属性名', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '必须填写属性类型', trigger: 'blur' }
    ],
    length: [
        { validator: numberValidate, trigger: 'blur' }
    ],
    upperLimit: [
        { validator: numberValidate }
    ],
    lowerLimit: [
        { validator: numberValidate }
    ]
})
const tableRules = reactive<FormRules<INewTable>>({
    tableName: [
        { required: true, message: '必须填写表名' }
    ],
    columns: [
        { required: true, message: '必须新建属性' }
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
    isEdit.value = false
}

const onKeySubmit = async () => {
    try {
        await keyFormRef.value!.validate()
        handleKeyValue(newKey)
        const tip = isEdit.value ? '编辑' : '添加'
        const newInstance = new ITableKeyConstrain({ ...newKey })
        if (isEdit.value) {
            newTable.columns.splice(editIndex.value, 1)
            newTable.columns.splice(editIndex.value, 0, newInstance)
            isEdit.value = false
        } else {
            newTable.columns.push(newInstance)
        }
        dialogVisible.value = false
        ElNotification.success({
            title: `${newKey.name}`,
            message: `${tip}成功`
        })
        onAddKeyClose()
    } catch {
        return
    }
}

const handleKeyValue = (key: ITableKeyConstrain) => {
    if (key.length && typeof key.length === 'string') { key.length = parseInt(key.length) }
    if (key.upperLimit && typeof key.upperLimit === 'string') { key.upperLimit = parseInt(key.upperLimit) }
    if (key.lowerLimit && typeof key.lowerLimit === 'string') { key.lowerLimit = parseInt(key.lowerLimit) }
    key.name = key.name.replace(/\s+/g, '').toLocaleUpperCase()
    key.type = key.type.replace(/\s+/g, '').toLocaleUpperCase()
}

const onTableSubmit = async () => {
    // console.log('----newTable', newTable)
    try {
        await tableFormRef.value!.validate()
        try {
            newTable.tableName = newTable.tableName.trim().toLocaleUpperCase()
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
    } catch {
        return
    }
}

const handleEdit = (index: number, row: ITableKeyConstrain) => {
    dialogVisible.value = true
    isEdit.value = true
    editIndex.value = index
    Object.assign(newKey, JSON.parse(JSON.stringify(row)))
    // console.log(newTable)
}

const handleDel = (index: number) => {
    newTable.columns.splice(index, 1)
    // console.log(newTable)
    ElNotification.success({
        title: `${newKey.name}`,
        message: `删除成功`
    })
}

</script>

<template>
    <div class="title">新建表</div>
    <div class="container">
        <el-form :rules="tableRules" :model="newTable" ref="tableFormRef" label-width="auto">
            <el-form-item label="表名" prop="tableName" style="width: 300px;">
                <el-input v-model="newTable.tableName"></el-input>
            </el-form-item>
            <el-form-item label="属性" prop="columns">
                <el-button type="primary" @click="onAddKeyClick" plain>新增属性</el-button>
                <el-table :data="newTable.columns">
                    <el-table-column prop="name" label="属性名" width="200" show-overflow-tooltip />
                    <el-table-column prop="type" label="类型" width="200" />
                    <el-table-column prop="notNull" label="非空" width="100" />
                    <el-table-column prop="primaryKey" label="主键" width="100" />
                    <el-table-column header-align="center" label="操作" width="400">
                        <template #default="scoped">
                            <div class="action-container">
                                <div class="el-button el-button--text el-button--small"
                                    @click="handleEdit(scoped.$index, scoped.row)">编辑</div>
                                <div class="el-button el-button--text el-button--small"
                                    @click="handleDel(scoped.$index)">删除</div>
                            </div>
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
                <el-row :gutter="30">
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
                    <el-col :span="8">
                        <el-form-item label="下限(>=)" prop="lowerLimit">
                            <el-input v-model.number="newKey.lowerLimit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="上限(<=)" prop="upperLimit">
                            <el-input v-model.number="newKey.upperLimit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="(字符/小数)长度" prop="length">
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

::v-deep .action-container {
    display: inline-flex;
    justify-content: center;
    width: 100%;
    gap: 12px;
}
</style>
