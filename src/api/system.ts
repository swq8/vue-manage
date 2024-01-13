import request from '@/utils/system/request'

export default ({

    getConfig: () => {
        return request({
            url: '/system/config',
            method: 'post'
        })
    },

    editConfig: (data: object) => {
        return request({
            url: '/system/config/edit',
            method: 'post',
            data
        })
    },

    getSystemInfo: () => {
        return request({
            url: '/system/info',
            method: 'post'
        })
    },

    getLogList: (data: object) => {
        return request({
            url: '/system/log/list',
            method: 'post',
            data
        })
    },
    addManager: (data: object) => {
        return request({
            url: '/system/manager/add',
            method: 'post',
            data
        })
    },

    deleteManager: (data: object) => {
        return request({
            url: '/system/manager/delete',
            method: 'post',
            data
        })
    },

    editManager: (data: object) => {
        return request({
            url: '/system/manager/edit',
            method: 'post',
            data
        })
    },

    getManagerList: (data: object) => {
        return request({
            url: '/system/manager/list',
            method: 'post',
            data
        })
    },


    addMenu: (data: object) => {
        return request({
            url: '/system/menu/add',
            method: 'post',
            data
        })
    },

    deleteMenu: (data: object) => {
        return request({
            url: '/system/menu/delete',
            method: 'post',
            data
        })
    },

    editMenu: (data: object) => {
        return request({
            url: '/system/menu/edit',
            method: 'post',
            data
        })
    },

    getMenuList: (data: object) => {
        return request({
            url: '/system/menu/list',
            method: 'post',
            data
        })
    },

    getPaymentList: (data: object) => {
        return request({
            url: '/system/payment/list',
            method: 'post',
            data
        })
    },
    getPaymentInfo: (data: object) => {
        return request({
            url: '/system/payment/info',
            method: 'post',
            data
        })
    },
    editPayment: (data: object) => {
        return request({
            url: '/system/payment/edit',
            method: 'post',
            data
        })
    },

    addRole: (data: object) => {
        return request({
            url: '/system/role/add',
            method: 'post',
            data
        })
    },

    deleteRole: (data: object) => {
        return request({
            url: '/system/role/delete',
            method: 'post',
            data
        })
    },

    getRoleList: (data: object) => {
        return request({
            url: '/system/role/list',
            method: 'post',
            data
        })
    },
    editRole: (data: object) => {
        return request({
            url: '/system/role/edit',
            method: 'post',
            data
        })
    },


})
