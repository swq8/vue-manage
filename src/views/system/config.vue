<template>
    <el-form label-position="top" :model="record" v-loading="loading" :disabled="!hasEditAuthroize">
        <el-card>
            <template #header> 系统 </template>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="网站名称">
                        <el-input v-model="record.siteName" placeholder="网站名称" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="网址">
                        <el-input v-model="record.siteUrl" placeholder="网址" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="推荐搜索关键字(多个请用逗号 , 分割)">
                        <el-input v-model="record.keywords" placeholder="推荐搜索关键字(多个请用逗号 , 分割)" />
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="商品限购">
                        <el-input-number v-model="record.maxBuyNum" :min="0" style="width: 100%;" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="备案号">
                        <el-input v-model="record.beian" placeholder="备案号" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-card><br>

        <el-card>
            <template #header>存储</template>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="存储类型">
                        <el-select v-model="record.storageType" style="width:100%">
                            <el-option label="本地存储" value="local" />
                            <el-option label="阿里云oss" value="oss" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="oss-ak">
                        <el-input v-model="record.ossAk" placeholder="oss-ak" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="oss-aks">
                        <el-input v-model="record.ossAks" placeholder="oss-aks" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="oss-bucket">
                        <el-input v-model="record.ossBucket" placeholder="oss-bucket" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="oss-bucket-url">
                        <el-input v-model="record.ossBucketUrl" placeholder="oss-bucket-url" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="oss-endpoint">
                        <el-input v-model="record.ossEndpoint" placeholder="oss-endpoint" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-card><br>
        <el-card>
            <template #header>模板</template>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="电脑端模板">
                        <el-input v-model="record.themePc" placeholder="电脑端模板" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="移动端模板">
                        <el-input v-model="record.themeMobile" placeholder="移动端模板" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-card><br>
        <el-card>
            <template #header>前端加密</template>
            <el-row>
                <el-text>RSA密钥对请在数据库中修改(table:t_system，entity:sys, attribute: [rsaPrivateKey, rsaPublicKey])，点击当前页面保存按钮后立即生效。
                </el-text>
            </el-row>
        </el-card><br>
        <el-row justify="center">
            <el-button type="primary" @click="submit" v-if="hasEditAuthroize">保存</el-button>
        </el-row>
    </el-form>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import systemApi from '@/api/system'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

export default defineComponent({
    data() {
        const userStore = useUserStore()
        const hasEditAuthroize = userStore.hasAuthorize("/system/config/edit")
        return {
            hasEditAuthroize,
            loading: true,
            record: {
                "beian": '',
                "keywords": '',
                "maxBuyNum": 0,
                "siteName": '',
                "siteUrl": '',
                "storageType": '',
                "ossAk": '',
                "ossAks": '',
                "ossBucket": '',
                "ossBucketUrl": '',
                "ossEndpoint": '',
                "themeMobile": '',
                "themePc": '',
            } as any,

        }
    },
    methods: {
        async init() {
            this.loading = true
            let record = await systemApi.getConfig()
            Object.assign(this.record, record.data.record)
            this.loading = false
        },
        submit() {
            this.loading = true
            systemApi.editConfig(this.record).then(() => {
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
  
<style lang="scss" scoped>
.el-col {
    padding-right: 1em;
}
</style>