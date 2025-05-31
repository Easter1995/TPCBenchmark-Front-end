<script setup lang="ts">
import { modifyConnection } from '@/api/systemmange';
import { IModifyQuery, IModifyRes } from '@/typings/system';
import { ElNotification } from 'element-plus';
import { reactive, ref } from 'vue';


const modifyParam = reactive<IModifyQuery>({
    variableName: '',
    timeout: ''
})

const loading = ref(false)
const res = ref<IModifyRes | null>(null)

const onSubmit = async () => {
    loading.value = true
    const { data } = await modifyConnection(modifyParam)
    loading.value = false
    if (data.data) {
        ElNotification.success({
            message: data.message
        })
        res.value = data.data
    } else {
        ElNotification.error({
            message: data.message
        })
    }
}

const onCancel = () => {
    modifyParam.timeout = ''
    modifyParam.variableName = ''
}

</script>

<template>
    <div class="title">修改timeout参数</div>
    <div class="main">
        <div class="param">
            <el-select v-model="modifyParam.variableName" placeholder="选择参数">
                <el-option :label="'wait_timeout'" :value="'wait_timeout'"></el-option>
                <el-option :label="'interactive_timeout'" :value="'interactive_timeout'"></el-option>
                <el-option :label="'connect_timeout'" :value="'connect_timeout'"></el-option>
            </el-select>
            <el-input v-model="modifyParam.timeout" placeholder="输入超时时间(ms)"></el-input>
        </div>
        <div class="btns">
            <el-button type="primary" @click="onSubmit">提 交</el-button>
            <el-button type="info" @click="onCancel">取 消</el-button>
        </div>
        <el-skeleton v-if="loading" animated :rows="2" />
        <div class="result" v-if="res !== null">
            <el-divider></el-divider>
            <div class="sub-title">修改结果:</div>
            <div class="content"> 
                <span class="sec-title">variableName: </span> {{ res.variableName }} &nbsp;
                <span class="sec-title">newValue: </span> {{ res.newValue }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.main {
    margin-top: 40px;

    .param {
        display: flex;
        gap: 30px;
        margin-bottom: 20px;
        justify-content: center;
        text-align: center;
        padding: 0 100px 0 100px
    }

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
</style>