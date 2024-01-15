<template>
    <el-card>
        <template #header>包邮规则</template>
        <el-form inline :model="record" v-loading="loading" :disabled="!hasEditAuthroize">
            <el-form-item label="包邮规则">
                <el-switch v-model="record.enable" active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item label="包邮金额(元)">
                <el-input-number :controls="false" :precision="2" v-model="record.amount" :step="0.01" :min="0"
                :value-on-clear="0" />
            </el-form-item>
            <el-form-item label="排除地区">
                <el-select v-model="record.exclude" multiple placeholder="请选择" style="width: 240px">
                    <el-option v-for="item in provinces" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
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
import expressApi from '@/api/express'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { priceFormat, priceToNumber } from '@/utils'

export default defineComponent({
    data() {
        const userStore = useUserStore()
        const hasEditAuthroize = userStore.hasAuthorize("/express/freeRule/edit")
        return {
            hasEditAuthroize,
            loading: true,
            provinces: [] as any,
            record: {
                amount: 0 as number,
                enable: false,
                exclude: ''
            } as any,

        }
    },
    methods: {
        async init() {
            this.loading = true
            let result = await expressApi.getFreeRule()
            Object.assign(this.record, result.data.record)
            this.record.amount = Number(priceFormat(this.record.amount))
            Object.assign(this.provinces, result.data.provinces)
            this.loading = false
        },
        submit() {
            this.loading = true
            let postData = Object.assign({}, this.record)
            postData.amount = priceToNumber(postData.amount)
            expressApi.editFreeRule(postData).then(() => {
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