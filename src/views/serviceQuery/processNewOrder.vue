<script setup lang="ts">
import { addOrder } from '@/api/serviceQuery';
import { INewOrder, INewOrderItem, INewOrderRes } from '@/typings/service';
import { ElLoading, ElNotification, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

const formRef = ref<FormInstance>()
const itemForm = ref<FormInstance>()
const addItemVis = ref(false)

const neworderParam = reactive<INewOrder>({
    warehouseId: null,
    districtId: null,
    customerId: null,
    items: []
})

const newOrderRes = ref<INewOrderRes | null>(null)

const newItem = reactive<INewOrderItem>({
    itemId: null,
    supplierId: null,
    quantity: null
})

const rules = reactive<FormRules<any>>({
    warehouseId: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ],
    districtId: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ],
    customerId: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ]
})

const addItemRules = reactive<FormRules<any>>({
    itemId: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ],
    quantity: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ],
    supplierId: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ]
})

const delItem = (itemId: number) => {
    neworderParam.items = neworderParam.items.filter(item => item.itemId !== itemId)
}

const addItem = () => {
    newItem.itemId = null
    newItem.quantity = null
    newItem.supplierId = null
    addItemVis.value = true
}

const cancelAddItem = () => {
    addItemVis.value = false
    itemForm.value?.clearValidate()
}

const onAddItem = async () => {
    try {
        await itemForm.value!.validate()
        if (neworderParam.items.some(item => item.itemId === newItem.itemId)) {
            ElNotification.error({
                message: '已经添加过此id的条目了'
            })
            return
        }
        neworderParam.items.push({
            itemId: newItem.itemId,
            supplierId: newItem.supplierId,
            quantity: newItem.quantity
        })
        addItemVis.value = false
    } catch {
        return
    }
}

const onSubmit = async () => {
    try {
        await formRef.value!.validate()
        try {
            newOrderRes.value = null
            const loading = ElLoading.service({
                lock: true,
                text: '添加中',
            })
            const { data } = await addOrder(neworderParam)
            newOrderRes.value = data.data
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

const onCancel = () => {
    neworderParam.customerId = null
    neworderParam.districtId = null
    neworderParam.warehouseId = null
    neworderParam.items = []
    formRef.value?.clearValidate()
}

</script>

<template>
    <div class="title">新增订货交易</div>
    <div class="main">
        <div class="new-order">
            <el-form ref="formRef" :rules="rules" label-width="auto" :model="neworderParam">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="warehouseId" prop="warehouseId">
                            <el-input v-model="neworderParam.warehouseId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="districtId" prop="districtId">
                            <el-input v-model="neworderParam.districtId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="customerId" prop="customerId">
                            <el-input v-model="neworderParam.customerId"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="items">
                    <el-button style="margin-right: 10px;" @click="addItem">新增条目</el-button>
                </el-form-item>
                <div class="add-item-form" v-show="addItemVis === true">
                    <el-form :rules="addItemRules" ref="itemForm" style="width: 100%;" :model="newItem">
                        <el-row :gutter="10">
                            <el-col :span="8"><el-form-item label="itemId" prop="itemId"><el-input
                                        v-model="newItem.itemId"></el-input></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="supplierId" prop="supplierId"><el-input
                                        v-model="newItem.supplierId"></el-input></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="quantity" prop="quantity"><el-input
                                        v-model="newItem.quantity"></el-input></el-form-item></el-col>
                        </el-row>
                    </el-form>
                    <div class="add-item-btn">
                        <el-button @click="onAddItem">添加</el-button>
                        <el-button @click="cancelAddItem" type="info">取消</el-button>
                    </div>
                </div>
                <el-table :data="neworderParam.items" :header-cell-style="{ textAlign: 'center' }"
                    style="width: 100%; margin-top: 20px;">
                    <el-table-column prop="itemId" label="itemId"></el-table-column>
                    <el-table-column prop="supplierId" label="supplierId"></el-table-column>\
                    <el-table-column prop="quantity" label="quantity"></el-table-column>
                    <el-table-column label="操作">
                        <template #default="scoped">
                            <el-button type="text" @click="delItem(scoped.row.itemId)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div class="btns">
                <el-button type="primary" @click="onSubmit">提 交</el-button>
                <el-button type="info" @click="onCancel">取 消</el-button>
            </div>
        </div>
        <div class="result" v-if="newOrderRes !== null">
            <el-divider></el-divider>
            <div class="order-detail">
                <div class="sub-title">订单详情</div>
                <div class="content">
                    orderId: {{ newOrderRes.customerId }} &nbsp;
                    warehouseId: {{ newOrderRes.warehouseId }} &nbsp;
                    districtId: {{ newOrderRes.districtId }} &nbsp;
                    customerId: {{ newOrderRes.customerId }} &nbsp;
                    totalAmount: {{ newOrderRes.totalAmount }} <br>
                    entryDate: {{ new Date(newOrderRes.entryDate).toLocaleString() }}
                </div>
                <div class="content">items:</div>
                <el-table :data="newOrderRes.items">
                    <el-table-column prop="itemId" label="itemId" width="80"></el-table-column>
                    <el-table-column prop="itemName" label="itemName"></el-table-column>
                    <el-table-column prop="supplierId" label="supplierId" width="100"></el-table-column>
                    <el-table-column prop="quantity" label="quantity" width="100"></el-table-column>
                    <el-table-column prop="amount" label="amount"></el-table-column>
                    <el-table-column prop="stockStatus" label="stockStatus" width="120"></el-table-column>
                    <el-table-column prop="brand" label="brand"></el-table-column>
                </el-table>
            </div>
            <div class="order-analyze">
                <div class="sub-title">事务分析</div>
                <div class="content">
                    execution time: {{ newOrderRes.executionTimeMs }} ms
                </div>
                <div class="content">detail:</div>
                <el-table :data="newOrderRes.sqlDetails">
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

.new-order {
    .add-item-form {
        display: flex;
        justify-content: center;
        text-align: center;
        flex-direction: column;
    }
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