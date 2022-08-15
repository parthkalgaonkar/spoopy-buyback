<template>
	<div v-if="AlertMsg.content" class="col-span-full grid grid-cols-12 ring-2 ring-inset p-2" 
		:class="get_alert_color(AlertMsg.content.alert_type)">
		<p class="col-span-11">{{AlertMsg.content.alert_message}}</p>
		<button class="text-end px-2" @click="handleClose">
			<font-awesome-icon icon="fa-solid fa-xmark"/>
		</button>
	</div>
</template>

<script>
	import {AlertMsg} from '../stores/Alert.js';

	export default {
		data() {
			return {
				AlertMsg,
			}
		},
		methods: {
			get_alert_color(type) {
				switch (type) {
					case "ERROR": return ['ring-srcred'];
					case "WARN":  return ['ring-srcyellow'];
					case "INFO":  return ['ring-srccyan'];
				}
			},
			handleClose() {
				AlertMsg.content = undefined;
			}
		}
	}
</script>
