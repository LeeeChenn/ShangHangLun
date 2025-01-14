import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupStore } from '@/store';
import { toast } from '@/plugin/toast/toast';

const app = createApp(App)

setupStore(app);

app.use(toast);

app.mount('#app')