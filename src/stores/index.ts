import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const stores = createPinia()
stores.use(piniaPluginPersistedstate)

export default stores