<script lang="ts" setup>
import { IClientInfo, IClientInfoList } from '@/typings/service';
import { onMounted, reactive, ref } from 'vue';
import { Search, Back } from '@element-plus/icons-vue'
import { exportCliInfo, getClientInfo, getTableInfo } from '@/api/serviceQuery';
import { ElLoading, ElNotification } from 'element-plus';

interface Ifilter {
    text: string,
    value: string
}

onMounted(() => {
    getClientList()
    getNationName()
})

const getCliInfoParam = reactive({
    currentPage: 1,
    pageSize: 20,
    nationKeyword: '',
    nameKeyword: ''
})
const qCliName = ref('')
const qNName = ref('')

const isLoading = ref(false)
const clientInfos = ref<IClientInfoList[]>([])

const clientInfoDetail = ref<IClientInfoList | null>()
const showDetail = ref(false)

const clientInfoRes = ref<IClientInfo>({
    pageSize: 20,
    currentPage: 1,
    total: 0,
    clientInfoList: [],
    executionTimeMs: 0,
    throughputQPS: 0,
    avgLatencyMs: 0
})
const exportPath = ref('')
const dialogVisible = ref(false)
const nationFilter = ref<Ifilter[]>([])

const nationFilterHandler = (value: string, row: IClientInfoList) => {
    return value === row.nationName
}

const getClientList = async () => {
    isLoading.value = true
    const { data } = await getClientInfo(getCliInfoParam)

    clientInfos.value = data.data.clientInfoList
    clientInfoRes.value = data.data
    isLoading.value = false
    console.log(clientInfos.value)
}

const getNationName = async () => {
    const { data } = await getTableInfo('NATION')

    nationFilter.value = data.data.map((item: any) => {
        return {
            text: item.N_NAME,
            value: item.N_NAME
        }
    })
}

const handleSizeChange = (val: number) => {
    getCliInfoParam.currentPage = 1
    getCliInfoParam.pageSize = val
    getClientList()
}

const handleCurrentChange = (val: number) => {
    getCliInfoParam.currentPage = val
    getClientList()
}

const handleCliSearch = async () => {
    if (qCliName.value.trim() === '') {
        getCliInfoParam.nameKeyword = ''
        getCliInfoParam.nationKeyword = ''
        getCliInfoParam.currentPage = 1
    } else {
        getCliInfoParam.nameKeyword = qCliName.value
        getCliInfoParam.nationKeyword = ''
        getCliInfoParam.currentPage = 1
    }
    await getClientList()
    qCliName.value = ''
}

const handleNSearch = async () => {
    if (qNName.value.trim() === '') {
        getCliInfoParam.nameKeyword = ''
        getCliInfoParam.nationKeyword = ''
        getCliInfoParam.currentPage = 1
    } else {
        getCliInfoParam.nameKeyword = ''
        getCliInfoParam.nationKeyword = qNName.value
        getCliInfoParam.currentPage = 1
    }
    await getClientList()
    qNName.value = ''
}

const getCliDetail = (cuskey: number) => {
    clientInfoDetail.value = clientInfos.value.find(item => item.cuskey === cuskey) || null
    showDetail.value = true
}

const cancelDetail = () => {
    showDetail.value = false
}

const onExport = () => {
    exportPath.value = ''
    dialogVisible.value = true
}

const cancelExport = () => {
    dialogVisible.value = false
}

const submitExport = async () => {
    if (exportPath.value.trim() === '') {
        ElNotification.error({
            message: '路径不能为空'
        })
        return
    }
    const loading = ElLoading.service({
        lock: true,
        text: '导出中',
    })
    const { data } = await exportCliInfo(clientInfoRes.value, exportPath.value)
    loading.close()
    dialogVisible.value = false
    if (data) {
        ElNotification.success({
            message: `导出成功, 文件被保存在${exportPath.value}`
        })
    } else {
        ElNotification.error({
            message: '导出出错'
        })
    }
}

</script>

<template>
    <div class="title">客户查询</div>
    <div class="main" v-if="showDetail === false">
        <el-dialog title="导出表" v-model="dialogVisible">
            <div>
                <el-input style="margin-bottom: 20px;" v-model="exportPath" placeholder="输入导出路径"></el-input>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button @click="cancelExport">取 消</el-button>
                <el-button type="primary" @click="submitExport">确 定</el-button>
            </div>
        </el-dialog>
        <div class="search">
            <el-input v-model="qCliName" style="width: 300px" placeholder="search by client name" :prefix-icon="Search"
                @keyup.enter="handleCliSearch" />
            <el-input v-model="qNName" style="width: 300px" placeholder="search by nation name" :prefix-icon="Search"
                @keyup.enter="handleNSearch" />
        </div>
        <div class="table" style="width: 100%;">
            <div v-show="clientInfoRes.total > 0">
                <el-divider></el-divider>
                <div class="sub-title">查询性能: </div>
                <div class="content">
                    <span class="sec-title">执行时长: </span>{{ clientInfoRes.executionTimeMs }}ms &nbsp;
                    <span class="sec-title">吞吐量(QPS): </span>{{ clientInfoRes.throughputQPS.toFixed(5) }}次/s &nbsp;
                    <span class="sec-title">平均延迟时间: </span> {{ clientInfoRes.avgLatencyMs.toFixed(5) }}ms
                </div>
                <div class="btns">
                    <el-button type="primary" @click="onExport">导出结果</el-button>
                </div>
                <el-divider></el-divider>
            </div>
            <el-table :data="clientInfos" row-key="cuskey" v-loading="isLoading"
                :header-cell-style="{ textAlign: 'center' }" style="width: 100%; overflow-y: auto;" height="100%">
                <el-table-column label="index" width="80">
                    <template #default="scope">
                        {{ (clientInfoRes.currentPage - 1) * clientInfoRes.pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="cuskey" label="cuskey" width="80" />
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="nationName" label="国家" sortable :filters="nationFilter"
                    :filter-method="nationFilterHandler" />
                <el-table-column label="操作">
                    <template #default="scoped">
                        <el-button type="text" @click="getCliDetail(scoped.row.cuskey)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination layout="sizes, prev, pager, next" :page-sizes="[10, 20, 50, 100]"
                v-model:page-size="clientInfoRes.pageSize" v-model:current-page="clientInfoRes.currentPage"
                :total="clientInfoRes.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
    <div class="detail" v-if="showDetail">
        <div class="header" @click="cancelDetail">
            <el-icon>
                <Back />
            </el-icon>
            <div class="title">客户信息详情</div>
        </div>
        <div class="detail-main">
            <div class="row">
                <div class="col">cuskey: {{ clientInfoDetail?.cuskey }}</div>
                <div class="col">姓名: {{ clientInfoDetail?.name }}</div>
                <div class="col">账户余额: {{ clientInfoDetail?.acctbal }}</div>
            </div>
            <div class="row">
                <div class="col">电话: {{ clientInfoDetail?.phone }}</div>
            </div>
            <div class="row">
                <div class="col">地址: {{ clientInfoDetail?.address }}</div>
            </div>
            <div class="row">
                <div class="col">国家: {{ clientInfoDetail?.nationName }}</div>
                <div class="col">地区: {{ clientInfoDetail?.regionName }}</div>
            </div>
            <div class="row">
                <div class="col">市场领域: {{ clientInfoDetail?.mktsegment }}</div>
            </div>
            <div class="row">
                <div class="col">客户备注:<br> {{ clientInfoDetail?.comment }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;

    .search {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        padding-left: 30px;
        gap: 20px;
        margin-bottom: 10px;
    }
}

.detail {
    margin-top: 40px;

    .header {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        font-size: 16px;

        &:hover {
            color: var(--el-color-primary);
        }
    }

    .detail-main {
        padding: 20px;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        gap: 30px;

        .row {
            display: flex;
            gap: 30px;
            border-bottom: 2px solid #dbdbdb;
        }
    }
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