<template>
    <div v-loading="loading">
        <el-descriptions class="margin-top" title="database" :column="2" size="large" border>
            <template #extra>
                <el-button @click="init" :icon="Refresh" circle></el-button>
            </template>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">version</div>
                </template>
                {{ record.dbVersion }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">trx isolation level</div>
                </template>
                {{ record.dbTxIsolation }}
            </el-descriptions-item>
        </el-descriptions>

        <el-descriptions class="margin-top" title="redis" :column="2" size="large" border>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        version
                    </div>
                </template>
                {{ record.redisVersion }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        used memory
                    </div>
                </template>
                {{ record.redisMemory }}
            </el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" title="java" :column="2" size="large" border>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        os name
                    </div>
                </template>
                {{ record.javaOsName }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        os version
                    </div>
                </template>
                {{ record.javaOsVersion }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        name
                    </div>
                </template>
                {{ record.javaName }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        version
                    </div>
                </template>
                {{ record.javaVersion }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        vendor
                    </div>
                </template>
                {{ record.javaVendor }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        vm info
                    </div>
                </template>
                {{ record.vmInfo }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        cpu cores
                    </div>
                </template>
                {{ record.cpuCores }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        max memory
                    </div>
                </template>
                {{ record.maxMemory }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        total memory
                    </div>
                </template>
                {{ record.totalMemory }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        free memory
                    </div>
                </template>
                {{ record.freeMemory }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        spring boot
                    </div>
                </template>
                {{ record.springBootVersion }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        application dir
                    </div>
                </template>
                {{ record.applicationDir }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        start time
                    </div>
                </template>
                {{ record.startTime }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        uptime
                    </div>
                </template>
                {{ record.upTime }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        GC
                    </div>
                </template>
                {{ record.javaGc }}
            </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" size="large" border>
            <el-descriptions-item label="args"> {{ record.args }} </el-descriptions-item>
        </el-descriptions>

        <el-descriptions class="margin-top" title="front" :column="2" size="large" border>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        vue
                    </div>
                </template>
                {{ vueVersion }}
            </el-descriptions-item>
            <el-descriptions-item :width="width25">
                <template #label>
                    <div class="cell-item">
                        element-plus
                    </div>
                </template>
                {{ epVersion }}
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, version as vueVersion } from 'vue'
import systemApi from '@/api/system'
import { version as epVersion } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

export default defineComponent({
    data() {
        const record: any = {}
        return {
            loading: true,
            record,
            epVersion,
            width25: '25%',
            vueVersion
        }
    },
    methods: {
        async init() {
            this.loading = true
            let record = await systemApi.getSystemInfo()
            Object.assign(this.record, record.data.record)
            this.loading = false
        }
    },

    mounted() {
        this.init()
    },
    setup() {
        return {
            Refresh
        }
    }
})
</script>
  
<style lang="scss" scoped>
.el-descriptions {
    margin-top: 20px;
}

.cell-item {
    display: flex;
    align-items: center;

}

.half-record {
    width: 50%;
}

.margin-top {
    margin-top: 20px;
}
</style>