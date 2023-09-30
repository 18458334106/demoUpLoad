import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')

const setFontSize = () => {
  let doc = document.documentElement
  let fontSize = doc.clientWidth / 120 > 12 ? doc.clientWidth / 120 : 12
  doc.style.fontSize = fontSize + 'px'
}

setFontSize()
window.onresize = setFontSize;
