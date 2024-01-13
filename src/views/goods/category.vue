<template>
    <el-dialog v-model="dialogVisible" :title="form.id === null ? '新建菜单' : '修改菜单'" width="700"
        @close="formRef.clearValidate()">
        <el-form label-width="78px" :model="form" :rules="rules" inline ref="formRef">

            <el-row>
                <el-col :span="12">
                    <el-form-item label="上级">
                        <el-cascader v-model="parentId" :options="parentRows" :props="parentMenuProps" style="width:218px"
                            clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="排序" required>
                        <el-input-number v-model="form.orderNum" :min="1" :max="999" style="width:218px" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name" placeholder="名称" style="width:218px" />
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="显示状态" required>
                        <el-radio-group v-model="form.visibility" style="width:218px">
                            <el-radio :label="true">显示</el-radio>
                            <el-radio :label="false">隐藏</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="首页推荐" required>
                        <el-radio-group v-model="form.homepage" style="width:218px">
                            <el-radio :label="true">启用</el-radio>
                            <el-radio :label="false">停用</el-radio>
                        </el-radio-group>
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
        <el-button type="primary" plain @click="add" v-if="userStore.hasAuthorize('/goods/category/add')">新增</el-button>
        <el-button type="info" plain @click="expand" icon="Sort">展开/折叠</el-button>
    </el-row><br>
    <el-table v-loading="loading" :data="rows" style="width: 100%; margin-bottom: 20px" row-key="id" size="large"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" ref="tableRef">
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="id" label="id" width="65" />
        <el-table-column align="center" prop="orderNum" label="排序" width="100" />
        <el-table-column align="right" label="状态&emsp;" width="140">
            <template #default="scope">
                <el-tag type="success" size="small" v-if="scope.row.homepage">首页</el-tag>&ensp;
                <el-tag type="success" size="small" v-if="scope.row.visibility">显示</el-tag>
                <el-tag type="warning" size="small" v-if="!scope.row.visibility">隐藏</el-tag>
            </template>
        </el-table-column>
        <el-table-column align="right" label="操作&emsp;&emsp;&emsp;&emsp;" width="210">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="add(scope.row)" :icon="Plus"
                    v-if="userStore.hasAuthorize('/goods/category/add')">新增</el-button>
                <el-button link type="primary" size="small" @click="edit(scope.row)" :icon="Edit"
                    v-if="userStore.hasAuthorize('/goods/category/edit')">编辑</el-button>
                <el-button link type="primary" size="small" @click="del(scope.row)" :icon="Delete"
                    v-if="userStore.hasAuthorize('/goods/category/delete')">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { CascaderOption, ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { Delete, Edit, Plus, Sort } from '@element-plus/icons-vue'
import goodsApi from '@/api/goods'
import { useUserStore } from '@/stores/user'

export default defineComponent({

    data() {
        const FORM_EMPTY = {
            id: null,
            name: '',
            homepage: false,
            orderNum: 1,
            parentId: '0',
            visibility: true
        }
        const form = Object.assign({}, FORM_EMPTY)
        const parentMenuProps = {
            checkStrictly: true,
        }
        const parentRows: CascaderOption[] = []
        const result: any = {}
        const rows: any = []
        const rules = reactive<FormRules>({
            name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        })
        return {
            FORM_EMPTY: FORM_EMPTY,
            dialogVisible: false,
            expandVal: ref(false),
            form,
            loading: true,
            parentId: '0',
            parentMenuProps,
            parentRows,
            result,
            rows,
            rules,
            userStore: useUserStore()
        }
    },
    methods: {
        add(parent: any) {
            this.form = Object.assign({}, this.FORM_EMPTY)
            this.parentId = parent == undefined ? '0' : parent.id
            this.dialogVisible = true
        },
        del(row: any) {
            var itemName = ''
            switch (row.type) {
                case 1:
                    itemName = '目录'
                    break;
                case 2:
                    itemName = '菜单'
                    break;
                case 3:
                    itemName = '按钮'
                    break;

                default:
                    break;
            }
            ElMessageBox.confirm(
                `确认删除 ${itemName} ${row.name}`,
                'Warning', { type: 'warning', })
                .then(() => {
                    goodsApi.deleteCategory(row).then(() => {
                        this.dialogVisible = false
                        ElMessage.success('删除成功')
                        this.init()
                    }).catch(() => { })
                })
                .catch(() => { ElMessage.info('删除已取消') })
        },
        edit(row: any) {
            Object.assign(this.form, row)
            this.parentId = row.parentId
            this.dialogVisible = true
        },
        expand() {
            this.expandVal = !this.expandVal
            for (const row of this.tableRef.data) {
                this.expandRow(row)
            }
        },
        expandRow(row: any) {
            this.tableRef.toggleRowExpansion(row, this.expandVal)
            if (row.children.length > 0) for (const row1 of row.children) this.expandRow(row1)

        },
        async init() {
            let result: any = await goodsApi.getCategoryList({})
            this.result = {}
            this.result = Object.assign(this.result, result)
            this.parentRows = []
            this.rows = []
            for (let row of this.result.data.rows) {
                if (row.parentId === 0) {
                    this.parentRows.push({ label: row.name, value: row.id })
                    this.rows.push(Object.assign({}, row))
                }
            }
            for (let i = 0; i < this.rows.length; i++) {
                this.recursion(this.parentRows[i], this.rows[i])
            }
            this.loading = false
        },
        // recursion render tree
        recursion(parentItem: CascaderOption, rowsItem: any,) {
            parentItem.children = []
            rowsItem.children = []
            for (let row of this.result.data.rows) {
                if (row.parentId === rowsItem.id) {
                    rowsItem.children.push(Object.assign({}, row))
                    parentItem.children.push({ label: row.name, value: row.id })
                }
            }
            for (let i = 0; i < rowsItem.children.length; i++) {
                this.recursion(parentItem.children[i], rowsItem.children[i])
            }
        },
        submit() {
            this.formRef.validate((valid: boolean) => {
                if (!valid) return
                if (Array.isArray(this.parentId)) this.form.parentId = this.parentId[this.parentId.length - 1]
                else this.form.parentId = this.parentId
                let data: any = Object.assign({}, this.form)
                if (data.parentId == undefined) data.parentId = 0
                delete data.children
                const save = data.id == null ? goodsApi.addCategory : goodsApi.editCategory
                save(data).then(() => {
                    this.dialogVisible = false
                    ElMessage({
                        showClose: true,
                        message: '保存完成',
                        type: 'success',
                    })
                    this.init()
                }).catch(() => {

                })
            })
        }
    },
    mounted() {
        this.init()
    },
    setup() {
        return {
            Delete,
            Edit,
            Plus,
            Sort,
            formRef: null as any,
            tableRef: null as any
        }
    }
})
</script>

<style lang="scss" scoped></style>