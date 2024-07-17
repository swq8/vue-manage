<template>
    <el-dialog v-model="dialogVisible" title="商品" top="1vh" width="980" :z-index="100" @close="dialogClose">
        <el-form label-width="86px" :model="record" :rules="rules" inline ref="formRef" v-loading="formLoading">
            <el-row>
                <el-form-item label="商品名称" style="width: 99%;" required>
                    <el-input v-model="record.name" placeholder="商品名称" />
                </el-form-item>
            </el-row>
            <el-row align="middle">
                <el-form-item label="商品相册" required style="margin-bottom:0;">
                    图片文件请勿超过500k,建议分辨率800*800&ensp;
                    <el-upload accept=".jpg,.png,.webp" action="/adminApi/goods/goods/upload" name="file"
                        :show-file-list="false" :before-upload="beforeUpload" :on-error="uploadError"
                        :on-success="uploadSuccess">
                        <el-button size="small" type="primary">点击上传图片</el-button>
                    </el-upload>
                </el-form-item>
            </el-row>
            <el-row style="padding: 0 20px;min-height: 150px">
                <div v-for="(img, index) in record.imgsObj" class="icon">
                    <img :src="img">
                    <p><el-button-group size="small">
                            <el-button plain type="primary" :icon="Back" @click="swapImg(index, index - 1)" />
                            <el-button plain type="primary" :icon="Delete" @click="record.imgsObj.splice(index, 1)" />
                            <el-button plain type="primary" :icon="Right" @click="swapImg(index, index + 1)" />
                        </el-button-group></p>
                </div>
            </el-row>
            <el-row>
                <el-form-item label="类别" required style="width: 46%;">
                    <el-cascader v-model="record.cateId" :options="categoryList" :props="{ checkStrictly: true }"
                        style="width:100%" clearable />
                </el-form-item>
                <el-form-item label="品牌" style="width: 46%;">
                    <el-select v-model="record.brandId" style="width:100%" clearable>
                        <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" required style="width: 46%;">
                    <el-input v-model="record.orderNum" />
                </el-form-item>
                <el-form-item label="最近更新" style="width: 46%;">
                    <el-input v-model="record.updateTime" disabled />
                </el-form-item>
                <el-form-item label="快递费用" required style="width: 46%;">
                    <el-radio-group v-model="record.shippingFee">
                        <el-radio :value="true">有</el-radio>
                        <el-radio :value="false">无</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品状态" required style="width: 46%;">
                    <el-radio-group v-model="record.onSell">
                        <el-radio :value="true">正常</el-radio>
                        <el-radio :value="false">下架</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-row>
            <el-row style="padding: 0 18px;">
                商品属性
                <table class="el-table el-table-border table1">
                    <thead>
                        <tr>
                            <th v-for="(item, index) in record.specObj">
                                <a class="del-spec" v-text="item.name" @click="delSpec(index)"></a>
                            </th>
                            <th>价格</th>
                            <th>库存</th>
                            <th>重量</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="specTableNames.length == 0">
                            <td><el-input-number :controls="false" size="small" v-model="record.price" :precision="2"
                                    :step="0.01" :min="0" /></td>
                            <td><el-input-number :controls="false" size="small" v-model="record.stock" :min="0" /></td>
                            <td><el-input-number :controls="false" size="small" v-model="record.weight" :min="0" /></td>
                        </tr>
                        <tr v-for="(item, index) in specTableNames">
                            <td v-for="item1 in item">
                                <img :src="item1.img">
                                <span v-text="item1.val"></span>
                            </td>
                            <td><el-input-number :controls="false" size="small" v-model="record.specProps[index].price"
                                    :precision="2" :step="0.01" :min="0" /></td>
                            <td><el-input-number :controls="false" size="small" v-model="record.specProps[index].stock"
                                    :min="0" /></td>
                            <td><el-input-number :controls="false" size="small" v-model="record.specProps[index].weight"
                                    :min="0" /></td>
                        </tr>
                    </tbody>
                </table>
            </el-row><br>
            <el-row>
                <el-form-item label="规格" style="width: 46%;">
                    <el-select style="width:100%" clearable v-model="specListId" @change="specListChange">
                        <el-option v-for="item in specList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="规格值" style="width: 46%;">
                    <el-select style="width:100%" clearable v-model="specValListId" @change="specValListChange">
                        <el-option v-for="item in specValList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row style="padding: 0 18px;">
                商品详情
                <editor v-model="record.des" :init="editorInit" tinymceScriptSrc="./static/tinymce/tinymce.min.js"></editor>
            </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <!---------------------------- goods dialog end -------------------------------------------------------->

    <!---------------------------- goods list start -------------------------------------------------------->
    <el-row justify="start">
        <el-form inline label-position="left" style="text-align:left">
            <el-form-item label="名称">
                <el-input v-model="queryForm.name" placeholder="商品名称" @keydown.enter="init" clearable />
            </el-form-item>
            <el-form-item label="类别">
                <el-cascader v-model="queryForm.cateId" :options="categoryList" :props="{ checkStrictly: true }"
                    style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="品牌">
                <el-select v-model="queryForm.brandId" clearable>
                    <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="运费">
                <el-select v-model="queryForm.shippingFee" clearable>
                    <el-option :value="false" label="无" />
                    <el-option :value="true" label="有" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="queryForm.onSell" clearable>
                    <el-option :value="true" label="上架" />
                    <el-option :value="false" label="下架" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="init">查询</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-row justify="start">
        <el-button type="primary" plain @click="add" v-if="userStore.hasAuthorize('/goods/goods/add')">新建</el-button>
    </el-row><br>
    <el-table v-loading="loading" :data="result.data.rows" style="width: 100%; margin-bottom: 20px" row-key="id"
        default-expand-all>
        <el-table-column prop="id" label="id" width="90" />
        <el-table-column prop="img" label="图片" width="100">
            <template #default="scope">
                <div class="icon-1">
                    <img :src="scope.row.img">
                </div>
            </template>

        </el-table-column>
        <el-table-column label="类别/名称">
            <template #default="scope">
                <el-text type="info">{{ scope.row.cateName }}</el-text><br>
                {{ scope.row.name }}<br>
            </template>

        </el-table-column>
        <el-table-column prop="price" label="价格" width="100" />

        <el-table-column prop="address" label="操作" width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="edit(scope.row)"
                    v-if="userStore.hasAuthorize('/goods/goods/edit')">编辑</el-button>
                <el-button link type="primary" size="small" @click="del(scope.row)"
                    v-if="userStore.hasAuthorize('/goods/goods/delete')">删除</el-button>
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
import { CascaderOption, ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { objAssign, priceToNumber, priceFormat } from '@/utils'
import Editor from '@tinymce/tinymce-vue'
import { Back, Delete, Right } from '@element-plus/icons-vue'

export default defineComponent({
    components: {
        Editor
    },

    data() {
        const editorInit = {
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
        const RECORD_EMPTY = {
            id: undefined,
            brandId: undefined,
            cateId: undefined,
            imgsObj: [] as any[],
            name: '',
            des: '',
            note: '',
            orderNum: 100,
            onSell: false,
            price: 0 as number | string,
            shippingFee: true,
            brandNewSpec: false,
            specObj: [] as any,
            specProps: [] as any,
            stock: 0,
            updateTime: undefined,
            weight: 0
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
            brandId: undefined,
            cateId: undefined,
            name: '',
            shippingFee: undefined,
            onSell: undefined,
        }
        const route = useRoute()
        Object.assign(queryForm, route.query)
        const rules = {
            name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        }
        return {
            brandList: [] as any[],
            categoryList: [] as CascaderOption[],
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
            specList: [] as any[],
            specListId: null as any,
            specTableNames: [] as any,
            specValList: [] as any[],
            specValListId: null as any,
            userStore: useUserStore()
        }
    },
    methods: {

        add() {
            this.record = JSON.parse(JSON.stringify(this.RECORD_EMPTY))
            this.dialogVisible = true
        },
        edit(row: any) {

            goodsApi.getGoods({ id: row.id }).then(result => {
                let record = JSON.parse(JSON.stringify(result.data.goods))
                record = JSON.parse(JSON.stringify(result.data.goods))
                record.brandNewSpec = false
                this.record = record
                this.dialogVisible = true
            })
        },
        del(row: any) {

        },
        dialogClose() {
            this.specListId = ''
            this.specListChange('')
            if (this.formRef) this.formRef.clearValidate()

        },
        swapImg(source: number, target: number) {
            if (target >= this.record.imgsObj.length) target = 0
            else if (target < 0) target = this.record.imgsObj.length - 1
            if (source == target) return
            let tmp = this.record.imgsObj[target]
            this.record.imgsObj[target] = this.record.imgsObj[source]
            this.record.imgsObj[source] = tmp
        },
        async init() {
            this.loading = true
            let query = Object.assign({}, this.queryForm, this.query)
            let result = await goodsApi.getGoodsList(query)
            Object.assign(this.result, result)
            this.result.data.rows.forEach((item: any) => {
                item.price = item.price.toFixed(2)
            })
            this.brandList = result.data.brandList
            this.categoryList.length = 0
            result.data.categoryList.forEach((item: any) => {
                if (item.parentId === 0) {
                    this.categoryList.push({ label: item.name, value: item.id })
                }
            });
            this.categoryList.forEach((item: any) => {
                this.recursion(item)
            })
            this.specList.length = 0
            result.data.specList.forEach((item: any) => {
                this.specList.push({ name: `${item.name} [${item.note}]`, id: item.id })
            })
            this.loading = false
        },

        // recursion render category tree
        recursion(parentItem: CascaderOption) {
            parentItem.children = []
            for (let item of this.result.data.categoryList) {
                if (item.parentId === parentItem.value) {
                    parentItem.children.push({ label: item.name, value: item.id })
                }
            }
            for (let i = 0; i < parentItem.children.length; i++) {
                this.recursion(parentItem.children[i])
            }
        },

        submit() {
            this.formRef.validate((valid: boolean) => {
                if (!valid) return
                let msg = this.validate()
                if (msg != null) {
                    ElMessage.error(msg)
                    return
                }
                this.formLoading = true
                let data: any = JSON.parse(JSON.stringify(this.record))
                delete data.createTime
                delete data.updateTime
                if (Array.isArray(data.cateId)) data.cateId = data.cateId[data.cateId.length - 1]
                if (data.specObj.length == 0) data.brandNewSpec = true
                data.specProps.forEach((item: any) => {
                    delete item.des
                    if (data.brandNewSpec) item.id = null
                })
                let save = this.record.id == null ? goodsApi.addGoods : goodsApi.editGoods
                save(data).then(() => {
                    this.dialogVisible = false
                    ElMessage.success('保存成功')
                    if (this.query.page !== 1) this.query.page = 1
                    else this.init()
                }).finally(() => {
                    this.formLoading = false
                })
            })

        },
        validate() {
            if (this.record.name.trim().length == 0) return '商品名称不能为空';
            if (this.record.imgsObj.length == 0) return '商品相册不能为空';
            if (this.record.cateId == null) return '请选择类别';
            return null
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
            this.record.imgsObj.push(response.data.url)
        },
        specListChange(id: any) {
            this.specValList.length = 0
            this.specValListId = null
            if (id.length == 0) return
            this.result.data.specList.forEach((item: any) => {
                if (item.id == id) {
                    for (let i = 0; i < item.itemsObj.length; i++) {
                        this.specValList.push({ name: item.itemsObj[i].val, id: i })
                    }
                    return
                }
            });

        },
        specValListChange(id: any) {
            if (id.length == 0) return
            let arr = this.result.data.specList.filter((item: any) => { return item.id == this.specListId })
            if (arr.length != 1) return
            let specItem = arr[0]
            let specObj = specItem.itemsObj[id]
            this.addSpec(specItem.name, specObj)
            this.record.brandNewSpec = true
        },
        addSpec(name: string, specObj: any) {
            for (let i = 0; i < this.record.specObj.length; i++) {
                let item = this.record.specObj[i]
                if (item.name == name) {
                    if (item.list.filter((obj: any) => { return obj.val == specObj.val }).length == 0)
                        item.list.push({ ...specObj })
                    return
                }
            }
            this.record.specObj.push({ name, list: [{ ...specObj }] })
        },
        delSpec(index: number) {
            ElMessageBox.confirm(
                `确认删除规格 ${this.record.specObj[index].name}`,
                'Warning', { type: 'warning', }).then(() => {
                    this.record.specObj.splice(index, 1)
                }).catch(() => { })
        },
    },
    mounted() {
        this.init()
    },
    setup() {
        return {
            formRef: ref(null) as any,
            Back,
            Delete,
            Right
        }
    },

    watch: {
        query: {
            handler(val) {
                this.init()
            },
            deep: true
        },
        // generation talbe spec names from goods spec
        'record.specObj': {
            handler(val) {
                this.specTableNames.length = 0
                let len = val.length
                if (len == 0) {
                    this.record.specProps.length = 0
                    return
                }
                let indexArr = [] as number[]
                for (let i = 0; i < len; i++) indexArr[i] = 0

                while (indexArr[0] < val[0].list.length) {
                    let namesItem = [] as any
                    for (let i = 0; i < len; i++) {
                        namesItem.push(val[i].list[indexArr[i]])
                    }
                    this.specTableNames.push(namesItem)
                    if (this.record.specProps && this.record.specProps.length < this.specTableNames.length) {
                        this.record.specProps.push({ price: 0, stock: 0, weight: 0 })
                    }
                    indexArr[len - 1]++
                    for (let i = len - 1; i > 0; i--) {
                        if (indexArr[i] >= val[i].list.length) {
                            indexArr[i] = 0
                            indexArr[i - 1]++
                        }
                    }
                }
                let specPropsLen = this.record.specProps.length
                let num = specPropsLen - this.specTableNames.length
                if (num > 0) this.record.specProps.splice(specPropsLen - num, num)

            },
            deep: true

        }
    }
})
</script>

<style lang="scss" scoped>
.del-spec {
    color: var(--el-color-primary);
    cursor: pointer;
}

div.icon {
    margin: 0 0.2em;

    img {
        border: #d6d8db 1px solid;
        height: 105px;
        width: 105px;
    }

    p {
        margin: 0.1em 0 0.8em 0;
    }
}

div.icon-1 {
    img {
        border: #d6d8db 1px solid;
        height: 80px;
        width: 80px;
    }
}

.table1 {
    border: 2px solid var(--el-table-border-color);
    border-collapse: collapse;
    width: 100%;

    img {
        max-height: 40px;
        max-width: 40px;
        vertical-align: middle;
    }

    span {
        display: inline-block;
        line-height: 40px;
    }

    td,
    th {
        border: 1px solid var(--el-table-border-color);
        height: 40px;
    }
}
</style>