import { createApp } from 'vue'
import { do_custom_print } from './custom_print.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

library.add(faXmark);

do_custom_print();

import App from './App.vue'

createApp(App)
	.component('font-awesome-icon', FontAwesomeIcon)
	.mount('#app')

import './index.css'
