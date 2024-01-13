<template>
    <el-dialog v-model="dialogVisible" title="日志详情" width="760">

        <el-descriptions border :column="2">
            <el-descriptions-item label="时间">{{ record.time }}</el-descriptions-item>
            <el-descriptions-item label="用户">{{ record.name }}</el-descriptions-item>
            <el-descriptions-item label="ip">{{ record.ip }}</el-descriptions-item>
            <el-descriptions-item label="操作">{{ record.title }}</el-descriptions-item>
            <el-descriptions-item label="内容">
                <el-input v-model="record.content" :rows="5" type="textarea" readonly />
            </el-descriptions-item>
        </el-descriptions>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <el-row justify="start">
        <el-form :inline="true">
            <el-form-item label="用户名">
                <el-input v-model="queryForm.name" placeholder="用户名" @keydown.enter="submit" clearable />
            </el-form-item>
            <el-form-item label="ip地址">
                <el-input v-model="queryForm.ip" placeholder="ip地址" @keydown.enter="submit" clearable />
            </el-form-item>
            <el-form-item label="操作">
                <el-input v-model="queryForm.q" placeholder="操作" @keydown.enter="submit" clearable />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit">查询</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-table v-loading="loading" :data="result.data.rows" style="width: 100%; margin-bottom: 20px" row-key="id" border
        @sort-change="sortChange">
        <el-table-column prop="id" label="id" sortable="custom" width="100" />
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column prop="name" label="用户" />
        <el-table-column prop="ip" label="ip" />
        <el-table-column prop="title" label="操作" />
        <el-table-column align="right" prop="runtime" label="用时(ms)" sortable="custom" width="110" />
        <el-table-column prop="address" label="详情" width="60">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="show(scope.row)">详情</el-button>
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
import { useRoute } from 'vue-router'

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
            content: '',
            ip: '',
            name: '',
            time: '',
            title: ''
        }
        const queryForm = {
            ip: '',
            name: '',
            q: ''
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
            let result = await systemApi.getLogList(query)
            Object.assign(this.result, result)
            this.loading = false
        },
        sortChange(param: any) {
            this.query.sort = param.prop + ',' + (param.order[0] == 'a' ? 'asc' : 'desc')
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