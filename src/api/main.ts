import request from '@/utils/system/request'

const mainApi = {
  /** get RSA public key */
  getRsaPubKey: () => {
    return request({
      url: '/main/rsaPubKey',
      method: 'post'
    })
  },
  
  /** 登录api */
  login(data: object) {
    return request({
      url: '/main/login',
      method: 'post',
      data
    })
  },

  /** 退出登录Api */
  logout: () => {
    return request({
      url: '/main/logout',
      method: 'post'
    })
  },

  /** get user info */
  getInfo: () => {
    return request({
      url: '/main/info',
      method: 'post'
    })
  },

}
export default mainApi