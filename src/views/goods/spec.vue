<template>
    <el-dialog v-model="dialogVisible" title="商品规格" width="65%">
        <el-form label-width="78px" :model="record" :rules="rules" ref="formRef" v-loading="formLoading">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="record.name" placeholder="规格" />
                    </el-form-item>

                </el-col>
                <el-col :span="12">
                    <el-form-item label="备注">
                        <el-input v-model="record.note" placeholder="备注" />
                    </el-form-item>
                </el-col>
                <el-table :data="record.itemsObj" border>
                    <el-table-column label="规格值">
                        <template #default="scope">
                            <el-form-item label-width="0" :prop="`itemsObj[${scope.$index}].val`" :rules="{
                                    required: true,
                                    message: '请输入规格值',
                                    pattern: /\S+/,
                                    trigger: 'blur',
                                }
                                ">
                                <el-input v-model="record.itemsObj[scope.$index].val" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="提示信息">
                        <template #default="scope">
                            <el-form-item label-width="0">
                                <el-input v-model="scope.row.hint" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="缩略图(40px40px)" width="170">
                        <template #default="scope">
                            <div class="imgRow">
                                <img class="specImg" :src="scope.row.img" v-if="scope.row.img.length > 1">
                                <el-button type="warning" plain :icon="Delete"
                                    @click="record.itemsObj[scope.$index].img = ''"
                                    v-if="scope.row.img.length > 1"></el-button>
                                <el-upload accept=".jpg,.png,.webp" action="/adminApi/goods/spec/upload" name="file"
                                    :before-upload="beforeUpload" :show-file-list="false" :on-error="uploadError"
                                    :on-success="uploadSuccess" ref="uploadRef">
                                    <el-button type="primary" plain :icon="Upload" @click="uploadingIndex = scope.$index" />
                                </el-upload>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="170" align="center">
                        <template #default="scope">
                            <el-button-group v-if="record.itemsObj.length > 1">
                                <el-button type="primary" plain :icon="Top" @click="swap(scope.$index, scope.$index - 1)" />
                                <el-button type="primary" plain :icon="Delete"
                                    @click="record.itemsObj.splice(scope.$index, 1)" />
                                <el-button type="primary" plain :icon="Bottom"
                                    @click="swap(scope.$index, scope.$index + 1)" />
                            </el-button-group>
                        </template>
                    </el-table-column>
                    <template #append>
                        <div style="margin: 0.7em auto">
                            <el-button type="success"
                                @click="record.itemsObj.push(Object.assign({}, SPEC_ITEM_EMPTY))">增加规格</el-button>
                        </div>
                    </template>
                </el-table>
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
            <el-form-item label="名称">
                <el-input v-model="queryForm.name" placeholder="" @keydown.enter="init" clearable />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="init">查询</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-row justify="start">
        <el-button type="primary" plain @click="add" v-if="userStore.hasAuthorize('/goods/spec/add')">新建</el-button>
    </el-row><br>
    <el-table v-loading="loading" :data="result.data.rows" style="width: 100%; margin-bottom: 20px" row-key="id" border>
        <el-table-column prop="id" label="id" width="80" />
        <el-table-column label="规格名称[备注]">
            <template #default="scope">
                {{ scope.row.name + '[' + scope.row.note + ']' }}
            </template>
        </el-table-column>
        <el-table-column prop="itemsName" label="规格数据" />
        <el-table-column label="操作" width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="edit(scope.row)"
                    v-if="userStore.hasAuthorize('/goods/spec/edit')">编辑</el-button>
                <el-button link type="primary" size="small" @click="del(scope.row)"
                    v-if="userStore.hasAuthorize('/goods/spec/delete')">删除</el-button>
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
import goodsApi from '@/api/goods'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Bottom, Delete, Top, Upload } from '@element-plus/icons-vue'
import type { UploadInstance } from 'element-plus'

export default defineComponent({
    data() {
        const RECORD_EMPTY = {
            id: null,
            itemsObj: [] as any,
            name: '',
            note: '',
        }
        const SPEC_ITEM_EMPTY = {
            val: '',
            hint: '',
            img: ''
        }
        const query: GeneralDto = {
            page: 1,
            pageSize: 20
        }
        const result: any = {
            data: {
                rows: [],
                totalPages: 0,
                totalRecords: 0
            }
        }
        const record = Object.assign({}, RECORD_EMPTY)
        const queryForm = {
            name: ''
        }
        const route = useRoute()
        Object.assign(queryForm, route.query)
        const rules = {
            name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        }
        return {
            dialogVisible: false,
            formLoading: false,
            loading: true,
            query,
            queryForm,
            record,
            RECORD_EMPTY,
            result,
            rules,
            SPEC_ITEM_EMPTY,
            uploadingIndex: 0,
            userStore: useUserStore()
        }
    },
    methods: {

        add() {
            if (this.formRef) this.formRef.clearValidate()
            Object.assign(this.record, this.RECORD_EMPTY)
            this.record.itemsObj.length = 0
            this.dialogVisible = true
        },
        edit(row: any) {
            if (this.formRef) this.formRef.clearValidate()
            this.record = JSON.parse(JSON.stringify(row))
            this.dialogVisible = true
        },
        del(row: any) {
            ElMessageBox.confirm(
                `确认删除商品规格 ${row.name}`,
                'Warning',
                {
                    type: 'warning',
                }
            )
                .then(() => {
                    goodsApi.deleteSpec(row).then(() => {
                        this.dialogVisible = false
                        ElMessage({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                        })
                        this.init()
                    }).catch(() => {

                    })
                })
                .catch(() => {
                    ElMessage({
                        type: 'info',
                        message: '删除已取消',
                    })
                })
        },
        async init() {
            this.loading = true
            let query = Object.assign({}, this.queryForm, this.query)
            let result = await goodsApi.getSpecList(query)
            Object.assign(this.result, result)
            for (const row of this.result.data.rows) {
                let itemsName: string = ''
                for (let i = 0; i < row.itemsObj.length; i++) {
                    itemsName += row.itemsObj[i].val
                    if (i + 1 < row.itemsObj.length) {
                        if (itemsName.length > 42) {
                            itemsName = itemsName.substring(0, 42) + ' ...'
                            break
                        }
                        itemsName += ', '
                    }
                }
                row.itemsName = itemsName
            }
            this.loading = false
        },


        submit() {
            this.formRef.validate((valid: boolean) => {
                if (!valid) return
                this.formLoading = true
                let save = this.record.id == null ? goodsApi.addSpec : goodsApi.editSpec
                save(this.record).then(() => {
                    this.dialogVisible = false
                    ElMessage.success('保存成功')
                    if (this.query.page !== 1) this.query.page = 1
                    else this.init()
                }).finally(() => {
                    this.formLoading = false
                })
            })
        },
        swap(from: number, to: number) {
            if (this.record.itemsObj.length < 2) return
            if (to < 0) to = this.record.itemsObj.length - 1
            else if (to >= this.record.itemsObj.length) to = 0
            let obj = Object.assign({}, this.record.itemsObj[from])
            this.record.itemsObj[from] = Object.assign({}, this.record.itemsObj[to])
            this.record.itemsObj[to] = obj

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
            this.record.itemsObj[this.uploadingIndex].img = response.data.url
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
            uploadRef: ref<UploadInstance>()
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

<style lang="scss" scoped>
.imgRow {
    display: flex;
    align-items: center;

    button {
        margin-left: 0.4em;
    }

    .specImg {
        border: #d6d8db 1px solid;
        height: 40px;
        width: 40px;
    }
}
</style>