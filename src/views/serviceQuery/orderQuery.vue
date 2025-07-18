<script lang="ts" setup>
import { exportShipPrior, getShipPrior } from '@/api/serviceQuery';
import { IShipPriorQuery, IShipPriorRes } from '@/typings/service';
import { ElLoading, ElNotification, FormInstance, FormRules } from 'element-plus';
import { nextTick, reactive, ref, watch } from 'vue';
import * as echarts from 'echarts'

const formRef = ref<FormInstance>()
const loading = ref(false)

const rules = reactive<FormRules<any>>({
    marketSegment: [
        { required: true, message: '必须填写', trigger: 'blur' }
    ],
    dateGroup: [
        {
            required: true,
            validator: (rule, value, callback) => {
                if (!queryParam.orderDateBefore || !queryParam.shipDateAfter) {
                    callback(new Error('两个日期都必须填写'))
                } else {
                    callback()
                }
            },
            trigger: 'change',
        },
    ],
})

const queryParam = reactive<IShipPriorQuery>({
    marketSegment: '',
    shipDateAfter: '',
    orderDateBefore: '',
    orderlimit: null
})
const queryRes = ref<IShipPriorRes>({
    count: 0,
    orders: [],
    executionTimeMs: 0,
    throughputQPS: 0,
    avgLatencyMs: 0
})

const exportPath = ref('')
const dialogVisible = ref(false)

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
    const { data } = await exportShipPrior(queryRes.value, exportPath.value)
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

const resizeChart = () => {
    lineChartInstance?.resize()
}

const activeName = ref('1')

const handleQuery = async () => {
    try {
        await formRef.value!.validate()
        try {
            loading.value = true
            const { data } = await getShipPrior(queryParam)
            queryRes.value = data.data
            console.log(queryRes.value)
            loading.value = false
            renderChart()
            window.addEventListener('resize', resizeChart)
        } catch (e) {
            console.log(e)
        }
    } catch {
        return
    }
}

const resetQuery = () => {
    queryParam.marketSegment = ''
    queryParam.shipDateAfter = ''
    queryParam.orderDateBefore = ''
    queryParam.orderlimit = null
    formRef.value?.clearValidate()
}

// 折线图容器 ref
const lineChartRef = ref<HTMLElement | null>(null)
const barChartRef = ref<HTMLElement | null>(null)

let lineChartInstance: echarts.ECharts | null = null
let barChartInstance: echarts.ECharts | null = null

const initBarChart = () => {
    if (!barChartRef.value) return

    if (!barChartInstance) {
        barChartInstance = echarts.init(barChartRef.value)
    }

    const orders = queryRes.value.orders
    const sortedOrders = [...orders].sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime())

    const xAxisData = sortedOrders.map(item => item.orderDate)
    const seriesData = sortedOrders.map(item => item.revenue)

    barChartInstance.setOption({
        title: {
            text: '订单收入柱状图',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            name: '收入'
        },
        series: [{
            name: '收入',
            type: 'bar',
            data: seriesData,
            itemStyle: {
                color: '#73C0DE'
            }
        }]
    })

    barChartInstance.resize()
}

const renderChart = () => {
    if (!lineChartRef.value) return

    if (!lineChartInstance) {
        lineChartInstance = echarts.init(lineChartRef.value)
    }

    const orders = queryRes.value.orders

    const option = {
        title: {
            text: '订单收益随时间变化',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: orders.map(item => item.orderDate)
        },
        yAxis: {
            type: 'value',
            name: '收益'
        },
        series: [
            {
                name: '收益',
                type: 'line',
                data: orders.map(item => item.revenue),
                smooth: true,
                symbol: 'circle',
                lineStyle: {
                    width: 2
                },
                itemStyle: {
                    color: '#409EFF'
                }
            }
        ]
    }

    lineChartInstance.setOption(option)
}

// 监听数据变化重新渲染图表
watch(activeName, async (val) => {
    if (val === '3') {
        await nextTick()
        if (!barChartInstance && barChartRef.value) {
            barChartInstance = echarts.init(barChartRef.value)
        }
        barChartInstance?.resize()
        initBarChart()
    } else if (val === '2') {
        await nextTick()
        if (!lineChartInstance && lineChartRef.value) {
            lineChartInstance = echarts.init(lineChartRef.value)
        }
        lineChartInstance?.resize()
        renderChart()
    }
})

</script>

<template>
    <div class="title">运输优先级查询</div>
    <div class="main">
        <el-dialog title="导出表" v-model="dialogVisible">
            <div>
                <el-input style="margin-bottom: 20px;" v-model="exportPath" placeholder="输入导出路径"></el-input>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button @click="cancelExport">取 消</el-button>
                <el-button type="primary" @click="submitExport">确 定</el-button>
            </div>
        </el-dialog>
        <div class="form">
            <el-form :model="queryParam" :rules="rules" ref="formRef" label-width="auto" style="max-width: 600px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户市场领域" prop="marketSegment">
                            <el-input v-model="queryParam.marketSegment" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="查询数量" prop="orderlimit">
                            <el-input v-model="queryParam.orderlimit" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="日期" prop="dateGroup">
                    <el-row :gutter="20">
                        <el-col :span="11">
                            <el-date-picker v-model="queryParam.orderDateBefore" value-format="YYYY-MM-DD" type="date"
                                placeholder="orderDateBefore" style="width: 100%" />
                        </el-col>
                        <el-col :span="11">
                            <el-date-picker v-model="queryParam.shipDateAfter" value-format="YYYY-MM-DD" type="date"
                                placeholder="shipDateAfter" style="width: 100%" />
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div style="text-align: center;">
                <el-button type="primary" @click="handleQuery">查询</el-button>
                <el-button type="info" @click="resetQuery">重置</el-button>
            </div>
        </div>
        <div v-show="queryRes.count > 0">
            <el-divider></el-divider>
            <div class="sub-title">查询性能: </div>
            <div class="content">
                <span class="sec-title">执行时长: </span>{{ queryRes.executionTimeMs }}ms &nbsp;
                <span class="sec-title">吞吐量(QPS): </span>{{ queryRes.throughputQPS.toFixed(3) }}次/s &nbsp;
                <span class="sec-title">平均延迟时间: </span> {{ queryRes.avgLatencyMs.toFixed(5) }}ms
            </div>
            <div class="btns">
                <el-button type="primary" @click="onExport">导出结果</el-button>
            </div>
            <el-divider></el-divider>
        </div>
        <div class="tab" v-show="queryRes.count > 0">
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="1"></el-tab-pane>
                <el-tab-pane label="折线图" name="2"></el-tab-pane>
                <el-tab-pane label="柱状图" name="3"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="data">
            <el-empty v-if="queryRes.count === 0 && loading === false" description="无内容"></el-empty>
            <div v-else>
                <div class="basic" v-show="activeName === '1'">
                    <el-table v-loading="loading" :data="queryRes.orders" row-key="orderKey" style="width: 100%">
                        <el-table-column prop="orderKey" label="订单key"></el-table-column>
                        <el-table-column prop="revenue" label="总潜在收入"></el-table-column>
                        <el-table-column prop="orderDate" label="下单日期"></el-table-column>
                        <el-table-column prop="shipPriority" label="运输优先级"></el-table-column>
                    </el-table>
                </div>
                <div class="line-chart" v-show="activeName === '2'" ref="lineChartRef"
                    style="width: 100%; height: 400px;">
                </div>
                <div class="bar-chart" v-show="activeName === '3'" ref="barChartRef"
                    style="width: 100%; height: 400px;">
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main {
    .form {
        margin-top: 20px;
    }

    .tab {
        margin-top: 20px;
    }
}

.line-chart,
.bar-chart {
    padding: 10px;
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
</style>