<template>
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
        @sort-change="sortChange">
        <el-table-column prop="time" label="时间" width="160" sortable="custom" />
        <el-table-column prop="name" label="用户" />
        <el-table-column prop="amount" label="变动" sortable="custom" />
        <el-table-column prop="balance" label="变动后余额" sortable="custom" />
        <el-table-column prop="note" label="备注" />
    </el-table>

    <el-row justify="end">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" v-model:current-page="query.page"
            v-model:page-size="query.pageSize" :page-count="result.data.totalPages" :page-sizes="[20, 50, 80, 100]"
            :total="result.data.totalRecords" />
    </el-row>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import userApi from '@/api/user'
import { useRoute } from 'vue-router'

export default defineComponent({
    data() {
        const query = {
            page: 1,
            pageSize: 20,
            sort: '',
        }
        const result: any = {
            data: {
                rows: [],
                totalPages: 0,
                totalRecords: 0
            }
        }
        const record = {
            content: '',
            ip: '',
            name: '',
            time: '',
            title: ''
        }
        const queryForm = {
            ip: '',
            name: ''
        }
        const route = useRoute()
        Object.assign(queryForm, route.query)
        return {
            dialogVisible: false,
            loading: true,
            query,
            queryForm,
            record,
            result
        }
    },
    methods: {

        show(row: any) {
            Object.assign(this.record, row)
            this.dialogVisible = true
        },
        async init() {
            this.loading = true
            let query = Object.assign({}, this.queryForm, this.query)
            let result = await userApi.getBalanceLogList(query)

            result.data.rows.forEach((item: any) => {
                item.amount = item.amount.toFixed(2)
                if (item.amount > 0) item.amount = "+" + item.amount
                item.balance = item.balance.toFixed(2)
            })
            Object.assign(this.result, result)
            this.loading = false
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