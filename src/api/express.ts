import request from '@/utils/system/request'

export default ({
    addCompany: (data: object) => {
        return request({
            url: '/express/company/add',
            method: 'post',
            data
        })
    },
    editCompany: (data: object) => {
        return request({
            url: '/express/company/edit',
            method: 'post',
            data
        })
    },
    deleteCompany: (data: object) => {
        return request({
            url: '/express/company/delete',
            method: 'post',
            data
        })
    },
    getCompanyList: (data: object) => {
        return request({
            url: '/express/company/list',
            method: 'post',
            data
        })
    },
    editFreeRule: (data: object) => {
        return request({
            url: '/express/freeRule/edit',
            method: 'post',
            data
        })
    },
    getFreeRule: () => {
        return request({
            url: '/express/freeRule/get',
            method: 'post'
        })
    },
    editFeeRule: (data: object) => {
        return request({
            url: '/express/feeRule/edit',
            method: 'post',
            data
        })
    },
    getFeeRule: () => {
        return request({
            url: '/express/feeRule/get',
            method: 'post'
        })
    },
})