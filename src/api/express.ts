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
    getFreeRuleInfo: () => {
        return request({
            url: '/express/freeRule/info',
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
    getFeeRuleInfo: () => {
        return request({
            url: '/express/feeRule/info',
            method: 'post'
        })
    },
})