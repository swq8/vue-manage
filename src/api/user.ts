import request from '@/utils/system/request'

export default ({
    getBalanceLogList: (data: object) => {
        return request({
            url: '/user/balanceLog/list',
            method: 'post',
            data
        })
    },

    changeBalance: (data: object) => {
        return request({
            url: '/user/user/changeBalance',
            method: 'post',
            data
        })
    },
    changePassword: (data: object) => {
        return request({
            url: '/user/user/changePassword',
            method: 'post',
            data
        })
    },

    getUser: (data: object) => {
        return request({
            url: '/user/user/get',
            method: 'post',
            data
        })
    },

    getUserList: (data: object) => {
        return request({
            url: '/user/user/list',
            method: 'post',
            data
        })
    }
})