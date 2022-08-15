<template>
	<div class="grid grid-cols-2 grid-rows-3 gap-2">
		<p class="col-span-2 text-xl">Enter the Janice appraisal code</p>
		<input class="focus:ring-2 ring-inset ring-srcblue col-span-2 px-2 text-srcblack outline-none" placeholder="Janice code here" type="text" v-model.trim="code"/>
		<button class="ring-2 ring-inset active:bg-srcblack"
						:class="{
							'ring-srcblue hover:bg-srcblack-light' : isAlphaNumeric(code),
							'ring-srcgray cursor-not-allowed': !isAlphaNumeric(code),
							'cursor-progress': Boolean(Appraisal.code) && !Boolean(Appraisal.app_data)
						}"
						@click="handleSubmitClick">
						Submit
		</button>
		<button class="ring-2 ring-inset active:bg-srcblack"
						:class="{
							'hover:bg-srcblack-light ring-srcgray-light' : Boolean(code),
							'ring-srcgray cursor-not-allowed': !Boolean(code)
						}"
						id="clear-button"
						@click="handleClearClick">
						Clear
		</button>
	</div>
</template>

<script>
	import {Appraisal} from "../stores/Appraisal.js";
	import {AlertMsg} from "../stores/Alert.js";

	export default {
		data() {
			return {
				code: '',
				Appraisal
			}
		},
		methods: {
			isAlphaNumeric(str) {
				return /^[a-z0-9]+$/gi.test(str);
			},
			handleSubmitClick() {
				var user_input = this.code;

				if (!Boolean(user_input)) return;

				AlertMsg.content = undefined;
				if (!this.isAlphaNumeric(user_input)) {
					AlertMsg.content = {
						alert_type:"ERROR",
						alert_message:"Invalid input. Enter Janice appraisal code (not the whole link)"
					};
					return;
				}
				Appraisal.code = this.code;
			},
			handleClearClick(ev) {
				this.code = '';
				Appraisal.code = undefined;
			}
		}
	}
</script>
