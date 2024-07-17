<template>
    <el-dialog v-model="detailVisible" title="用户详情" width="1060">

        <el-descriptions border :column="4">
            <el-descriptions-item label="ID">{{ record.id }}</el-descriptions-item>
            <el-descriptions-item label="账号">{{ record.name }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ record.statusStr }}</el-descriptions-item>
            <el-descriptions-item label="余额">{{ record.balanceStr }}</el-descriptions-item>
            <el-descriptions-item label="用户级别">{{ record.level }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ record.genderStr }}</el-descriptions-item>
            <el-descriptions-item label="电话">{{ record.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ record.email }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ record.registerTime }}</el-descriptions-item>
            <el-descriptions-item label="注册IP">{{ record.registerIp }}</el-descriptions-item>
            <el-descriptions-item label="最近登录">{{ record.lastLoginTime }}</el-descriptions-item>
            <el-descriptions-item label="最近登录IP">{{ record.lastLoginIp }}</el-descriptions-item>
        </el-descriptions>
        <br>
        <el-table border :data="record.address">
            <el-table-column label="收货地址">
                <template #default="scope">
                    {{ `${scope.row.regionStr} ${scope.row.address} ${scope.row.consignee} ${scope.row.phone} ` }}
                </template>

            </el-table-column>
        </el-table>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="detailVisible = false">确定</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- change balance -->
    <el-dialog v-model="balanceDialog.visible" title="调整余额" width="560">
        <el-form label-width="110px" v-loading="balanceDialog.loading">
            <el-form-item label="用户">
                <el-input v-model="record.name" type="text" disabled />
            </el-form-item>
            <el-form-item label="余额">
                <el-input v-model="record.balance" type="text" disabled />
            </el-form-item>
            <el-form-item label="调整值" required>
                <el-input-number :controls="false" v-model="balanceDialog.change" :precision="2" />
            </el-form-item>
            <el-form-item label="备注" required>
                <el-input v-model="balanceDialog.note" type="text" autocomplete="off" />
            </el-form-item>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="balanceDialog.visible = false">取消</el-button>
                <el-button type="primary" @click="changeBalance">确定</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- change password -->
    <el-dialog v-model="passwordDialog.visible" title="更改密码" width="560">
        <el-form label-width="110px" v-loading="passwordDialog.loading">
            <el-form-item label="账号">
                <el-input v-model="record.name" type="text" disabled />
            </el-form-item>
            <el-form-item label="密码" required>
                <el-input v-model="passwordDialog.pwd" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="重复密码" required>
                <el-input v-model="passwordDialog.checkPwd" type="password" autocomplete="off" />
            </el-form-item>
        </el-form>
        <el-text type="danger">注意：</el-text>更改密码会注销该用户所有客户端的登录状态
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="passwordDialog.visible = false">取消</el-button>
                <el-button type="primary" @click="changePassword">确定</el-button>
            </span>
        </template>
    </el-dialog>

    <el-row justify="start">
        <el-form :inline="true">
            <el-form-item label="用户名">
                <el-input v-model="queryForm.name" placeholder="用户名" @keydown.enter="submit" clearable />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit">查询</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-table v-loading="loading" :data="result.data.rows" style="width: 100%; margin-bottom: 20px" row-key="id" border
        default-expand-all @sort-change="sortChange">
        <el-table-column prop="id" label="id" sortable="custom" width="80" />
        <el-table-column prop="name" label="账号" sortable="custom" />
        <el-table-column prop="balance" label="余额" sortable="custom" />
        <el-table-column prop="lastLoginTime" label="最近登录时间" sortable="custom" />
        <el-table-column prop="lastLoginIp" label="最近登录IP" />
        <el-table-column prop="registerTime" label="注册时间" />
        <el-table-column prop="address" label="操作" width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="show(scope.row)">详情</el-button>&ensp;
                <el-dropdown class="el-dropdown1" size="small" type="primary">
                    <el-text class="more" size="small" type="primary">更多&gt;&gt;</el-text>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-if="userStore.hasAuthorize('/user/user/changeBalance')"
                                @click="showBalanceDialog(scope.row)">调整余额</el-dropdown-item>
                            <el-dropdown-item
                                @click="router.push({ path: '/user/balanceLog', query: { name: scope.row.name } })"
                                v-if="userStore.hasAuthorize('/system/log/query')">余额日志</el-dropdown-item>
                            <el-dropdown-item v-if="userStore.hasAuthorize('/user/user/changePassword')"
                                @click="showPasswordDialog(scope.row)">更改密码</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
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
import userApi from '@/api/user'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import mainApi from '@/api/main'
import JSEncrypt from 'jsencrypt'
import * as math from 'mathjs'

export default defineComponent({
    data() {
        const query = {
            page: 1,
            pageSize: 20,
            sort: ''
        }
        const result: any = {
            data: {
                rows: [],
                totalPages: 0,
                totalRecords: 0
            }
        }
        const record = {
            address: [] as any,
            id: 0,
            content: '',
            ip: '',
            name: '',
            time: '',
            title: ''
        } as any
        const queryForm = {
            name: ''
        }
        const route = useRoute()
        Object.assign(queryForm, route.query)

        return {
            balanceDialog: {
                change: 0,
                note: '',
                loading: false,
                visible: false
            },
            passwordDialog: {
                loading: false,
                pwd: '',
                checkPwd: '',
                visible: false
            },
            detailVisible: ref(false),
            loading: ref(true),
            query,
            queryForm,
            record,
            result,
            router: useRouter(),
            userStore: useUserStore()
        }
    },
    methods: {
        async changeBalance() {
            let data = {
                uid: this.record.id,
                amount: this.balanceDialog.change,
                note: this.balanceDialog.note
            }
            userApi.changeBalance(data).then(() => {
                ElMessage.success("余额调整完成")
                this.balanceDialog.visible = false
                this.init()
            }).finally(() => {
                this.balanceDialog.loading = false
            })

        },
        async changePassword() {
            if (this.passwordDialog.pwd != this.passwordDialog.checkPwd) {
                ElMessage.error('两次密码不一致')
                return
            }
            this.passwordDialog.loading = true
            let rsaPubKey = ''
            try {
                rsaPubKey = (await mainApi.getRsaPubKey()).data.rsaPubKey
            } catch (error) {
                this.passwordDialog.loading = false
                return
            }
            let jsencrypt = new JSEncrypt()
            jsencrypt.setPublicKey(rsaPubKey)
            let data = { id: this.record.id, pwd: jsencrypt.encrypt(this.passwordDialog.pwd) }
            userApi.changePassword(data).then(() => {
                ElMessage.success("密码更改完成")
                this.passwordDialog.visible = false
            }).finally(() => {
                this.passwordDialog.loading = false
            })
        },
        async init() {
            this.loading = true
            let query = Object.assign({}, this.queryForm, this.query)
            let result = await userApi.getUserList(query)
            Object.assign(this.result, result)
            this.result.data.rows.forEach((item: any) => {
                item.balance = item.balance.toFixed(2)
            })
            this.loading = false
        },
        show(row: any) {
            userApi.getUser(row).then((result) => {
                Object.assign(this.record, result.data.record)
                this.record.address.length = 0
                Object.assign(this.record.address, result.data.address)
                this.detailVisible = true
            })
        },
        showBalanceDialog(row: any) {
            Object.assign(this.record, row)
            this.balanceDialog.change = 0
            this.balanceDialog.note = '系统管理员调整'
            this.balanceDialog.loading = false
            this.balanceDialog.visible = true
        },
        showPasswordDialog(row: any) {
            Object.assign(this.record, row)
            this.passwordDialog.loading = false
            this.passwordDialog.pwd = ''
            this.passwordDialog.checkPwd = ''
            this.passwordDialog.visible = true
        },
        sortChange(param: any) {
            if (param.order == null) {
                this.query.sort = ""
                return
            }
            let n = param.prop
            this.query.sort = n + ',' + (param.order[0] == 'a' ? 'asc' : 'desc')
        },
        submit() {
            if (this.query.page !== 1) this.query.page = 1
            else this.init()
        }
    },
    mounted() {
        this.init()
    },
    setup() {

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

<style lang="scss" scoped>
.el-dropdown1 {
    vertical-align: text-bottom;

    & .more {
        cursor: pointer;

    }
}
</style>