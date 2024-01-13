<template>
    <el-form inline :model="record" v-loading="loading" :disabled="!hasEditAuthroize" ref="formRef"
        style="text-align: left;">
        <el-table :data="record.items" border>
            <el-table-column label="图片(720px * 400px)">
                <template #default="scope">
                    <img class="img1" :src="scope.row.img" v-if="scope.row.img">
                    <el-form-item style="width: 100%;" :prop="`items[${scope.$index}].img`" :rules="{
                        required: true,
                        pattern: /\S+/,
                        message: '不能为空',
                        trigger: 'change'
                    }">
                    
                    <el-upload accept=".jpg,.png,.webp" action="/adminApi/other/carousel/upload" name="file"
                        :before-upload="beforeUpload" :show-file-list="false" :on-error="uploadError"
                        :on-success="uploadSuccess" ref="uploadRef">
                        <el-button size="small" type="primary" plain :icon="Upload"
                            @click="uploadingIndex = scope.$index">上传图片</el-button>
                    </el-upload>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column label="链接/备注">
                <template #default="scope">
                    <el-form-item label="链接" style="width: 100%;" :prop="`items[${scope.$index}].link`" :rules="{
                        required: true,
                        pattern: /\S+/,
                        message: '不能为空',
                        trigger: 'change'
                    }
                        ">
                        <el-input v-model="scope.row.link" />
                    </el-form-item>
                    <el-form-item label="&ensp;备注" style="width: 100%;">
                        <el-input v-model="scope.row.note" />
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="170">
                <template #default="scope">
                    <el-button-group>
                        <el-button type="primary" plain :icon="Top" @click="swap(scope.$index, scope.$index - 1)" />
                        <el-button type="primary" plain :icon="Delete" @click="record.items.splice(scope.$index, 1)" />
                        <el-button type="primary" plain :icon="Bottom" @click="swap(scope.$index, scope.$index + 1)" />
                    </el-button-group>
                </template>
            </el-table-column>
            <template #append>
                <div style="padding:0.7em;text-align: left;">
                    <el-button type="success" @click="add">增加轮播图</el-button>
                </div>
            </template>
        </el-table>
        <br>
        <el-row justify="center">
            <el-button type="primary" @click="submit" v-if="hasEditAuthroize">保存</el-button>
        </el-row>

    </el-form>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue'
import otherApi from '@/api/other'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { Bottom, Delete, Top, Upload } from '@element-plus/icons-vue'

export default defineComponent({
    data() {
        const userStore = useUserStore()
        const hasEditAuthroize = userStore.hasAuthorize("/other/carousel/edit")
        return {
            hasEditAuthroize,
            loading: true,
            record: {
                items: [] as any,
            },
            uploadingIndex: 0,

        }
    },
    methods: {

        add() {
            this.record.items.push({
                img: '',
                link: '#',
                note: ''
            })
        },
        async init() {
            this.loading = true
            let result = await otherApi.getCarousel()
            this.record = result.data.record
            this.loading = false
        },

        swap(from: number, to: number) {
            if (this.record.items.length < 2) return
            if (to < 0) to = this.record.items.length - 1
            else if (to >= this.record.items.length) to = 0
            let obj = Object.assign({}, this.record.items[from])
            this.record.items[from] = Object.assign({}, this.record.items[to])
            this.record.items[to] = obj

        },
        submit() {
            this.formRef.validate((valid: boolean) => {
                if (!valid) return
                this.loading = true
                let postData = JSON.parse(JSON.stringify(this.record))

                otherApi.editCarousel(postData).then(() => {
                    ElMessage.success('保存成功')
                    this.init()

                }).finally(() => { this.loading = false })
            })
        },
        beforeUpload(file: any): boolean {
            if (file.size > 501_000) {
                ElMessage.error('文件请不要超过500k')
                return false
            }
            return true
        },
        uploadError(error: any) {
            console.log(error)
            ElMessage.error('上传失败')
        },
        uploadSuccess(response: any) {
            if (response.code != 1) {
                ElMessage.error(`上传失败 ${response.msg}`)
                return
            }
            ElMessage.success('上传成功')
            this.record.items[this.uploadingIndex].img = response.data.url
        }
    },

    mounted() {
        this.init()
    },
    setup() {
        return {
            Bottom,
            Delete,
            Top,
            Upload,
            formRef: ref(null) as any,
        }
    }
})
</script>
  
<style lang="scss" scoped>
.img1 {
    width: 214px;
    height: 118px;
}
</style>