<template>
    <el-dialog v-model="dialogVisible" title="文章" top="1vh" width="980" :z-index="100" @close="formRef.clearValidate()">
        <el-form label-width="86px" :model="record" :rules="rules" inline ref="formRef" v-loading="formLoading">
            <el-row>
                <el-form-item label="标题" prop="title" style="width: 99%;" required>
                    <el-input v-model="record.title" placeholder="标题" />
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="类别" prop="cateId" required style="width: 46%">
                    <el-select v-model="record.cateId" style="width:100%" clearable>
                        <el-option v-for="item in result.data.categoryList" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发布时间" prop="releaseTime" required style="width: 46%;">
                    <el-input v-model="record.releaseTime" />
                </el-form-item>
                <el-form-item label="排序" prop="orderNum" required style="width: 46%;">
                    <el-input-number v-model="record.orderNum" :min="1" :max="999" />
                </el-form-item>

                <el-form-item label="状态" required style="width: 46%;">
                    <el-radio-group v-model="record.visible">
                        <el-radio :value="true">显示</el-radio>
                        <el-radio :value="false">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-row>
            <el-row style="padding: 0 18px;">
                文章内容
                <editor v-model="record.content" :init="editorInit" tinymceScriptSrc="./static/tinymce/tinymce.min.js">
                </editor>
            </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <el-row justify="start">
        <el-form :inline="true">
            <el-form-item label="标题">
                <el-input v-model="queryForm.name" placeholder="" @keydown.enter="init" clearable />
            </el-form-item>
            <el-form-item label="类别">
                <el-select v-model="queryForm.cid" clearable>
                    <el-option v-for="item in result.data.categoryList" :key="item.id" :label="item.name"
                        :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="init">查询</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-row justify="start">
        <el-button type="primary" plain @click="add"
            v-if="userStore.hasAuthorize('/article/article/add')">新建</el-button>
    </el-row><br>
    <el-table v-loading="loading" :data="result.data.rows" style="width: 100%; margin-bottom: 20px" row-key="id" border
        default-expand-all>
        <el-table-column prop="id" label="id" width="90" />
        <el-table-column prop="title" label="标题" />
        <el-table-column label="状态" width="80">
            <template #default="scope">
                <el-tag type="success" v-if="scope.row.visible">显示</el-tag>
                <el-tag type="warning" v-if="!scope.row.visible">隐藏</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="cateName" label="类别" width="110" />
        <el-table-column prop="releaseTime" label="发布时间" width="160" />
        <el-table-column prop="orderNum" label="排序" width="80" />
        <el-table-column label="操作" width="110">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="edit(scope.row)"
                    v-if="userStore.hasAuthorize('/article/article/edit')">编辑</el-button>
                <el-button link type="primary" size="small" @click="del(scope.row)"
                    v-if="userStore.hasAuthorize('/article/article/delete')">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-row justify="end">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" v-model:current-page="query.page"
            v-model:page-size="query.pageSize" :page-count="result.data.totalPages" :page-sizes="[20, 50, 80, 100]"
            :total="result.data.totalRecords" />
    </el-row>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import articleApi from '@/api/article'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import Editor from '@tinymce/tinymce-vue'

export default defineComponent({
    components: {
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
                return articleApi.uploadImg(formData).then(result => {
                    resolve(result.data.url)
                }).catch(error => {
                    if (error.msg) reject('上传失败 ' + error.msg)
                    else reject('上传失败 ' + error)
                })
            }),
            width: '100%'

        }
        const RECORD_EMPTY = {
            id: null,
            cateId: '',
            title: '',
            content: '',
            orderNum: 100,
            visible: false
        } as any
        const query: GeneralDto = {
            page: 1,
            pageSize: 20
        }
        const result: any = {
            data: {
                categoryList: [],
                rows: [],
                totalPages: 0,
                totalRecords: 0
            }
        }
        const record = Object.assign({}, RECORD_EMPTY)
        const queryForm = {
            cid: '',
            name: ''
        }
        const route = useRoute()
        Object.assign(queryForm, route.query)
        const rules = {
            title: [{ required: true, message: '请输入名称', trigger: 'blur' }, { message: '名称不得为空', pattern: /\S+/, trigger: 'blur' }],
            cateId: [{ required: true, message: '请选择类别', trigger: 'blur' }],
            releaseTime: [{ required: true, message: '请输入发布时间', trigger: 'blur' },
            { message: '时间格式不正确, yyyy-mm-dd hh:mm:ss', pattern: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/, trigger: 'blur' }],
            orderNum: [{ required: true, message: '不得为空', trigger: 'blur' }, { pattern: /\S+/, message: '不得为空', trigger: 'blur' }],
        }
        return {
            dialogVisible: false,
            editorInit,
            formLoading: false,
            loading: true,
            query,
            queryForm,
            record,
            RECORD_EMPTY,
            result,
            rules,
            userStore: useUserStore()
        }
    },
    methods: {

        add() {
            Object.assign(this.record, this.RECORD_EMPTY)
            this.dialogVisible = true
        },
        edit(row: any) {
            Object.assign(this.record, row)
            this.dialogVisible = true
        },
        del(row: any) {
            ElMessageBox.confirm(`确认删除文章 ${row.name}`, 'Warning', { type: 'warning', })
                .then(() => {
                    articleApi.deleteArticle(row).then(() => {
                        this.dialogVisible = false
                        ElMessage.success('删除成功')
                        this.init()
                    }).catch(() => { })
                }).catch(() => {
                    ElMessage.info('删除已取消')
                })
        },
        async init() {
            this.loading = true
            let query = Object.assign({}, this.queryForm, this.query)
            let result = await articleApi.getArticleList(query)
            Object.assign(this.result, result)
            this.RECORD_EMPTY.releaseTime = result.data.now
            this.loading = false
        },

        submit() {
            this.formRef.validate((valid: boolean) => {
                if (!valid) return
                this.formLoading = true
                let save = this.record.id == null ? articleApi.addArticle : articleApi.editArticle
                save(this.record).then(() => {
                    this.dialogVisible = false
                    ElMessage.success('保存成功')
                    if (this.query.page !== 1) this.query.page = 1
                    else this.init()
                }).finally(() => {
                    this.formLoading = false
                })
            })

        }
    },
    mounted() {
        this.init()
    },
    setup() {
        return {
            formRef: ref(null) as any
        }
    },

    watch: {
        query: {
            handler(val) {
                this.init()
            },
            deep: true
        }
    }
})
</script>

<style lang="scss" scoped></style>