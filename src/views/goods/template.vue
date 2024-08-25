<template>
    <el-card>
        <template #header>商品模板</template>
        <el-form :model="record" v-loading="loading" :disabled="!hasEditAuthroize">
            <el-form-item label="使用页头">
                <el-switch v-model="record.headerEnable" active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item label="页头">
                <editor v-model="record.header" :init="editorInit" tinymceScriptSrc="./static/tinymce/tinymce.min.js">
                </editor>
            </el-form-item>
          <br>
            <el-form-item label="使用页脚">
                <el-switch v-model="record.footerEnable" active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item label="页脚">
                <editor v-model="record.footer" :init="editorInit" tinymceScriptSrc="./static/tinymce/tinymce.min.js">
                </editor>
            </el-form-item>
            <br>
            <el-button type="primary" @click="submit" v-if="hasEditAuthroize">保存</el-button>
        </el-form>
        <el-row>

        </el-row>
    </el-card><br>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import goodsApi from '@/api/goods'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { priceFormat, priceToNumber } from '@/utils'
import Editor from '@tinymce/tinymce-vue'

export default defineComponent({
    components:{
        Editor
    },
    data() {
        const editorInit = {
            branding: false, // 隐藏右下角技术支持
            language: 'zh_CN',
            promotion: false, // 隐藏右上角升级按钮
            plugins: "autolink code help image link media preview table",
            toolbar: ' formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | ' +
                'removeformat | image | code | preview',
            images_upload_handler: (blobInfo: any) => new Promise(async (resolve, reject) => {
                const formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                return goodsApi.uploadTemplateImg(formData).then(result => {
                    resolve(result.data.url)
                }).catch(error => {
                    if (error.msg) reject('上传失败 ' + error.msg)
                    else reject('上传失败 ' + error)
                })
            }),
            width: '100%'

        }
        
        const userStore = useUserStore()
        const hasEditAuthroize = userStore.hasAuthorize("/express/freeRule/edit")
        return {
            editorInit,
            hasEditAuthroize,
            loading: true,
            provinces: [] as any,
            record: {
                amount: 0 as number,
                enable: false,
                exclude: ''
            } as any,

        }
    },
    methods: {
        async init() {
            this.loading = true
            let result = await goodsApi.getTemplate()
            Object.assign(this.record, result.data.record)
            this.record.amount = Number(priceFormat(this.record.amount))
            Object.assign(this.provinces, result.data.provinces)
            this.loading = false
        },
        submit() {
            this.loading = true
            let postData = Object.assign({}, this.record)
            postData.amount = priceToNumber(postData.amount)
            goodsApi.editTemplate(postData).then(() => {
                ElMessage.success('保存成功')
                this.init()

            }).finally(() => { this.loading = false })
        }
    },

    mounted() {
        this.init()
    },
    setup() {
    }
})
</script>
  
<style lang="scss" scoped></style>