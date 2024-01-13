
## 介绍

使用最新版本的vue3+vite+element-plus开发而成，目的是为了解决通用型的业务中后台系统复杂的配置。
<br>
演示地址:<https://smart-mall.g686.net/manage> 账号:demo 密码:demodemo

#### 特色功能

- 适合中后台开发的路由配置、状态管理机制（状态默认支持本地存储）、已封装完善的axios及api管理机制
- 极方便扩展的主题配置功能，默认支持三种典型的中后台风格
- 简易配置的页面缓存功能，只需配置noCache属性，无需配置其他的任何属性，如组件名称，路由名称等等很多框架需要配置的东西
- 典型增删改查的三种业务表格，详情请查看“页面栏目”内的“业务表格”、“分类联动表格”、“树联动表格”
- 无路由跳转的刷新功能，支持缓存页面刷新，目前了解的多数框架都不支持缓存页面的刷新
- 手写版本的各类自定义指令
- 已经过多个中后台业务检验过的表格公用组件及弹窗公用组件，详情请查看“页面栏目”内的“业务表格”、“分类联动表格”、“树联动表格”

#### 主要技术栈

- MVVM框架：vue v3
- 工程化管理：vite v2
- UI框架：element-plus
- 路由管理：vue-router v4
- 状态管理：pinia
- 实用工具库：@vueuse/core

#### 使用

```bash
# 安装依赖，推荐使用pnpm
pnpm install

# 运行
pnpm run dev

# 打包
pnpm run build
```
### 源代码
项目地址: <https://github.com/swq8/smart-mall><br>
管理界面: <https://github.com/swq8/vue-manage>