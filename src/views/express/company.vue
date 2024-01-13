<template>
    <el-dialog v-model="dialogVisible" title="快递公司" width="560" @close="formRef.clearValidate()">
        <el-form label-width="78px" :model="record" :rules="rules" inline ref="formRef" v-loading="formLoading">
            <el-form-item label="名称" prop="name">
                <el-input v-model="record.name" placeholder="品牌名称" style="width:328px" />
            </el-form-item>
            <el-form-item label="状态" required>
                <el-radio-group v-model="record.enable" style="width:328px">
                    <el-radio :label="true">使用</el-radio>
                    <el-radio :label="false">停用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="网址">
                <el-input v-model="record.url" placeholder="网址" style="width:328px" />
            </el-form-item>
            <el-form-item label="排序" prop="orderNum" required>
                <el-input-number v-model="record.orderNum" :min="1" :max="999" style="width:328px" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>

    <el-row justify="start">
        <el-button type="primary" plain @click="add" v-if="userStore.hasAuthorize('/express/company/add')">新建</el-button>
    </el-row><br>
    <el-table v-loading="loading" :data="result.data.rows" style="width: 100%; margin-bottom: 20px" row-key="id" border
        default-expand-all>
        <el-table-column prop="id" label="id" width="100" />
        <el-table-column prop="name" label="公司名称" />
        <el-table-column label="状态">
            <template #default="scope">
                <el-tag type="success" v-if="scope.row.enable">使用</el-tag>
                <el-tag type="warning" v-else>停用</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="网址">
            <template #default="scope">
                <el-link :href="scope.row.url" v-text="scope.row.url" target="_blank"></el-link>
            </template>
        </el-table-column>

        <el-table-column prop="orderNum" label="排序" />
        <el-table-column prop="address" label="操作" width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="edit(scope.row)"
                    v-if="userStore.hasAuthorize('/express/company/edit')">编辑</el-button>
                <el-button link type="primary" size="small" @click="del(scope.row)"
                    v-if="userStore.hasAuthorize('/express/company/delete')">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import expressApi from '@/api/express'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
    data() {
        const RECORD_EMPTY = {
            id: null,
            name: '',
            url: '',
            enable: true,
            orderNum: 10
        }

        const result: any = {
            data: {
                rows: [],
            }
        }
        const record = Object.assign({}, RECORD_EMPTY)
        const rules = {
            name: [{ required: true, message: '请输入名称', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入名称', trigger: 'blur' }],
            orderNum: [{ required: true, pattern: /\S+/, message: '不得为空', trigger: 'blur' },
            { pattern: /\S+/, message: '不得为空', trigger: 'blur' }],
        }
        return {
            dialogVisible: false,
            formLoading: false,
            loading: true,
            record,
            RECORD_EMPTY,
            result,
            rules,
            userStore: useUserStore()
        }
    },
    methods: {
        add() {
            Object.assign(this.record, this.RECORD_EMPTY)
            this.dialogVisible = true
        },
        edit(row: any) {
            Object.assign(this.record, row)
            this.dialogVisible = true
        },
        del(row: any) {
            ElMessageBox.confirm(`确认删除快递公司 ${row.name}`, 'Warning', { type: 'warning', })
                .then(() => {
                    expressApi.deleteCompany(row).then(() => {
                        this.dialogVisible = false
                        ElMessage.success('删除成功')
                        this.init()
                    }).catch(() => { })
                }).catch(() => {
                    ElMessage.info('删除已取消')
                })
        },
        async init() {
            this.loading = true
            let result = await expressApi.getCompanyList({})
            Object.assign(this.result, result)
            this.loading = false
        },

        submit() {
            this.formRef.validate((valid: boolean) => {
                if (!valid) return
                this.formLoading = true
                let save = this.record.id == null ? expressApi.addCompany : expressApi.editCompany
                save(this.record).then(() => {
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
    }
})
</script>

<style lang="scss" scoped></style>