import request from '@/utils/system/request'

export default ({
    addOrder: (data: object) => {
        return request({
            url: '/order/order/add',
            method: 'post',
            data
        })
    },
    editOrder: (data: object) => {
        return request({
            url: '/order/order/edit',
            method: 'post',
            data
        })
    },
    deleteOrder: (data: object) => {
        return request({
            url: '/order/order/delete',
            method: 'post',
            data
        })
    },
    getOrderInfo: (data: object) => {
        return request({
            url: '/order/order/info',
            method: 'post',
            data
        })
    },
    getOrderList: (data: object) => {
        return request({
            url: '/order/order/list',
            method: 'post',
            data
        })
    },
    orderCancelOrder: (data: object) => {
        return request({
            url: '/order/order/cancelOrder',
            method: 'post',
            data
        })
    },
    orderCancelShip: (data: object) => {
        return request({
            url: '/order/order/cancelShip',
            method: 'post',
            data
        })
    },
    orderConfirm: (data: object) => {
        return request({
            url: '/order/order/confirm',
            method: 'post',
            data
        })
    },
   
    orderPay: (data: object) => {
        return request({
            url: '/order/order/pay',
            method: 'post',
            data
        })
    },
    orderRefund: (data: object) => {
        return request({
            url: '/order/order/refund',
            method: 'post',
            data
        })
    },
    orderShip: (data: object) => {
        return request({
            url: '/order/order/ship',
            method: 'post',
            data
        })
    },
    

})