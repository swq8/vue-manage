import request from '@/utils/system/request'

export default ({
    addArticle: (data: object) => {
        return request({
            url: '/article/article/add',
            method: 'post',
            data
        })
    },
    editArticle: (data: object) => {
        return request({
            url: '/article/article/edit',
            method: 'post',
            data
        })
    },
    deleteArticle: (data: object) => {
        return request({
            url: '/article/article/delete',
            method: 'post',
            data
        })
    },
    getArticleList: (data: object) => {
        return request({
            url: '/article/article/list',
            method: 'post',
            data
        })
    },

    addCategory: (data: object) => {
        return request({
            url: '/article/category/add',
            method: 'post',
            data
        })
    },
    editCategory: (data: object) => {
        return request({
            url: '/article/category/edit',
            method: 'post',
            data
        })
    },
    deleteCategory: (data: object) => {
        return request({
            url: '/article/category/delete',
            method: 'post',
            data
        })
    },

    getCategoryList: (data: object) => {
        return request({
            url: '/article/category/list',
            method: 'post',
            data
        })
    },
    uploadImg: (data: object) => {
        return request({
            url: '/article/article/upload',
            method: 'post',
            data
        })
    },
})