<template>
    <el-card>
        <template #header>邮费规则</template>
        <el-form inline :model="record" v-loading="loading" :disabled="!hasEditAuthroize" ref="formRef"
            style="text-align: left;">
            <el-form-item label="首重重量(g)">
                <el-input-number :controls="false" v-model="record.firstWeight" :step="1" :min="1" :value-on-clear="0" />
            </el-form-item>
            <el-form-item label="首重价格(元)">
                <el-input-number :controls="false" :precision="2" v-model="record.firstFee" :step="0.01" :min="0"
                    :value-on-clear="0" />
            </el-form-item>
            <el-form-item label="续重重量(g)">
                <el-input-number :controls="false" v-model="record.additionalWeight" :step="1" :min="1"
                    :value-on-clear="0" />
            </el-form-item>
            <el-form-item label="续重价格(元)">
                <el-input-number :controls="false" :precision="2" v-model="record.additionalFee" :step="0.01" :min="0"
                    :value-on-clear="0" />
            </el-form-item>
            <el-form-item label="其他地区默认运费">
                <el-radio-group v-model="record.otherDefault">
                    <el-radio :value="true">开启</el-radio>
                    <el-radio :value="false">关闭</el-radio>
                </el-radio-group>
            </el-form-item>
            <br>
            <el-text>注意：如果关闭<el-text type="danger" tag="b"> 其他地区默认运费 </el-text>选项，那么未设置运费规则的地区将无法送达！</el-text>
            <br><br>
            <el-table :data="record.provinceFees" border>
                <el-table-column label="首重价格" width="120">
                    <template #default="scope">
                        <el-form-item>
                            <el-input-number :controls="false" :precision="2" v-model="scope.row.firstFee"
                                style="width: 80px;" :value-on-clear="0" />
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="续重价格" width="120">
                    <template #default="scope">
                        <el-form-item>
                            <el-input-number :controls="false" :precision="2" v-model="scope.row.additionalFee"
                                style="width: 80px;" :value-on-clear="0" />
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="地区">
                    <template #default="scope">
                        <el-form-item style="width:100%" :prop="`provinceFees[${scope.$index}].provinces`" :rules="{
                            required: true,
                            message: '地区不能为空',
                            trigger: 'change'
                        }
                            ">
                            <el-select v-model="scope.row.provinces" multiple placeholder="请选择" style="width: 95%" clearable
                                @change="provincesChange(scope)">
                                <el-option v-for="item in provinces" :key="item.code" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="170">
                    <template #default="scope">
                        <el-button-group>
                            <el-button type="primary" plain :icon="Top" @click="swap(scope.$index, scope.$index - 1)" />
                            <el-button type="primary" plain :icon="Delete"
                                @click="record.provinceFees.splice(scope.$index, 1)" />
                            <el-button type="primary" plain :icon="Bottom" @click="swap(scope.$index, scope.$index + 1)" />
                        </el-button-group>
                    </template>
                </el-table-column>
                <template #append>
                    <div style="padding:0.7em;text-align: left;">
                        <el-button type="success" @click="add">增加规则</el-button>
                    </div>
                </template>
            </el-table>
            <br>
            <el-row justify="center">
                <el-button type="primary" @click="submit" v-if="hasEditAuthroize">保存</el-button>
            </el-row>
        </el-form>
        <el-row>

        </el-row>
    </el-card><br>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue'
import expressApi from '@/api/express'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { Bottom, Delete, Top } from '@element-plus/icons-vue'

export default defineComponent({
    data() {
        const userStore = useUserStore()
        const hasEditAuthroize = userStore.hasAuthorize("/express/feeRule/edit")
        return {
            hasEditAuthroize,
            loading: true,
            provinces: [] as any,
            record: {
                firstWeight: 0 as number,
                firstFee: 0 as number,
                additionalFee: 0 as number,
                additionalWeight: 0 as number,
                enable: false,
                provinceFees: [] as any,
            } as any,

        }
    },
    methods: {

        add() {
            this.record.provinceFees.push({
                firstFee: 5,
                additionalFee: 3,
                provinces: []
            })
        },
        async init() {
            this.loading = true
            let result = await expressApi.getFeeRule()
            let record = result.data.record
            Object.assign(this.record, record)
            Object.assign(this.provinces, result.data.provinces)
            this.loading = false
        },
        provincesChange(scope: any) {
            let arr = this.record.provinceFees[scope.$index].provinces
            if (arr.length == 0) return
            let code = arr[arr.length - 1]
            for (let i = 0; i < this.record.provinceFees.length; i++) {
                if (i == scope.$index) continue
                this.record.provinceFees[i].provinces = this.record.provinceFees[i].provinces
                    .filter((element: any) => element !== code)
            }
        },
        swap(from: number, to: number) {
            if (this.record.provinceFees.length < 2) return
            if (to < 0) to = this.record.provinceFees.length - 1
            else if (to >= this.record.provinceFees.length) to = 0
            let obj = Object.assign({}, this.record.provinceFees[from])
            this.record.provinceFees[from] = Object.assign({}, this.record.provinceFees[to])
            this.record.provinceFees[to] = obj

        },
        submit() {
            this.formRef.validate((valid: boolean) => {
                if (!valid) return
                this.loading = true
                let postData = JSON.parse(JSON.stringify(this.record))
                expressApi.editFeeRule(postData).then(() => {
                    ElMessage.success('保存成功')
                    this.init()

                }).finally(() => { this.loading = false })
            })
        },
    },

    mounted() {
        this.init()
    },
    setup() {
        return {
            Bottom,
            Delete,
            Top,
            formRef: ref(null) as any,
        }
    }
})
</script>
  
<style lang="scss" scoped></style>