<template>
    <el-dialog v-model="dialogVisible" :title="form.id === null ? '新建菜单' : '修改菜单'" width="700" @close="formRef.clearValidate()">
        <el-form label-width="78px" :model="form" :rules="rules" inline ref="formRef">

            <el-row>
                <el-col :span="12">
                    <el-form-item label="上级">
                        <el-cascader v-model="parentId" :options="parentRows" :props="parentMenuProps" style="width:218px"
                            clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="类型" required>
                        <el-radio-group v-model="form.type">
                            <el-radio :value="1">目录</el-radio>
                            <el-radio :value="2">菜单</el-radio>
                            <el-radio :value="3">按钮</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.type == 1 || form.type == 2">
                    <el-form-item label="图标">
                        <el-icon-picker v-model="form.icon" abs="test" style="width:214px" />
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
                    <el-form-item label="路由地址" prop="route">
                        <el-input v-model="form.route" placeholder="路由地址" style="width:218px" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" v-if="form.type == 2">
                    <el-form-item label="组件路径" prop="component">
                        <el-input v-model="form.component" placeholder="组件路径" style="width:218px" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.type == 2">
                    <el-form-item label="是否缓存" required>
                        <el-radio-group v-model="form.cache" style="width:218px">
                            <el-radio :value="true">缓存</el-radio>
                            <el-radio :value="false">不缓存</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.type < 3">
                    <el-form-item label="显示状态" required>
                        <el-radio-group v-model="form.visible" style="width:218px">
                            <el-radio :value="true">显示</el-radio>
                            <el-radio :value="false">隐藏</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="使用状态" required>
                        <el-radio-group v-model="form.enable" style="width:218px">
                            <el-radio :value="true">启用</el-radio>
                            <el-radio :value="false">停用</el-radio>
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
        <el-button type="primary" plain @click="add" v-if="userStore.hasAuthorize('/system/menu/add')">新增</el-button>
        <el-button type="info" plain @click="expand" icon="Sort">展开/折叠</el-button>
    </el-row><br>
    <el-table v-loading="loading" :data="rows" style="width: 100%; margin-bottom: 20px" row-key="id" size="large"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" ref="tableRef">
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column label="图标" width="65">
            <template #default="scope">
                <el-icon size="1.2em" v-if="scope.row.icon.length > 0">
                    <component :is="scope.row.icon"></component>
                </el-icon>

            </template>
        </el-table-column>
        <el-table-column align="center" prop="orderNum" label="排序" width="60" />
        <el-table-column prop="route" label="路由地址" />
        <el-table-column prop="component" label="组件路径" />
        <el-table-column align="right" label="状态&emsp;&emsp;&emsp;&emsp;" width="220">
            <template #default="scope">
                <el-tag type="success" size="small" v-if="scope.row.type == 2 && scope.row.cache">缓存</el-tag>
                <el-tag type="info" size="small" v-if="scope.row.type == 2 && !scope.row.cache">不缓存</el-tag>
                &ensp;<el-tag type="success" size="small" v-if="scope.row.type < 3 && scope.row.visible">显示</el-tag>
                <el-tag type="warning" size="small" v-if="scope.row.type < 3 && !scope.row.visible">隐藏</el-tag>
                &ensp;<el-tag type="success" size="small" v-if="scope.row.enable">启用</el-tag>
                <el-tag type="warning" size="small" v-if="!scope.row.enable">停用</el-tag>
            </template>
        </el-table-column>
        <el-table-column align="right" label="操作&emsp;&emsp;&emsp;&emsp;" width="210">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="add(scope.row)" :icon="Plus"
                    v-if="userStore.hasAuthorize('/system/menu/add') && scope.row.type < 3">新增</el-button>
                <el-button link type="primary" size="small" @click="edit(scope.row)" :icon="Edit"
                    v-if="userStore.hasAuthorize('/system/menu/edit')">编辑</el-button>
                <el-button link type="primary" size="small" @click="del(scope.row)" :icon="Delete"
                    v-if="userStore.hasAuthorize('/system/menu/delete')">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import ElIconPicker from './components/ElIconPicker.vue'
import { CascaderOption, ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { Delete, Edit, Plus, Sort } from '@element-plus/icons-vue'
import systemApi from '@/api/system'
import { useUserStore } from '@/stores/user'

export default defineComponent({

    data() {
        const FORM_EMPTY = {
            id: null,
            cache: false,
            component: '',
            icon: '',
            name: '',
            type: 1,
            enable: true,
            orderNum: 1,
            parentId: '0',
            route: '',
            visible: true
        }
        const form = Object.assign({}, FORM_EMPTY)
        const parentMenuProps = {
            checkStrictly: true,
        }
        const parentRows: CascaderOption[] = []
        const result: any = {}
        const rows: any = []
        const rules = reactive<FormRules>({
            component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
            name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
            route: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
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
            this.parentId = '0'
            this.form = Object.assign({}, this.FORM_EMPTY)
            if (parent != null) {
                this.parentId = parent.id
                if (parent.type < 3) this.form.type = parent.type + 1
            }
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
                `确认删除 ${itemName} ${row.name}`, 'Warning', { type: 'warning' })
                .then(() => {
                    systemApi.deleteMenu(row).then(() => {
                        this.dialogVisible = false
                        ElMessage({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                        })
                        this.init()
                    }).catch(() => {

                    })
                })
                .catch(() => {
                    ElMessage({ type: 'info', message: '删除已取消', })
                })
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
            let result: any = await systemApi.getMenuList({})
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
                const save = data.id == null ? systemApi.addMenu : systemApi.editMenu
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
    },
    components: { ElIconPicker }
})
</script>

<style lang="scss" scoped></style>