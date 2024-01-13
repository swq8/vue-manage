<template>
    <editor :init="init" tinymceScriptSrc="./static/tinymce/tinymce.min.js"></editor>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import goodsApi from '@/api/goods'
export default defineComponent({
    components: {
        Editor
    },
    data() {
        const init = {
            branding: false, // 隐藏右下角技术支持
            language: 'zh-Hans',
            promotion: false, // 隐藏右上角升级按钮
            plugins: "autolink code help image link media preview table",
            toolbar: ' formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | ' +
                'removeformat | image | code | preview',
            images_upload_handler: (blobInfo: any) => new Promise(async (resolve, reject) => {
                const formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                return goodsApi.uploadGoodsImg(formData).then(result => {
                    resolve(result.data.url)
                }).catch(error => {
                    if (error.msg) reject('上传失败 ' + error.msg)
                    else reject('上传失败 ' + error)
                })
            }),
            width: '100%'

        }
        return {
            init
        }
    },
    setup() {

    }
})
</script>
<style lang="scss" scoped></style>