<script lang="ts" setup>
import { reactive } from 'vue';

const form = reactive({
    name: '',
})

</script>

<template>
    <div class="container">
        <el-form ref="form" :model="form" label-width="auto">
            <el-form-item label="表名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>

</style>
