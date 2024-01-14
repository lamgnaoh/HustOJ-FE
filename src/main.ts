import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
// @ts-ignore
import locale from 'view-design/dist/locale/en-US';
import '../src/style/base.less'
import VueWangeditor from 'vue-wangeditor-simple'
import ElementUI from 'element-ui'
// @ts-ignore
import locale_en from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css'
import VueHighlightJS from 'vue-highlightjs'
import Echarts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markPoint'

Vue.config.productionTip = false
Vue.use(ElementUI , {locale:locale_en})
Vue.use(VueWangeditor)
Vue.use(ViewUI , {locale})
Vue.use(VueHighlightJS)
Vue.component('ECharts', Echarts)

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requireAuthAdmin)) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//     // true is Admin
//     const isAdmin =
//         (window.localStorage.getItem('role') as any).indexOf('USER') === -1
//     if (!isAdmin) {
//       next(false)
//     } else {
//       next()
//     }
//     next()
//   } else {
//     next()
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
