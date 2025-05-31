<script lang="ts" setup>
import { getSmallOrder } from '@/api/serviceQuery';
import { ISmallOrderQuery, ISmallOrderRes } from '@/typings/service';
import { FormInstance, FormRules, ElLoading } from 'element-plus';
import { reactive, ref } from 'vue';

const formRef = ref<FormInstance>()
const loading = ref(false)
const everage = ref<number | null>(null)
const years = ref<number | null>(null)

const queryRes = ref<ISmallOrderRes>({
    avgrevenue: 0,
    executionTimeMs: 0,
    throughputQPS: 0,
    avgLatencyMs: 0
})

const queryParam = reactive<ISmallOrderQuery>({
    years: null,
    brand: '',
    container: ''
})

const rules = reactive<FormRules<any>>({
    brand: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ],
    container: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ]
})

const handleQuery = async () => {
    try {
        await formRef.value!.validate()
        try {
            loading.value = true
            const { data } = await getSmallOrder(queryParam)
            everage.value = data.data.avgrevenue

            queryRes.value = data.data

            years.value = queryParam.years
            loading.value = false
        } catch (e) {
            console.log(e)
        }
    } catch {
        return
    }
}

const resetQuery = () => {
    queryParam.brand = ''
    queryParam.container = ''
    queryParam.years = null
    formRef.value?.clearValidate()
}

</script>

<template>
    <div class="title">小额订单收入查询</div>
    <div class="main">
        <div v-show="queryRes.executionTimeMs > 0">
            <el-divider></el-divider>
            <div class="sub-title">查询性能: </div>
            <div class="content">
                <span class="sec-title">执行时长: </span>{{ queryRes.executionTimeMs }}ms &nbsp;
                <span class="sec-title">吞吐量(QPS): </span>{{ queryRes.throughputQPS.toFixed(5) }}次/s &nbsp;
                <span class="sec-title">平均延迟时间: </span> {{ queryRes.avgLatencyMs.toFixed(5) }}ms
            </div>
            <el-divider></el-divider>
        </div>
        <div class="form">
            <el-form :model="queryParam" :rules="rules" ref="formRef" label-width="auto">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="零件品牌" prop="brand">
                            <el-input v-model="queryParam.brand"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="包装" prop="container">
                            <el-input v-model="queryParam.container"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="年份" prop="years">
                            <el-input v-model="queryParam.years"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div style="text-align: center;">
                <el-button type="primary" @click="handleQuery">查询</el-button>
                <el-button type="info" @click="resetQuery">重置</el-button>
            </div>
        </div>
        <div class="data">
            <el-empty v-if="everage === null && loading === false" description="无内容"></el-empty>
            <el-skeleton v-else-if="loading" animated :rows="1" />
            <div style="text-align: center; font-size: 16px;" v-else>
                这些订单收入在 {{ years }} 年内的平均值为：{{ everage }} 元
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.form {
    margin-top: 20px;
}

.data {
    margin-top: 20px;
}

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
</style>