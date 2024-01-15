<template>
    <el-dialog v-model="dialogVisible" title="修改支付" width="710" @close="formRef.clearValidate()">
        <el-form label-width="98px" :model="record" :inline="true" ref="formRef" v-loading="formLoading">

            <el-form-item label="名称" prop="name">
                <el-input v-model="record.name" disabled />
            </el-form-item>

            <el-form-item label="中文名称">
                <el-input v-model="record.nameCn" disabled />
            </el-form-item>
            <el-form-item label="最近修改">
                <el-input v-model="record.updateTime" disabled />
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="record.orderNum" :min="1" :max="999" style="width: 198px;" />
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="record.enable" style="width: 200px;">
                    <el-radio :label="true">启用</el-radio>
                    <el-radio :label="false">停用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label=" " style="width:298px">

            </el-form-item>
            <template v-if="record.name === 'alipay'">
                <el-form-item label="环境模式" required style="width: 94%;">
                    <el-radio-group v-model="record.sanBox" style="width: 200px;">
                        <el-radio :label="false">正式环境</el-radio>
                        <el-radio :label="true">沙箱模式</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="App ID" required style="width: 94%;">
                    <el-input v-model="record.appId" />
                </el-form-item>
                <el-form-item label="商户私钥" required style="width: 94%;">
                    <el-input :rows="4" type="textarea" v-model="record.merchantPrivateKey" />
                </el-form-item>
                <el-form-item label="支付宝公钥" required style="width: 94%;">
                    <el-input :rows="4" type="textarea" v-model="record.alipayPublicKey" />
                </el-form-item>
            </template>

            <template v-if="record.name === 'wechat'">
                <el-form-item label="App ID" required style="width: 94%;">
                    <el-input v-model="record.appId" />
                </el-form-item>
                <el-form-item label="私钥" required style="width: 94%;">
                    <el-input :rows="4" type="textarea" v-model="record.key1" />
                </el-form-item>
            </template>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <el-table v-loading="loading" :data="result.data.rows" style="width: 100%; margin-bottom: 20px" row-key="id" border
        default-expand-all>
        <el-table-column prop="id" label="id" width="100" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="nameCn" label="中文名称" />
        <el-table-column label="状态">
            <template #default="scope">
                <el-tag type="success" size="small" v-if="scope.row.enable">启用</el-tag>
                <el-tag type="warning" size="small" v-else>停用</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" />
        <el-table-column label="操作" width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="edit(scope.row)"
                    v-if="userStore.hasAuthorize('/system/payment/edit')">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import systemApi from '@/api/system'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
    data() {
        const RECORD_EMPTY = {
            id: null,
            name: '',
            note: '',
        }
        const result: any = {
            data: {
                rows: [],
            }
        }
        const record: any = Object.assign({}, RECORD_EMPTY)
        return {
            dialogVisible: false,
            formLoading: false,
            loading: true,
            record,
            RECORD_EMPTY,
            result,
            userStore: useUserStore()
        }
    },
    methods: {
        edit(row: any) {
            systemApi.getPayment({ name: row.name }).then((result: any) => {
                this.record = Object.assign({}, result.data.payment)
                this.dialogVisible = true
            })
        },
        async init() {
            this.loading = true
            let result = await systemApi.getPaymentList({})
            Object.assign(this.result, result)
            this.loading = false
        },

        submit() {
            this.formRef.validate((valid: boolean) => {
                if (!valid) return
                this.formLoading = true
                delete this.record.updateTime
                systemApi.editPayment(this.record).then(() => {
                    this.dialogVisible = false
                    ElMessage.success('保存成功')
                    this.init()
                }).finally(() => {
                    this.formLoading = false
                })
            })

        }
    },
    mounted() {
        this.init()
    },
    setup() {
        return {
            formRef: ref(null) as any
        }
    },

    watch: {
        query: {
            handler(val) {
                this.init()
            },
            deep: true
        }
    }
})
</script>

<style lang="scss" scoped></style>