<script lang="ts" setup>
import { INewTable, ITableKeyConstrain } from '@/typings/data';
import { FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

const dialogVisible = ref(false)
const newTable = reactive<INewTable>({
    name: '',
    keys: []
})
const newKey = reactive<ITableKeyConstrain>({
    key: '', // 属性名
    type: '', // 类型
    // 可选
    upperLimit: undefined, // 上限 <=
    lowerLimit: undefined, // 下限 >=
    notNull: false, // 非空
    primary: false, // 主键，默认不是
})
const rules = reactive<FormRules<ITableKeyConstrain>>({
    key: [
        { required: true, message: '必须填写属性名' }
    ],
    type: [
        { required: true, message: '必须填写属性类型' }
    ]
})

const keys = reactive<Array<ITableKeyConstrain>>([])

const onAddKeyClick = () => {
    dialogVisible.value = true
}
</script>

<template>
    <div class="title">新建表</div>
    <div class="container">
        <el-form :model="newTable" label-width="auto">
            <el-form-item label="表名" style="width: 300px;">
                <el-input v-model="newTable.name"></el-input>
            </el-form-item>
            <el-form-item label="属性">
                <el-button type="primary" @click="onAddKeyClick" plain>新增属性</el-button>
                <el-table :data="keys">
                    <el-table-column prop="key" label="属性名" />
                    <el-table-column prop="type" label="类型" />
                </el-table>
            </el-form-item>
        </el-form>
    </div>
    <div class="submit">
        <el-button type="primary">提交</el-button>
    </div>
    <el-dialog title="新增属性" v-model="dialogVisible">
        <div class="key-form-container">
            <el-form :model="newKey" :rules="rules" label-width="auto">
            <!-- 名字和类型 -->
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item prop="key" label="属性名">
                            <el-input v-model="newKey.key"></el-input>
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
                        <el-form-item label="下限">
                            <el-input v-model="newKey.lowerLimit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="上限">
                            <el-input v-model="newKey.upperLimit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="其他约束">
                    <el-checkbox v-model="newKey.primary" label="主键" size="large"></el-checkbox>
                    <el-checkbox v-model="newKey.notNull" label="非空" size="large"></el-checkbox>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="success" @click="dialogVisible = false">提 交</el-button>
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
