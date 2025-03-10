<script lang="ts" setup>
import { ElCard } from 'element-plus';
import { ref } from 'vue';

const username = ref('')
const password = ref('')
const password_ = ref('')
const mainBtn = ref('登录')
const secondBtn = ref('注册')
const isRegis = ref(false)

const onSecBtnClick = () => {
    isRegis.value = !isRegis.value
    let tmp = mainBtn.value
    mainBtn.value = secondBtn.value
    secondBtn.value = tmp
}

</script>

<template>
    <div class="wrapper" style="background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);">
        <el-card class="login">
            <div class="container">
                <div class="header">
                    电商数据管理系统
                </div>
                <div v-if="isRegis" class="header2">
                    新用户注册
                </div>
                <div class="body">
                    <div class="inputbox">
                        <div class="text">
                            <el-input v-model="username" placeholder="用户名" clearable>
                                <template #prefix>
                                    <i class="fa-solid fa-user" style="color: #418dda;"></i>
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <div class="inputbox">
                        <div class="text">
                            <el-input v-model="password" placeholder="密码" show-password>
                                <template #prefix>
                                    <i class="fa-solid fa-lock" style="color: #418dda;"></i>
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <div class="inputbox" v-show="isRegis">
                        <div class="text">
                            <el-input v-model="password_" placeholder="确认密码" show-password>
                                <template #prefix>
                                    <i class="fa-solid fa-square-check" style="color: #418dda;"></i>
                                </template>
                            </el-input>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <div class="main-btn">
                        <el-button style="width: 100%;" type="primary" plain>{{ mainBtn }}</el-button>
                    </div>
                    <div class="second-btn">
                        <el-button type="primary" @click="onSecBtnClick" link>{{ secondBtn }}</el-button>
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
        padding: 20px;

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

.header2 {
    font-size: 30px;
    color: $primary-color;
    text-align: center;
}

.body {
    padding: 10px;

    .inputbox {
        margin: 20px 0 0 0;
        height: 40px;

        .text {
            width: 100%;
            height: 100%;
            flex: 1;

            .el-input {
                height: 100%;
                font-size: 18px;
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

    .main-btn {
        width: 80%;
        height: 50px;
        padding: 12px 20px;

        .el-button {
            height: 100%;
            font-size: 18px;
        }
    }

    .second-btn {
        text-align: center;
        width: 100%;
    }
}
</style>