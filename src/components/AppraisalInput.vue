<template>
	<p>Enter the Janice appraisal code</p>
	<input class="border-2" type="text" v-model="code"/>
	<button class="bg-blue-500" @click="handleClick">Submit</button>
</template>

<script>
	import {Appraisal} from "../stores/Appraisal.js";
	export default {
		data() {
			return {
				code: ''
			}
		},
		methods: {
			handleClick() {
				Appraisal.link = this.code;
			}
		}
	}
</script>
