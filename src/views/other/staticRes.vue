<template>
    <el-card>
        <template #header>静态文件</template>
        <el-form inline :model="record" v-loading="loading" :disabled="!hasEditAuthroize" :rules="rules">
            <el-form-item label="静态文件路径(留空使用本地资源)">
                <el-input v-model="record.path" />
            </el-form-item>
            <el-form-item label="版本号(修改该版本号可刷新静态文件缓存)" prop="version">
                <el-input v-model="record.version" />
            </el-form-item>
            <br>
            <el-button type="primary" @click="submit" v-if="hasEditAuthroize">保存</el-button>
        </el-form>
        <el-row>

        </el-row>
    </el-card><br>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import otherApi from '@/api/other'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

export default defineComponent({
    data() {
        const userStore = useUserStore()
        const hasEditAuthroize = userStore.hasAuthorize("/other/staticRes/edit")
        const rules = {
            version: [{ required: true, pattern: /\S+/, message: '不得为空', trigger: 'blur' }]
        }
        return {
            hasEditAuthroize,
            loading: true,
            record: {
            } as any,
            rules

        }
    },
    methods: {
        async init() {
            this.loading = true
            let result = await otherApi.getStaticRes()
            Object.assign(this.record, result.data.record)
            this.loading = false
        },
        submit() {
            this.loading = true
            let postData = Object.assign({}, this.record)
            otherApi.editStaticRes(postData).then(() => {
                ElMessage.success('保存成功')
                this.init()

            }).finally(() => { this.loading = false })
        }
    },

    mounted() {
        this.init()
    },
    setup() {
    }
})
</script>
  
<style lang="scss" scoped></style>