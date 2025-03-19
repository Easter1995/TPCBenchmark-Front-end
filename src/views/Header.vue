<script setup lang="ts">
import router from '@/router';
import { delUserInfo, getUserInfo } from '@/utils/user';
import { ElCard, ElMessageBox } from 'element-plus';
import { ref } from 'vue';

const { name, role } = getUserInfo()
const dialogVisible = ref(false)

const doLogout = () => {
    dialogVisible.value = false
    delUserInfo()
    router.replace('/login')
}
</script>

<template>
    <ElCard class="container">
        <div class="inner">
            <div class="user-info">
                <div class="role">{{ role }}</div>
            </div>
            <el-popover>
                <template #reference>
                    <div class="avatar">
                        <img src="../../public/static/avatar.jpg" alt="">
                    </div>
                </template>
                <template #default>
                    <div style="text-align: center;" class="name">{{ name }}</div>
                    <button class="logout-btn" @click="dialogVisible = true">退出登录</button>
                </template>
            </el-popover>
        </div>
    </ElCard>
    <el-dialog v-model="dialogVisible" title="Tips" width="500">
        <span>确定要退出登录吗？</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doLogout">
                    确 定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped lang="scss">
.inner {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .user-info {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10%;
    }
}

.avatar {
    height: 100%;

    img {
        height: 50px;
        width: auto;
        aspect-ratio: 1/1;
        border-radius: 50%;
    }
}

.logout-btn {
    width: 100%;
    height: 40px;
    text-align: center;
    border: none;
    transition: background-color 0.3s;
    border-radius: 5%;

    &:hover {
        cursor: pointer;
        background-color: #ebedee;
    }
}
</style>