<script setup lang="ts">
import { getPhysicalInfo } from '@/api/systemmange';
import { IPhysical } from '@/typings/system';
import { ElLoading, ElNotification, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';


const param = reactive({
    schemaName: null,
    tableName: null
})

const res = ref<IPhysical | null>(null)
const formRef = ref<FormInstance>()

const rules = reactive<FormRules<any>>({
    schemaName: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ],
    tableName: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ]
})

const onSubmit = async () => {
    try {
        await formRef.value?.validate()
        const loading = ElLoading.service({
            lock: true,
            text: '查询中',
        })
        if (param.schemaName && param.tableName) {
            const { data } = await getPhysicalInfo(param.schemaName, param.tableName)
            if (data.data === null) {
                ElNotification.error({
                    message: '暂无该表相关数据'
                })
            }
            res.value = data.data
        }
        loading.close()
    } catch {
        return
    }
}

const onCancel = () => {
    formRef.value?.clearValidate()
    param.schemaName = null
    param.tableName = null
}

</script>

<template>
    <div class="title">数据库表物理信息</div>
    <div class="main">
        <div class="inputs">
            <el-form ref="formRef" :model="param" :rules="rules">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="schemaName" prop="schemaName">
                            <el-input v-model="param.schemaName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="tableName" prop="tableName">
                            <el-input v-model="param.tableName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="btns">
            <el-button type="primary" @click="onSubmit">提 交</el-button>
            <el-button type="info" @click="onCancel">取 消</el-button>
        </div>
        <div class="result" v-show="res !== null">
            <el-divider></el-divider>
            <div class="sub-title">indexes: </div>
            <div class="content" style="margin-bottom: 26px;">
                <el-table :data="res?.indexes">
                    <el-table-column prop="INDEX_NAME" label="INDEX_NAME"></el-table-column>
                    <el-table-column prop="COLUMN_NAME" label="COLUMN_NAME"></el-table-column>
                    <el-table-column prop="NON_UNIQUE" label="NON_UNIQUE"></el-table-column>
                    <el-table-column prop="SEQ_IN_INDEX" label="SEQ_IN_INDEX"></el-table-column>
                    <el-table-column prop="CARDINALITY" label="CARDINALITY"></el-table-column>
                </el-table>
            </div>
            <div class="sub-title">tableInfo: </div>
            <div class="content">
                <span class="sec-title">TABLE_CATALOG:</span>
                {{ res?.tableInfo.TABLE_CATALOG }} &nbsp;
                <span class="sec-title">TABLE_SCHEMA: </span>
                {{ res?.tableInfo.TABLE_SCHEMA }} &nbsp;
                <span class="sec-title">TABLE_NAME: </span>
                {{ res?.tableInfo.TABLE_NAME }} &nbsp;
                <span class="sec-title">TABLE_TYPE: </span>
                {{ res?.tableInfo.TABLE_TYPE }} <br>
                <span class="sec-title">ENGINE: </span>
                {{ res?.tableInfo.ENGINE }} &nbsp;
                <span class="sec-title">VERSION: </span>
                {{ res?.tableInfo.VERSION }} &nbsp;
                <span class="sec-title">ROW_FORMAT: </span>
                {{ res?.tableInfo.ROW_FORMAT }} &nbsp;
                <span class="sec-title">TABLE_ROWS: </span>
                {{ res?.tableInfo.TABLE_ROWS }} <br>
                <span class="sec-title">AVG_ROW_LENGTH: </span>
                {{ res?.tableInfo.AVG_ROW_LENGTH }} &nbsp;
                <span class="sec-title">DATA_LENGTH: </span>
                {{ res?.tableInfo.DATA_LENGTH }} &nbsp;
                <span class="sec-title">MAX_DATA_LENGTH: </span>
                {{ res?.tableInfo.MAX_DATA_LENGTH }} &nbsp;
                <span class="sec-title">INDEX_LENGTH: </span>
                {{ res?.tableInfo.INDEX_LENGTH }} <br>
                <span class="sec-title">DATA_FREE: </span>
                {{ res?.tableInfo.DATA_FREE }} &nbsp;
                <span class="sec-title">AUTO_INCREMENT: </span>
                {{ res?.tableInfo.AUTO_INCREMENT }} <br>
                <span class="sec-title">CREATE_TIME: </span>
                {{ res?.tableInfo.CREATE_TIME ? new Date(res!.tableInfo.CREATE_TIME).toLocaleString() :
                    '暂无' }} &nbsp;
                <span class="sec-title">UPDATE_TIME: </span>
                {{ res?.tableInfo.UPDATE_TIME ? new Date(res!.tableInfo.UPDATE_TIME).toLocaleString() :
                    '暂无' }} &nbsp;
                <span class="sec-title">CHECK_TIME: </span>
                {{ res?.tableInfo.CHECK_TIME ? new Date(res!.tableInfo.CHECK_TIME).toLocaleString() : '暂无'
                }} <br>
                <span class="sec-title">TABLE_COLLATION: </span>
                {{ res?.tableInfo.TABLE_COLLATION }} &nbsp;
                <span class="sec-title">CHECKSUM: </span>
                {{ res?.tableInfo.CHECKSUM }} &nbsp;
                <span class="sec-title">CREATE_OPTIONS: </span>
                {{ res?.tableInfo.CREATE_OPTIONS }} <br>
                <span class="sec-title">TABLE_COMMENT: </span>
                {{ res?.tableInfo.TABLE_COMMENT }} &nbsp;
            </div>
            <el-divider></el-divider>
            <div class="sub-title">physicalStorage</div>
            <div class="content">
                <span class="sec-title">createStatement: </span> <br> {{ res?.physicalStorage.createStatement }} <br>
                <span class="sec-title">dataDirectory: </span> <br> {{ res?.physicalStorage.dataDirectory }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.main {
    margin-top: 40px;

    .btns {
        display: flex;
        justify-content: center;
        text-align: center;
        gap: 10px;
        margin-top: 10px;
    }

    .result {
        margin: 20px;

        .sub-title {
            font-size: 16px;
            margin-bottom: 10px;
            margin-top: 10px;
        }

        .content {
            font-size: 14px;
            line-height: 30px;
            color: #616161;
        }

        .sec-title {
            font-weight: bold;
        }
    }
}

::v-deep .cell {
    text-align: center;
}
</style>