<script lang="ts" setup>
import { createTable } from '@/api/datamanage';
import { INewTable, ITableKeyConstrain } from '@/typings/data';
import { ElNotification, FormRules } from 'element-plus';
import { title } from 'process';
import { reactive, ref } from 'vue';

const dialogVisible = ref(false)
const newTable = reactive<INewTable>({
    tableName: '',
    columns: []
})
const newKey = reactive(new ITableKeyConstrain())
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
const onKeySubmit = () => {
    const newInstance = new ITableKeyConstrain({ ...newKey })
    newTable.columns.push(newInstance)
    dialogVisible.value = false
    ElNotification.success({
        title: `${newKey.name}`,
        message: '添加成功'
    })
    Object.assign(newKey, new ITableKeyConstrain())
}
const onTableSubmit = async () => {
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
                </el-table>
            </el-form-item>
        </el-form>
    </div>
    <div class="submit">
        <el-button type="info" @click="emit('cancel')">取 消</el-button>
        <el-button type="primary" @click="onTableSubmit">提 交</el-button>
    </div>
    <el-dialog title="新增属性" v-model="dialogVisible">
        <div class="key-form-container">
            <el-form :model="newKey" :rules="rules" label-width="auto">
                <!-- 名字和类型 -->
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item prop="key" label="属性名">
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
                            <el-input v-model="newKey.lowerLimit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="上限(<=)">
                            <el-input v-model="newKey.upperLimit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="(字符)长度">
                            <el-input v-model="newKey.length"></el-input>
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
