import request from '@/utils/system/request'

export default ({
    addBrand: (data: object) => {
        return request({
            url: '/goods/brand/add',
            method: 'post',
            data
        })
    },
    editBrand: (data: object) => {
        return request({
            url: '/goods/brand/edit',
            method: 'post',
            data
        })
    },
    deleteBrand: (data: object) => {
        return request({
            url: '/goods/brand/delete',
            method: 'post',
            data
        })
    },
    getBrandList: (data: object) => {
        return request({
            url: '/goods/brand/list',
            method: 'post',
            data
        })
    },

    addCategory: (data: object) => {
        return request({
            url: '/goods/category/add',
            method: 'post',
            data
        })
    },
    editCategory: (data: object) => {
        return request({
            url: '/goods/category/edit',
            method: 'post',
            data
        })
    },
    deleteCategory: (data: object) => {
        return request({
            url: '/goods/category/delete',
            method: 'post',
            data
        })
    },

    getCategoryList: (data: object) => {
        return request({
            url: '/goods/category/list',
            method: 'post',
            data
        })
    },


    addGoods: (data: object) => {
        return request({
            url: '/goods/goods/add',
            method: 'post',
            data
        })
    },
    editGoods: (data: object) => {
        return request({
            url: '/goods/goods/edit',
            method: 'post',
            data
        })
    },
    deleteGoods: (data: object) => {
        return request({
            url: '/goods/goods/delete',
            method: 'post',
            data
        })
    },
    getGoods: (data: object) => {
        return request({
            url: '/goods/goods/get',
            method: 'post',
            data
        })
    },
    getGoodsList: (data: object) => {
        return request({
            url: '/goods/goods/list',
            method: 'post',
            data
        })
    },

    uploadGoodsImg: (data: object) => {
        return request({
            url: '/goods/goods/upload',
            method: 'post',
            data
        })
    },

    addSpec: (data: object) => {
        return request({
            url: '/goods/spec/add',
            method: 'post',
            data
        })
    },
    editSpec: (data: object) => {
        return request({
            url: '/goods/spec/edit',
            method: 'post',
            data
        })
    },
    deleteSpec: (data: object) => {
        return request({
            url: '/goods/spec/delete',
            method: 'post',
            data
        })
    },
    getSpecList: (data: object) => {
        return request({
            url: '/goods/spec/list',
            method: 'post',
            data
        })
    },
    editTemplate: (data: object) => {
        return request({
            url: '/goods/template/edit',
            method: 'post',
            data
        })
    },
    getTemplate: () => {
        return request({
            url: '/goods/template/get',
            method: 'post'
        })
    },
    uploadTemplateImg: (data: object) => {
        return request({
            url: '/goods/template/upload',
            method: 'post',
            data
        })
    },
    
})