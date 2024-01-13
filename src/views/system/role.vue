<template>
    <el-dialog v-model="dialogVisible" :title="form.id === null ? '新建角色' : '修改角色'" width="460" @close="dialogClose">

        <el-form label-width="78px" :model="form" :rules="rules" inline ref="formRef">

            <el-row>
                <el-col :span="24">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name" placeholder="名称" style="width:328px" />
                    </el-form-item>
                    <el-form-item label="排序" required>
                        <el-input-number v-model="form.orderNum" :min="1" :max="999" style="width:328px" />
                    </el-form-item>

                    <el-form-item label="使用状态" required>
                        <el-radio-group v-model="form.enable" style="width:328px">
                            <el-radio :label="true">启用</el-radio>
                            <el-radio :label="false">停用</el-radio>
                        </el-radio-group>
                    </el-form-item>


                    <el-form-item label="菜单权限" required>
                        <div style="display:flex; width:328px">
                            <el-checkbox v-model="expandAll" label="展开/折叠"></el-checkbox>
                            <el-checkbox v-model="selectAll" label="全选/全不选"></el-checkbox>
                        </div>
                    </el-form-item>
                    <el-form-item label="&nbsp;">

                        <el-tree class="bordered" :data="treeData" :default-checked-keys="form.checkedKeys" show-checkbox
                            node-key="id" :props="defaultProps" ref="treeRef" />
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
        <el-button type="primary" plain @click="add" v-if="userStore.hasAuthorize('/system/role/delete')">新增</el-button>
    </el-row><br>
    <el-table v-loading="loading" :data="rows" style="max-width: 100%; margin-bottom: 20px" row-key="id" default-expand-all
        size="large" :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
        <el-table-column prop="name" label="角色名称" />
        <el-table-column align="center" prop="orderNum" label="排序" width="160" />
        <el-table-column align="center" label="状态" width="120">
            <template #default="scope">
                <el-tag type="success" size="small" v-if="scope.row.enable">启用</el-tag>
                <el-tag type="warning" size="small" v-if="!scope.row.enable">停用</el-tag>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="210">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="edit(scope.row)" :icon="Edit"
                    v-if="userStore.hasAuthorize('/system/role/edit') && scope.row.id !== 1">编辑</el-button>
                <el-button link type="primary" size="small" @click="del(scope.row)" :icon="Delete"
                    v-if="userStore.hasAuthorize('/system/role/delete') && scope.row.id !== 1">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import systemApi from '@/api/system'
import { useUserStore } from '@/stores/user'


export default defineComponent({
    data() {
        const FORM_EMPTY = {
            id: null,
            name: '',
            enable: true,
            orderNum: 1,
            authorize: '',
            checkedKeys: []
        }
        const form = Object.assign({}, FORM_EMPTY)
        const result: any = {}
        const rows: any = []
        const rules = reactive<FormRules>({
            name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        })
        return {
            FORM_EMPTY,
            dialogVisible: false,
            form,
            loading: true,
            result,
            rows,
            treeData: [] as any[],
            rules,
            userStore: useUserStore()
        }
    },
    methods: {
        add() {
            this.form = Object.assign({}, this.FORM_EMPTY)
            if (this.treeRef) this.treeRef.setCheckedNodes([])
            this.dialogVisible = true
        },
        del(row: any) {
            ElMessageBox.confirm(
                `确认删除角色 ${row.name}`, 'Warning', { type: 'warning' })
                .then(() => {
                    systemApi.deleteRole(row).then(() => {
                        this.dialogVisible = false
                        ElMessage.success('删除成功')
                        this.init()
                    }).catch(() => { })
                }).catch(() => {
                    ElMessage.info('删除已取消')
                })
        },
        dialogClose(){
            this.expandAll = false
            this.selectAll = false
            if (this.formRef) this.formRef.clearValidate()
        },
        edit(row: any) {
            Object.assign(this.form, row)
            this.form.checkedKeys = row.authorize.split(",")
            if (this.treeRef) this.treeRef.setCheckedNodes(this.form.checkedKeys)
            this.dialogVisible = true
        },
        async init() {
            let result: any = await systemApi.getRoleList({})
            this.result = {}
            this.result = Object.assign(this.result, result)
            this.rows = result.data.rows
            this.treeData = result.data.treeData
            this.loading = false
        },

        submit() {
            this.formRef.validate((valid: boolean) => {
                if (!valid) return
                let data: any = Object.assign({}, this.form)
                data.authorize = ""
                for (const num of this.treeRef.getCheckedKeys()) data.authorize += num + ","
                delete data.checkedKeys
                const save = data.id == null ? systemApi.addRole : systemApi.editRole
                save(data).then(() => {
                    this.dialogVisible = false
                    ElMessage({
                        showClose: true,
                        message: '保存成功',
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
        const defaultProps = {
            children: 'children',
            label: 'label',
        }


        return {
            defaultProps,
            Delete,
            Edit,
            Plus,
            selectAll: ref(false),
            expandAll: ref(false),
            formRef: null as any,
            treeRef: null as any
        }
    },
    watch: {
        expandAll(val) {
            let recursion = (list: any[]) => {
                for (const row of list) {
                    this.treeRef.store.nodesMap[row.id].expanded = val
                    if (row.children && row.children.length > 0) recursion(row.children)
                }
            }
            recursion(this.treeData)
        },
        selectAll(val) {
            if (val) this.treeRef.setCheckedNodes(this.treeData)
            else this.treeRef.setCheckedNodes([])
        }
    }
})
</script>

<style lang="scss" scoped>
.bordered {
    border: 1px solid var(--el-border-color);
    margin-top: -1em;
    width: 328px;
}
</style>