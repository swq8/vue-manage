<template>
    <!-- order info -->
    <el-dialog v-model="infoDialog.visible" title="订单详情" width="1060">
        <div v-loading="infoDialog.loading">
            <el-descriptions border :column="4">
                <el-descriptions-item label="订单号">{{ record.no }}</el-descriptions-item>
                <el-descriptions-item label="订单金额">{{ record.amountStr }}</el-descriptions-item>
                <el-descriptions-item label="下单时间">{{ record.createTime }}</el-descriptions-item>
                <el-descriptions-item label="订单状态">{{ record.statusName }}</el-descriptions-item>
                <el-descriptions-item label="付款时间">{{ record.payTime }}</el-descriptions-item>
                <el-descriptions-item label="快递公司">{{ record.expressName }}</el-descriptions-item>
                <el-descriptions-item label="快递单号">{{ record.expressNo }}</el-descriptions-item>
                <el-descriptions-item label="发货时间">{{ record.shippingTime }}</el-descriptions-item>
                <el-descriptions-item label="付款方式">{{ record.payNameCn }}</el-descriptions-item>
                <el-descriptions-item label="付款金额">{{ record.payAmountStr }}</el-descriptions-item>
                <el-descriptions-item label="余额支付">{{ record.payBalanceStr }}</el-descriptions-item>
            </el-descriptions>
            <el-table :data="record.orderGoods" border>
                <el-table-column label="商品">
                    <template #default="scope">
                        <el-link target="_blank" :href="'/goods/' + scope.row.id + '.html'"
                            v-text="scope.row.goodsName"></el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="specDes" label="规格" width="100" />
                <el-table-column prop="priceStr" label="单价" width="90" />
                <el-table-column prop="num" label="数量" width="60" />
                <el-table-column prop="sumPriceStr" label="小计" width="100" />
                <el-table-column prop="statusStr" label="状态" width="80" />

            </el-table>
            <el-descriptions border :column="1" direction="vertical">
                <el-descriptions-item label="收货地址">{{ record.regionStr + ' ' + record.consignee + ' ' + record.phone
                }}</el-descriptions-item>
            </el-descriptions>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="infoDialog.visible = false">关闭</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- refund -->
    <el-dialog v-model="refundDialog.visible" title="订单详情" width="1060">
        <div v-loading="refundDialog.loading">
            <el-descriptions border :column="4">
                <el-descriptions-item label="订单号">{{ record.no }}</el-descriptions-item>
                <el-descriptions-item label="订单金额">{{ record.amountStr }}</el-descriptions-item>
                <el-descriptions-item label="下单时间">{{ record.createTime }}</el-descriptions-item>
                <el-descriptions-item label="订单状态">{{ record.statusName }}</el-descriptions-item>
                <el-descriptions-item label="付款时间">{{ record.payTime }}</el-descriptions-item>
                <el-descriptions-item label="快递公司">{{ record.expressName }}</el-descriptions-item>
                <el-descriptions-item label="快递单号">{{ record.expressNo }}</el-descriptions-item>
                <el-descriptions-item label="发货时间">{{ record.shippingTime }}</el-descriptions-item>
                <el-descriptions-item label="付款方式">{{ record.payNameCn }}</el-descriptions-item>
                <el-descriptions-item label="付款金额">{{ record.payAmountStr }}</el-descriptions-item>
                <el-descriptions-item label="余额支付">{{ record.payBalanceStr }}</el-descriptions-item>
            </el-descriptions>
            <el-table :data="record.orderGoods" border>
                <el-table-column label="商品">
                    <template #default="scope">
                        <el-link target="_blank" :href="'/goods/' + scope.row.id + '.html'"
                            v-text="scope.row.goodsName"></el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="specDes" label="规格" width="100" />
                <el-table-column prop="priceStr" label="单价" width="90" />
                <el-table-column prop="num" label="数量" width="60" />
                <el-table-column prop="sumPriceStr" label="小计" width="100" />
                <el-table-column prop="statusStr" label="状态" width="80" />

            </el-table>
            <el-descriptions border :column="1" direction="vertical">
                <el-descriptions-item label="收货地址">{{ record.regionStr + ' ' + record.consignee + ' ' + record.phone
                }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions border :column="1" direction="vertical">
                <el-descriptions-item label="退款">
                    <el-radio-group v-model="record.orderStatusOnly" class="ml-4">
                        <el-radio label="false">原路退</el-radio>
                        <el-radio label="true">仅修改订单状态</el-radio>
                    </el-radio-group>

                </el-descriptions-item>
            </el-descriptions>

        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="" @click="refundDialog.visible = false">取消</el-button>
                <el-button type="primary" @click="refund">确定</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- ship -->
    <el-dialog v-model="shipgDialog.visible" title="物流" width="1060">
        <div v-loading="shipgDialog.loading">
            <el-descriptions border :column="2">
                <el-descriptions-item label="订单号">{{ record.no }}</el-descriptions-item>
                <el-descriptions-item label="订单金额">{{ record.amountStr }}</el-descriptions-item>
                <el-descriptions-item label="下单时间">{{ record.createTime }}</el-descriptions-item>
                <el-descriptions-item label="订单状态">{{ record.statusName }}</el-descriptions-item>
                <el-descriptions-item label="快递">

                    <el-select v-model="record.expressId" placeholder="快递">
                        <el-option v-for="item in result.data.expressCompanies" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-descriptions-item>
                <el-descriptions-item label="单号">
                    <el-input v-model="record.expressNo" placeholder="快递单号" @keydown.enter="submit" />
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="ship">确定</el-button>
            </span>
        </template>
    </el-dialog>


    <el-row justify="start">
        <el-form :inline="true">
            <el-form-item label="订单号">
                <el-input v-model="queryForm.no" placeholder="订单号" @keydown.enter="submit" clearable />
            </el-form-item>
            <el-form-item label="账号">
                <el-input v-model="queryForm.name" placeholder="账号" @keydown.enter="submit" clearable />
            </el-form-item>
            <el-form-item label="订单状态">
                <el-select v-model="queryForm.status" placeholder="订单状态" clearable>
                    <el-option label="待付款" value="0" />
                    <el-option label="待发货" value="1" />
                    <el-option label="已发货" value="2" />
                    <el-option label="已完成" value="3" />
                    <el-option label="已取消" value="4" />
                    <el-option label="已退款" value="5" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit">查询</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-table v-loading="loading" :data="result.data.rows" style="width: 100%; margin-bottom: 20px" row-key="id" border
        @sort-change="sortChange">
        <el-table-column prop="no" label="订单号" width="140" />
        <el-table-column prop="userName" label="账号" />
        <el-table-column prop="amountStr" label="订单金额" sortable="custom" />
        <el-table-column prop="consignee" label="收货人" />
        <el-table-column prop="statusName" label="订单状态" width="110" />
        <el-table-column prop="createTime" label="下单时间" sortable="custom" width="160" />
        <el-table-column prop="payTime" label="支付时间" sortable="custom" width="160" />
        <el-table-column prop="address" label="操作" width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="show(scope.row)">详情</el-button>&ensp;
                <el-dropdown class="el-dropdown1" size="small" type="primary">
                    <el-text class="more" size="small" type="primary">更多&gt;&gt;</el-text>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item
                                v-if="(scope.row.status == 0 || scope.row.status == 1) && userStore.hasAuthorize('/order/order/cancelOrder')"
                                @click="cancelOrder(scope.row)">取消订单</el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.status == 0 && userStore.hasAuthorize('/order/order/pay')"
                                @click="pay(scope.row)">支付订单</el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.status == 1 && userStore.hasAuthorize('/order/order/ship')"
                                @click="showShipgDialog(scope.row)">发货</el-dropdown-item>
                            <el-dropdown-item
                                v-if="scope.row.status == 2 && userStore.hasAuthorize('/order/order/cancelShip')"
                                @click="cancelShip(scope.row)">取消发货</el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.status == 2 && userStore.hasAuthorize('/order/order/confirm')"
                                @click="confirmOrder(scope.row)">确认收货</el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.status == 3 && userStore.hasAuthorize('/order/order/refund')"
                                @click="showRefund(scope.row)">退款</el-dropdown-item>

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
import orderApi from '@/api/order'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { objAssign } from '@/utils'

export default defineComponent({
    data() {
        const query = {
            page: 1,
            pageSize: 20,
            sort: ''
        }
        const result: any = {
            data: {
                expressCompanies: [] as any,
                rows: [],
                totalPages: 0,
                totalRecords: 0
            }
        }
        const record = {
            id: 0,
            expressId: null,
            expressNo: '',
            ip: '',
            name: '',
            time: '',
            title: ''
        } as any
        const queryForm = {
            name: '',
            no: '',
            status: ''
        }
        const route = useRoute()
        Object.assign(queryForm, route.query)

        return {
            infoDialog: {
                loading: false,
                visible: false
            },
            refundDialog: {
                loading: false,
                visible: false
            },
            shipgDialog: {
                loading: false,
                visible: false
            },

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
        async init() {
            this.loading = true
            let query = Object.assign({}, this.queryForm, this.query)
            let result = await orderApi.getOrderList(query)
            Object.assign(this.result, result)
            this.loading = false
        },
        pay(row: any) {
            ElMessageBox.confirm(
                `确认支付订单 ${row.no} 么`,
                'Warning', { type: 'warning', })
                .then(() => {
                    orderApi.orderPay(row).then((result: any) => {
                        ElMessage.success(`订单 ${row.no} 支付成功`)
                        objAssign(row, result.data.order)
                    })
                })
                .catch(() => { ElMessage.info('支付取消') })
        },
        showShipgDialog(row: any) {
            this.shipgDialog.visible = true
            this.shipgDialog.loading = true
            this.record = row
            if (this.result.data.expressCompanies.length > 0)
                this.record.expressId = this.result.data.expressCompanies[0].id
            this.shipgDialog.loading = false

        },
        ship() {
            if (this.record.expressNo == undefined || this.record.expressNo.trim().length == 0) {
                ElMessage.error('请输入快递单号')
                return
            }
            orderApi.orderShip(this.record).then(() => {
                this.shipgDialog.visible = false
                this.record.status = 2
                this.record.statusName = '已发货'
                ElMessage.success(`订单发货完成 ${this.record.no}`)
            })
                .finally(() => { })
        },
        cancelOrder(row: any) {
            ElMessageBox.confirm(
                `确认取消订单 ${row.no} 么`,
                'Warning', { type: 'warning', })
                .then(() => {
                    orderApi.orderCancelOrder(row).then((result: any) => {
                        ElMessage.success(`订单 ${row.no} 取消成功`)
                        row.status = 4
                        row.statusName = '已取消'
                    })
                })
                .catch(() => { ElMessage.info('操作取消') })
        },
        cancelShip(row: any) {
            ElMessageBox.confirm(
                `确认订单取消发货 ${row.no} 么`,
                'Warning', { type: 'warning', })
                .then(() => {
                    orderApi.orderCancelShip(row).then((result: any) => {
                        ElMessage.success(`订单 ${row.no} 取消发货成功`)
                        row.status = 1
                        row.statusName = '待发货'
                    })
                })
                .catch(() => { ElMessage.info('取消发货取消') })
        },
        confirmOrder(row: any) {
            ElMessageBox.confirm(
                `订单 ${row.no} 确认收货么`,
                'Warning', { type: 'warning', })
                .then(() => {
                    orderApi.orderConfirm(row).then((result: any) => {
                        ElMessage.success(`订单 ${row.no} 确认收货成功`)
                        row.status = 3
                        row.statusName = '已完成'
                    })
                })
                .catch(() => { ElMessage.info('确认收货取消') })
        },
        showRefund(row: any) {
            this.refundDialog.visible = true
            this.refundDialog.loading = true
            orderApi.getOrderInfo({ no: row.no }).then((result: any) => {
                this.record = JSON.parse(JSON.stringify(result.data.order))
                this.refundDialog.loading = false
            })
        },
        refund() {
            ElMessageBox.confirm(
                `订单 ${this.record.no} 确认退款么`,
                'Warning', { type: 'warning', })
                .then(() => {
                    orderApi.orderRefund(this.record).then((result: any) => {
                        ElMessage.success(`订单 ${this.record.no} 退款成功`)
                        this.refundDialog.visible = false
                    })
                })
                .catch(() => { ElMessage.info('退款取消') })
        },
        show(row: any) {
            this.infoDialog.visible = true
            this.infoDialog.loading = true
            orderApi.getOrder({ no: row.no }).then((result: any) => {
                this.record = JSON.parse(JSON.stringify(result.data.order))
                this.infoDialog.loading = false
            })
        },

        sortChange(param: any) {
            if (param.order == null) this.query.sort = ""
            else this.query.sort = param.prop + ',' + (param.order[0] == 'a' ? 'asc' : 'desc')
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