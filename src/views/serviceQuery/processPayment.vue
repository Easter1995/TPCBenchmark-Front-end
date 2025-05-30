<script setup lang="ts">
import { updatePayment } from '@/api/serviceQuery';
import { IPayment, IPaymentRes } from '@/typings/service';
import { ElLoading, ElNotification, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

const formRef = ref<FormInstance>()
const paymentParam = reactive<IPayment>({
    warehouseId: null,
    districtId: null,
    customerId: null,
    paymentAmount: null
})

const paymentRes = ref<IPaymentRes | null>(null)

const rules = reactive<FormRules<any>>({
    warehouseId: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ],
    districtId: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ],
    customerId: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ],
    paymentAmount: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ]
})

const onCancel = () => {
    paymentParam.customerId = null
    paymentParam.districtId = null
    paymentParam.paymentAmount = null
    paymentParam.warehouseId = null
    formRef.value?.clearValidate()
}

const onSubmit = async () => {
    try {
        await formRef.value!.validate()
        paymentRes.value = null
        try {
            const loading = ElLoading.service({
                lock: true,
                text: '更新中',
            })
            const { data } = await updatePayment(paymentParam)
            paymentRes.value = data.data
            loading.close()
            if (data.data) {
                ElNotification({
                    type: 'success',
                    message: data.message
                })
            } else {
                ElNotification({
                    type: 'error',
                    message: data.message
                })
            }
        } catch (e) {
            ElNotification({
                type: 'error',
                message: e
            })
        }
    } catch {
        return
    }
}

</script>

<template>
    <div class="title">更新账户余额</div>
    <div class="main">
        <el-form ref="formRef" :model="paymentParam" :rules="rules">
            <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item label="warehouseId" prop="warehouseId">
                        <el-input v-model="paymentParam.warehouseId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="districtId" prop="districtId">
                        <el-input v-model="paymentParam.districtId"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item label="customerId" prop="customerId">
                        <el-input v-model="paymentParam.customerId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="paymentAmount" prop="paymentAmount">
                        <el-input v-model="paymentParam.paymentAmount"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="onSubmit">提 交</el-button>
            <el-button type="info" @click="onCancel">取 消</el-button>
        </div>
        <div class="result" v-if="paymentRes !== null">
            <el-divider></el-divider>
            <div class="detail">
                <div class="sub-title">支付详情</div>
                <div class="content">
                    warehouseId: {{ paymentRes.warehouseId }} &nbsp;
                    warehouseName: {{ paymentRes.warehouseName }} &nbsp;
                    districtId: {{ paymentRes.districtId }} &nbsp;
                    districtName: {{ paymentRes.districtId }} <br>
                    customerId: {{ paymentRes.customerId }} &nbsp;
                    customerName: {{ paymentRes.customerName }} <br>
                    paymentDate: {{ new Date(paymentRes.paymentDate).toLocaleString() }} <br>
                    paymentAmount: {{ paymentRes.paymentAmount }} <br>
                    customerBalanceBeforePayment: {{ paymentRes.customerBalanceAfterPayment }} &nbsp;
                    customerBalanceAfterPayment: {{ paymentRes.customerBalanceAfterPayment }} <br>
                </div>
            </div>
            <div class="analyze">
                <div class="sub-title">事务分析</div>
                <div class="content">
                    execution time: {{ paymentRes.executionTimeMs }} ms
                </div>
                <div class="content">detail:</div>
                <el-table :data="paymentRes.sqlDetails">
                    <el-table-column prop="sqlType" label="sql语句"></el-table-column>
                    <el-table-column prop="description" label="描述"></el-table-column>
                    <el-table-column prop="executionTimeMs" label="执行时长(ms)"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.main {
    margin-top: 40px;
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

.btns {
    display: flex;
    justify-content: center;
    text-align: center;
    gap: 10px;
    margin-top: 10px;
}

::v-deep .cell {
    text-align: center;
}
</style>