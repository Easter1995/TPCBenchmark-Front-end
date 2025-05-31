<script setup lang="ts">
import { getPhysicalInfo } from '@/api/systemmange';
import { IPhysical } from '@/typings/system';
import { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';


const param = reactive({
    schemaName: null,
    tableName: null
})
const loading = ref(false)
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
        if (param.schemaName && param.tableName) {
            loading.value = true
            const { data } = await getPhysicalInfo(param.schemaName, param.tableName)
            res.value = data.data
            loading.value = false
        }
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
            <div class="content">
                <el-table :data="res?.indexes">
                    <el-table-column prop="INDEX_NAME" label="INDEX_NAME"></el-table-column>
                    <el-table-column prop="COLUMN_NAME" label="COLUMN_NAME"></el-table-column>
                    <el-table-column prop="NON_UNIQUE" label="NON_UNIQUE"></el-table-column>
                    <el-table-column prop="SEQ_IN_INDEX" label="SEQ_IN_INDEX"></el-table-column>
                    <el-table-column prop="CARDINALITY" label="CARDINALITY"></el-table-column>
                </el-table>
            </div>
            <el-divider></el-divider>
            <div class="sub-title">tableInfo: </div>
            <div class="content">
                TABLE_CATALOG: {{ res?.tableInfo.TABLE_CATALOG }} &nbsp;
                TABLE_SCHEMA: {{ res?.tableInfo.TABLE_SCHEMA }} &nbsp;
                TABLE_NAME: {{ res?.tableInfo.TABLE_NAME }} &nbsp;
                TABLE_TYPE: {{ res?.tableInfo.TABLE_TYPE }} <br>
                ENGINE: {{ res?.tableInfo.ENGINE }} &nbsp;
                VERSION: {{ res?.tableInfo.VERSION }} &nbsp;
                ROW_FORMAT: {{ res?.tableInfo.ROW_FORMAT }} &nbsp;
                TABLE_ROWS: {{ res?.tableInfo.TABLE_ROWS }} <br>
                AVG_ROW_LENGTH: {{ res?.tableInfo.AVG_ROW_LENGTH }} &nbsp;
                DATA_LENGTH: {{ res?.tableInfo.DATA_LENGTH }} &nbsp;
                MAX_DATA_LENGTH: {{ res?.tableInfo.MAX_DATA_LENGTH }} &nbsp;
                INDEX_LENGTH: {{ res?.tableInfo.INDEX_LENGTH }} <br>
                DATA_FREE: {{ res?.tableInfo.DATA_FREE }} &nbsp;
                AUTO_INCREMENT: {{ res?.tableInfo.AUTO_INCREMENT }} <br>
                CREATE_TIME: {{ new Date(res!.tableInfo.CREATE_TIME).toLocaleString() }} &nbsp;
                UPDATE_TIME: {{ new Date(res!.tableInfo.UPDATE_TIME).toLocaleString() }} &nbsp;
                CHECK_TIME: {{ new Date(res!.tableInfo.CHECK_TIME).toLocaleString() }} <br>
                TABLE_COLLATION: {{ res?.tableInfo.TABLE_COLLATION }} &nbsp;
                CHECKSUM: {{ res?.tableInfo.CHECKSUM }} &nbsp;
                CREATE_OPTIONS: {{ res?.tableInfo.CREATE_OPTIONS }} <br>
                TABLE_COMMENT: {{ res?.tableInfo.TABLE_COMMENT }} &nbsp;
            </div>
            <el-divider></el-divider>
            <div class="sub-title">physicalStorage</div>
            <div class="content">
                createStatement: <br> {{ res?.physicalStorage.createStatement }}
                dataDirectory: <br> {{ res?.physicalStorage.dataDirectory }}
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
    }
}

::v-deep .cell {
    text-align: center;
}
</style>