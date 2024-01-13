<template>
  <div class="container">
    <div class="box">
      <div class="login-content-left">
        <img :src="loginLeftPng" />
        <div class="login-content-left-mask">
          <div>{{ systemTitle }}</div>
          <div>{{ systemSubTitle }}</div>
        </div>
      </div>

      <div class="box-inner" v-loading="formLoading">
        <h1>欢迎登录</h1>
        <el-form class="form">
          <el-input size="large" v-model="form.name" placeholder="用户名" type="text" maxlength="50">
            <template #prepend>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
          <el-input size="large" ref="password" v-model="form.pass" :type="passwordType" placeholder="密码" name="password"
            maxlength="50" @keydown.enter="submit">
            <template #prepend>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
            <template #append>

              <el-icon @click="passwordTypeChange">
                <Hide v-if="!passwordType" />
                <View v-if="passwordType" />
              </el-icon>
            </template>
          </el-input>

          <el-button type="primary" :disabled="formLoading" @click="submit" style="width: 100%;" size="large">
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { systemTitle, systemSubTitle } from '@/config'
import mainApi from '@/api/main'
import JSEncrypt from 'jsencrypt'
import { defineComponent } from 'vue'
import { RouteLocationRaw, useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import loginLeftPng from '@/assets/login/left.jpg'
import { useUserStore } from '@/stores/user'


export default defineComponent({
  data() {
    const form = {
      name: 'demo',
      pass: 'demodemo'
    }
    return {
      loginLeftPng,
      systemTitle,
      systemSubTitle,
      form,
      formLoading: false,
      passwordType: 'password',
      route: useRoute(),
      router: useRouter(),
      userStore: useUserStore()
    }
  },
  methods: {
    checkForm() {
      return new Promise((resolve) => {
        if (this.form.name === '') {
          ElMessage.warning('账号不能为空')
          return;
        }
        if (this.form.pass === '') {
          ElMessage.warning('密码不能为空')
          return;
        }
        resolve(true)
      })
    },

    passwordTypeChange() {
      this.passwordType = this.passwordType === '' ? 'password' : ''
    },

    submit() {
      this.checkForm()
        .then(async () => {
          this.formLoading = true
          let rsaPubKey = ''
          try {
            rsaPubKey = (await mainApi.getRsaPubKey()).data.rsaPubKey
          } catch (error) {
            this.formLoading = false
            return
          }
          let jsencrypt = new JSEncrypt()
          jsencrypt.setPublicKey(rsaPubKey)
          let passEnc = jsencrypt.encrypt(this.form.pass)
          if (passEnc == false) {
            ElMessage.error('jsencrypt error')
            this.formLoading = false
            return
          }
          let params: GeneralDto = {
            name: this.form.name,
            pass: passEnc
          }
          this.userStore.login(params)
            .then(() => {
              ElMessage.success('登录成功')
              this.router.push(this.route.query.redirect as RouteLocationRaw || '/home')
            }).catch(() => { this.formLoading = false })
        })
    }

  }
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #fff url('@/assets/login/bg.png') no-repeat center;
  overflow: hidden;
  background-size: cover;
  cursor: pointer;
  user-select: none;

  .el-icon {
    font-size: 1.2em;
  }

  .box {
    width: 1160px;
    display: flex;
    position: absolute;
    left: 50%;
    top: 50%;
    background: white;
    border-radius: 8px;
    transform: translate(-50%, -50%);
    height: 440px;
    overflow: hidden;
    box-shadow: 0 6px 20px 5px rgba(152, 152, 152, 0.1),
      0 16px 24px 2px rgba(117, 117, 117, 0.14);

    .login-content-left {
      position: relative;

      img {
        height: 440px;
      }

      .login-content-left-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(rgba(0, 204, 222, 0.8), rgba(51, 132, 224, 0.8));
        text-align: center;
        color: #fff;
        font-size: 1.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        letter-spacing: 2px;

        div:nth-child(1) {
          font-size: 3.5rem;
          margin-bottom: 1em;
        }
      }
    }

    .box-inner {
      width: 500px;

      h1 {
        margin-top: 80px;
        text-align: center;
      }

      .form {
        width: 80%;
        margin: 50px auto 15px;

        .el-input {
          margin-bottom: 20px;
        }

        .password-icon {
          cursor: pointer;
          color: #409eff;
        }
      }

      .fixed-top-right {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
  }
}

@media screen and (max-width: 1260px) {
  .login-content-left {
    display: none;
  }

  .box {
    width: 500px !important;
  }
}

@media screen and (max-width: 750px) {

  .container .box,
  .container .box-inner {
    width: 100vw !important;
    height: 100vh;
    box-shadow: none;
    left: 0;
    top: 0;
    transform: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      margin-top: 0;
    }
  }
}
</style>
