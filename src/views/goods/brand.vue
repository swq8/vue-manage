<template>
    <el-dialog v-model="dialogVisible" title="商品品牌" width="560" @close="formRef.clearValidate()">
        <el-form label-width="78px" :model="record" :rules="rules" inline ref="formRef" v-loading="formLoading">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="品牌名称" prop="name">
                        <el-input v-model="record.name" placeholder="品牌名称" style="width:328px" />
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="record.note" placeholder="备注" style="width:328px" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <el-row justify="start">
        <el-form :inline="true">
            <el-form-item label="名称">
                <el-input v-model="queryForm.name" placeholder="" @keydown.enter="init" clearable />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="init">查询</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-row justify="start">
        <el-button type="primary" plain @click="add" v-if="userStore.hasAuthorize('/goods/brand/add')">新建</el-button>
    </el-row><br>
    <el-table v-loading="loading" :data="result.data.rows" style="width: 100%; margin-bottom: 20px" row-key="id" border
        default-expand-all>
        <el-table-column prop="id" label="id" width="100" />
        <el-table-column prop="name" label="品牌名称" />
        <el-table-column prop="note" label="备注" />
        <el-table-column prop="address" label="操作" width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="edit(scope.row)"
                    v-if="userStore.hasAuthorize('/goods/brand/edit')">编辑</el-button>
                <el-button link type="primary" size="small" @click="del(scope.row)"
                    v-if="userStore.hasAuthorize('/goods/brand/delete')">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-row justify="end">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" v-model:current-page="query.page"
            v-model:page-size="query.pageSize" :page-count="result.data.totalPages" :page-sizes="[20, 50, 80, 100]"
            :total="result.data.totalRecords" />
    </el-row>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import goodsApi from '@/api/goods'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
    data() {
        const RECORD_EMPTY = {
            id: null,
            name: '',
            note: '',
        }
        const query: GeneralDto = {
            page: 1,
            pageSize: 20
        }
        const result: any = {
            data: {
                rows: [],
                totalPages: 0,
                totalRecords: 0
            }
        }
        const record = Object.assign({}, RECORD_EMPTY)
        const queryForm = {
            name: ''
        }
        const route = useRoute()
        Object.assign(queryForm, route.query)
        const rules = {
            name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        }
        return {
            dialogVisible: false,
            formLoading: false,
            loading: true,
            query,
            queryForm,
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
            ElMessageBox.confirm(`确认删除商品品牌 ${row.name}`, 'Warning', { type: 'warning', })
                .then(() => {
                    goodsApi.deleteBrand(row).then(() => {
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
            let query = Object.assign({}, this.queryForm, this.query)
            let result = await goodsApi.getBrandList(query)
            Object.assign(this.result, result)
            this.loading = false
        },

        submit() {
            this.formRef.validate((valid: boolean) => {
                if (!valid) return
                this.formLoading = true
                let save = this.record.id == null ? goodsApi.addBrand : goodsApi.editBrand
                save(this.record).then(() => {
                    this.dialogVisible = false
                    ElMessage.success('保存成功')
                    if (this.query.page !== 1) this.query.page = 1
                    else this.init()
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