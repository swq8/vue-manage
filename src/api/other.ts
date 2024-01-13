import request from '@/utils/system/request'

export default ({
    editCarousel: (data: object) => {
        return request({
            url: '/other/carousel/edit',
            method: 'post',
            data
        })
    },
    getCarousel: () => {
        return request({
            url: '/other/carousel/get',
            method: 'post'
        })
    },
    editStaticRes: (data: object) => {
        return request({
            url: '/other/staticRes/edit',
            method: 'post',
            data
        })
    },
    getStaticRes: () => {
        return request({
            url: '/other/staticRes/get',
            method: 'post'
        })
    },
})