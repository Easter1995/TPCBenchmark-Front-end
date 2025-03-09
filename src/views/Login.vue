<script lang="ts" setup>
import { ElCard } from 'element-plus';
import { ref } from 'vue';

const username = ref('')
const password = ref('')
</script>

<template>
    <div class="wrapper" style="background-color: rgb(98 176 255 / 62%);">
        <el-card class="login">
            <div class="container">
                <div class="header">
                    电商数据管理系统
                </div>
                <div class="body">
                    <div class="inputbox">
                        <div><i class="fa-solid fa-user" style="color: #418dda;"></i></div>
                        <div class="text">
                            <el-input v-model="username" placeholder="用户名" clearable />
                        </div>
                    </div>
                    <div class="inputbox">
                        <div><i class="fa-solid fa-lock" style="color: #418dda;"></i></div>
                        <div class="text">
                            <el-input v-model="password" placeholder="密码" show-password />
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <div class="login-btn">
                        <el-button style="width: 100%;" type="primary" plain>登 录</el-button>
                    </div>
                    <div class="register-btn">
                        <el-button type="primary" link>注 册</el-button>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<style lang="scss" scoped>
$primary-color: #48a3ffe3;

.wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .login {
        border-radius: 5%;

        .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    }
}

.header {
    font-size: 38px;
    color: $primary-color;
    text-align: center;
}

.body {
    padding: 10px;

    .inputbox {
        display: flex;
        flex-direction: row;
        gap: 10px;
        margin: 20px 0 0 0;
        height: 40px;

        .text {
            font-size: 18px;
            width: 100%;
            height: 100%;
            flex: 1;

            .el-input {
                height: 100%;
            }
        }
    }
}

.footer {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .login-btn {
        width: 80%;
        height: 50px;
        padding: 12px 20px;
        .el-button {
            height: 100%;
        }
    }

    .register-btn {
        text-align: center;
        width: 100%;
    }
}
</style>