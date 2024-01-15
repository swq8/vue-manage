<template>
    <el-dialog v-model="dialogVisible" :title="record.userId === null ? '新建管理账号' : '修改管理账号'" width="460"
        @close="formRef.clearValidate()">

        <el-form label-width="78px" :model="record" :rules="rules" inline ref="formRef">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="会员账号" prop="name">
                        <el-input v-model="record.name" placeholder="会员账号" style="width:328px" />
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="record.trueName" placeholder="姓名" style="width:328px" />
                    </el-form-item>

                    <el-form-item label="角色">
                        <el-select v-model="record.rolesId" multiple placeholder="Select" style="width: 328px">
                            <el-option v-for="item in result.data.roles" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="使用状态" required>
                        <el-radio-group v-model="record.enable" style="width:328px">
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
        <el-button type="primary" plain @click="add" v-if="userStore.hasAuthorize('/system/manager/add')">新增</el-button>
    </el-row><br>
    <el-table v-loading="loading" :data="result.data.rows" style="width: 100%; margin-bottom: 20px" row-key="id" border>
        <el-table-column fixed prop="name" label="用户" width="150" />
        <el-table-column prop="trueName" label="姓名" width="150" />
        <el-table-column prop="rolesName" label="角色" />
        <el-table-column prop="lastLoginTime" label="最近登录时间" width="160" />
        <el-table-column prop="lastLoginIp" label="最近登录ip" width="160" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column prop="enable" label="状态" width="75">
            <template #default="scope">
                <el-tag type="success" size="small" v-if="scope.row.enable">启用</el-tag>
                <el-tag type="warning" size="small" v-if="!scope.row.enable">停用</el-tag>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="190">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="edit(scope.row)" :icon="Edit"
                    v-if="userStore.hasAuthorize('/system/manager/edit')">编辑</el-button>
                <el-button link type="primary" size="small" @click="del(scope.row)" :icon="Delete"
                    v-if="userStore.hasAuthorize('/system/manager/delete')">删除</el-button>
                <el-button link type="primary" size="small" :icon="Memo"
                    @click="router.push({ path: '/system/log', query: { name: scope.row.name } })"
                    v-if="userStore.hasAuthorize('/system/log/query')">日志</el-button>
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
import { defineComponent } from 'vue'
import systemApi from '@/api/system'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { Delete, Edit, Memo } from '@element-plus/icons-vue'
import { objAssign } from '@/utils/index'
import { useUserStore } from '@/stores/user'


export default defineComponent({
    data() {
        const router = useRouter()
        const RECORD_EMPTY = {
            id: null,
            userId: null,
            name: '',
            trueName: '',
            rolesId: [] as any[],
            enable: true,
        } as any
        const record = Object.assign({}, RECORD_EMPTY)
        const query = {
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
        const rules = {
            name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        }
        return {
            dialogVisible: false,
            RECORD_EMPTY,
            loading: true,
            query,
            record,
            result,
            router,
            rules,
            userStore: useUserStore()
        }
    },
    methods: {
        add() {
            Object.assign(this.record, this.RECORD_EMPTY)
            this.dialogVisible = true
        },
        del(row: any) {
            ElMessageBox.confirm(
                `确认删除后台账号  ${row.name}`, 'Warning', { type: 'warning' })
                .then(() => {
                    systemApi.deleteManager(row).then(() => {
                        this.dialogVisible = false
                        ElMessage.success('删除成功')
                        this.init()
                    }).catch(() => { })
                }).catch(() => { ElMessage.info('删除已取消') })
        },
        edit(row: any) {
            Object.assign(this.record, row)
            this.record.rolesId = []
            for (const id of row.rolesId.split(",")) {
                if (id)
                    this.record.rolesId.push(Number(id))
            }
            this.dialogVisible = true
        },
        async init() {
            this.loading = true
            let query = Object.assign({}, this.record, this.query)
            let result = await systemApi.getManagerList(query)
            this.result = result
            this.loading = false
        },
        submit() {
            this.formRef.validate((valid: boolean) => {
                if (!valid) return
                let data: any = Object.assign({}, this.RECORD_EMPTY)
                objAssign(data, this.record)
                data.rolesId = ''
                for (const id of this.record.rolesId) data.rolesId += id + ','
                const save = data.userId == null ? systemApi.addManager : systemApi.editManager
                const msg = data.userId == null ? '新建' : '修改'
                save(data).then(() => {
                    this.dialogVisible = false
                    ElMessage({
                        showClose: true,
                        message: `${msg}管理账号成功`,
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
            Memo,
            formRef: null as any,
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