import { App, createApp } from 'vue'
import Toast from './Toast.vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $toast: {
      show: (message: string) => void
    }
  }
}

export const toast = {
  install(app: App) {
    // 创建 Toast 容器
    const container = document.createElement('div')
    document.body.appendChild(container)
    
    // 创建 Toast 实例
    const toastInstance = createApp(Toast).mount(container)
    
    // 添加全局方法
    app.config.globalProperties.$toast = {
      show: (message: string) => {
        (toastInstance as any).show(message)
      }
    }
  }
}

