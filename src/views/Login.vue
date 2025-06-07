<script lang="ts" setup>
import { ElCard, ElNotification } from 'element-plus';
import { nextTick, ref } from 'vue';
import { userLogin, userRegister } from '@/api/auth';
import { getUserInfo, writeUserInfo } from '@/utils/user';
import router from '@/router';

const username = ref('')
const password = ref('')
const password_ = ref('')
const mainBtn = ref('登录')
const secondBtn = ref('注册')
const isRegis = ref(false)

const clearInfo = () => {
    username.value = ''
    password.value = ''
    password_.value = ''
}

const onSecBtnClick = () => {
    isRegis.value = !isRegis.value
    let tmp = mainBtn.value
    mainBtn.value = secondBtn.value
    secondBtn.value = tmp
    clearInfo()
}

const doLogin = async () => {
    if (!username.value || !password.value) {
        ElNotification.error({
            title: '登录失败',
            message: '无效的用户名或密码',
        })
        return
    }
    try {
        const response = await userLogin(username.value, password.value);
        const { data: info, message, code } = response.data;
        if (code !== 200) {
            ElNotification.error({
                message
            })
            return
        } 
        // 写入用户信息
        writeUserInfo(info)
        // console.log('piniaUserInfo', getUserInfo())
        ElNotification({
            type: 'success',
            message,
            duration: 1000
        })
        await nextTick()
        router.replace('/datamanage/export')
    } catch (e) {
        console.log(e)
    }
}

const doRegister = async () => {
    if (!username.value || !password.value || !password_.value) {
        ElNotification.error({
            title: '注册失败',
            message: '无效的用户名或密码',
        })
        return
    } else if (password.value !== password_.value) {
        ElNotification.error({
            title: 'register failed',
            message: '两次输入的密码不一致'
        })
        return
    }
    try {
        const response = await userRegister(username.value, password.value)
        const { data: info, message } = response.data
        if (info !== null) {
                ElNotification({
                type: 'success',
                message,
                duration: 1000
            })
        } else {
            ElNotification.error({
                message
            })
        }
        
    } catch(e) {
        console.log(e)
    }
}

const doAction = () => {
    if (isRegis.value) doRegister()
    else doLogin()
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
                            <el-input v-model="username" placeholder="用户名" @keyup.enter="doAction" clearable>
                                <template #prefix>
                                    <i class="fa-solid fa-user" style="color: #418dda;"></i>
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <div class="inputbox">
                        <div class="text">
                            <el-input v-model="password" placeholder="密码" @keyup.enter="doAction" show-password>
                                <template #prefix>
                                    <i class="fa-solid fa-lock" style="color: #418dda;"></i>
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <div class="inputbox" v-show="isRegis">
                        <div class="text">
                            <el-input v-model="password_" placeholder="确认密码" @keyup.enter="doAction" show-password>
                                <template #prefix>
                                    <i class="fa-solid fa-square-check" style="color: #418dda;"></i>
                                </template>
                            </el-input>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <div class="main-btn" @click="doAction">
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
        width: 22%;
        min-width: 300px;
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