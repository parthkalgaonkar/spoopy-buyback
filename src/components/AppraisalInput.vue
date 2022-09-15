<template>
	<div class="grid grid-cols-3 gap-2">
		<textarea class="focus:ring-2 h-24 ring-inset ring-srcblue col-span-3 px-2 text-srcblack outline-none" placeholder="Enter your items here" type="text" v-model.trim="eve_input"/>
		<button class="h-7 ring-2 ring-inset active:bg-srcblack"
						:class="{
							'ring-srcblue hover:bg-srcblack-light' : Boolean(eve_input),
							'ring-srcgray cursor-not-allowed': !Boolean(eve_input),
							'cursor-progress': Boolean(Appraisal.eve_input) && !Boolean(Appraisal.app_data)
						}"
						@click="handleSubmitClick">
						Submit
		</button>
		<button class="h-7 ring-2 ring-inset active:bg-srcblack"
						:class="{
							'hover:bg-srcblack-light ring-srcgray-light' : Boolean(eve_input),
							'ring-srcgray cursor-not-allowed': !Boolean(eve_input)
						}"
						id="clear-button"
						@click="handleClearClick">
						Clear
		</button>
		<ToggleSwitch off_text="SELL" on_text="BUY" @toggle="handleToggleSwitch"/>
	</div>
</template>

<script>
	import {Appraisal} from "../stores/Appraisal.js";
	import {Mode} from "../stores/Mode.js";
	import {AlertMsg} from "../stores/Alert.js";
	import ToggleSwitch from "./ToggleSwitch.vue";

	export default {
		data() {
			return {
				eve_input: '',
				Appraisal,
				Mode
			}
		},
		components: {
			ToggleSwitch,
		},
		methods: {
			isAlphaNumeric(str) {
				return /^[a-z0-9]+$/gi.test(str);
			},
			handleSubmitClick() {
				var user_input = this.eve_input;

				if (!Boolean(user_input)) return;

				AlertMsg.content = undefined;
				Appraisal.eve_input = user_input;
			},
			handleClearClick(ev) {
				this.eve_input = '';
				Appraisal.eve_input = undefined;
			},
			handleToggleSwitch(value) {
				Mode.buy_mode = value;
			}
		}
	}
</script>
