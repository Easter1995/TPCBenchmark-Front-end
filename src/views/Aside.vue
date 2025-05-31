<script setup lang="ts">
import router from '@/router'
import { getUserInfo } from '@/utils/user'
import {
    House,
    CircleCheck,
    Delete,
    PieChart,
    Service,
    FolderChecked,
    User,
    Setting,
    Upload,
    Download,
    Link,
    Tickets,
    Discount,
    Sunset,
    Apple,
    Operation
} from '@element-plus/icons-vue'

const userInfo = getUserInfo()

const backToHome = () => {
    router.push('/tpc')
}
</script>

<template>
    <div class="nav-container" style="height: 100%;">
        <button class="title" @click="backToHome">
            <el-icon>
                <House />
            </el-icon>
            <div class="text">电商数据管理系统 </div>
        </button>
        <el-menu router :default-active="$route.path" style="border: none; flex-grow: 1">
            <el-sub-menu v-if="userInfo.role === 'ADMIN'" index="1">
                <template #title>
                    <el-icon>
                        <setting />
                    </el-icon>
                    <span>系统管理</span>
                </template>
                <el-menu-item index="/sysmanage/connection">
                    <el-icon>
                        <Link />
                    </el-icon>
                    <span>数据库连接</span>
                </el-menu-item>
                <el-menu-item index="/sysmanage/variable">
                    <el-icon>
                        <FolderChecked />
                    </el-icon>
                    <span>数据库系统变量</span>
                </el-menu-item>
                <el-menu-item index="/sysmanage/status">
                    <el-icon>
                        <Sunset />
                    </el-icon>
                    <span>数据库状态变量</span>
                </el-menu-item>
                <el-menu-item index="/sysmanage/physical">
                    <el-icon>
                        <Apple />
                    </el-icon>
                    <span>数据库表物理信息</span>
                </el-menu-item>
                <el-menu-item index="/sysmanage/modify">
                    <el-icon>
                        <Operation />
                    </el-icon>
                    <span>修改timeout参数</span>
                </el-menu-item>
            </el-sub-menu>
            <el-sub-menu v-if="userInfo.role === 'ADMIN'" index="2">
                <template #title>
                    <el-icon>
                        <User />
                    </el-icon>
                    <span>用户管理</span>
                </template>
                <el-menu-item index="/usermanage">
                    <el-icon>
                        <CircleCheck />
                    </el-icon>
                    <span>用户审批</span>
                </el-menu-item>
                <el-menu-item index="/usermanage/delete">
                    <el-icon>
                        <Delete />
                    </el-icon>
                    <span>用户删除</span>
                </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
                <template #title>
                    <el-icon>
                        <PieChart />
                    </el-icon>
                    <span>数据管理</span>
                </template>
                <el-menu-item v-if="userInfo.role === 'ADMIN'" index="/datamanage/import">
                    <el-icon>
                        <Upload />
                    </el-icon>
                    <span>数据上传</span>
                </el-menu-item>
                <el-menu-item index="/datamanage/export">
                    <el-icon>
                        <Download />
                    </el-icon>
                    <span>数据导出</span>
                </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="4">
                <template #title>
                    <el-icon>
                        <Service />
                    </el-icon>
                    <span>业务查询</span>
                </template>
                <el-sub-menu index="tpch">
                    <template #title>
                        <el-icon>
                            <Tickets />
                        </el-icon>
                        <span>TPC-H 统计分析</span>
                    </template>
                    <el-menu-item index="/bussinessQuery/tpch/client">
                        <span>客户查询</span>
                    </el-menu-item>
                    <el-menu-item index="/bussinessQuery/tpch/order">
                        <span>运输优先级查询</span>
                    </el-menu-item>
                    <el-menu-item index="/bussinessQuery/tpch/part">
                        <span>小额订单收入查询</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="tpcc">
                    <template #title>
                        <el-icon>
                            <Discount />
                        </el-icon>
                        <span>TPC-C 事务查询</span>
                    </template>
                    <el-menu-item index="/bussinessQuery/tpcc/neworder">
                        <span>新增订货交易</span>
                    </el-menu-item>
                    <el-menu-item index="/bussinessQuery/tpcc/payment">
                        <span>更新账户余额</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-sub-menu>
            <!-- <el-sub-menu index="5">
                <template #title>
                    <el-icon>
                        <DataAnalysis />
                    </el-icon>
                    <span>业务分析</span>
                </template>
            </el-sub-menu> -->
        </el-menu>
    </div>
</template>

<style lang="scss" scoped>
.nav-container {
    display: flex;
    flex-direction: column;

    .text,
    .el-icon {
        color: #000000;
        transition: color 0.3s ease-in-out;
    }

    .text:hover,
    .el-icon:hover {
        color: #409eff;
    }
}

.title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 130%;
    padding: 20px;
    background-color: #fff;
    border: none;
    cursor: pointer;
}
</style>