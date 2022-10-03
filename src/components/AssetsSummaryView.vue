<template>
	<div v-if="Assets.summary" class="grid grid-cols-3 gap-2">
		<table class="col-span-3">
			<tr>
				<td class="text-start">Market Total:</td>
				<td class="text-end">{{Assets.summary.market_total.isk()}}</td>
			</tr>
			<tr>
				<td class="text-start">Sellfore Total:</td>
				<td class="text-end cursor-pointer" id="buyback-total">{{Assets.summary.sellfore_total.isk()}}</td>
			</tr>
			<tr>
				<td class="text-start">Effective Rate:</td>
				<td class="text-end">{{Assets.summary.rate.percentage()}}</td>
			</tr>
		</table>
		<input type="text" class="text-srcwhite bg-srcgray-dark col-span-2 h-7 mt-1 px-2 focus:ring-2 ring-inset ring-srcblue outline-none" placeholder="Character Name here" v-model.trim="char_name">
		<button class="h-7 mt-1 ring-2 ring-inset active:bg-srcblack"
			:class="{
				'ring-srcblue hover:bg-srcblack-light' : Boolean(char_name),
				'ring-srcgray cursor-not-allowed': !Boolean(char_name),
				'cursor-progress': fetching
			}"
			@click="handleConfirmClick">
			<span v-if="verified">Confirm</span>
			<span v-else>Verify</span>
		</button>
	</div>
	<div class="ring-2 ring-inset ring-srcgray p-1.5 h-[132px]" v-else>
		<ol class="list-decimal list-inside">
			<li>Copy Items you want to buy to textbox</li>
			<li>Click submit to find which items are available</li>
			<li>Create contract to <span class="font-bold">SPOOPY BUYBACK</span></li>
			<li>Use the amount shown as "Sellforward Total"</li>
			<li>Stinks</li>
		</ol>
	</div>
</template>


<script>
	import {Assets} from '../stores/Assets.js';
	import {AlertMsg} from "../stores/Alert.js";
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';

	export default {
		data() {
			return {
				char_name: '',
				verified: false,
				fetching: false,
				Assets,
			}
		},
		methods: {
			async handleConfirmClick() {
				if (!this.verified) {
					this.fetching = true;
					try {
						const resp = await fetch("https://esi.evetech.net/latest/universe/ids/", {method: "POST", body: JSON.stringify([this.char_name])});
						const data = await resp.json();
						if (!Boolean(data.characters.length)) {
							// Not a valid character
							AlertMsg.content = {
								alert_type: "ERROR",
								alert_message: "Character could not be found"
							}
						} else {
							// Got a valid character
							const zkill_link = "<a class=\"text-srcblue\" href=\"https://zkillboard.com/character/"+data.characters[0].id+"\">"+this.char_name+"</a>";
							AlertMsg.content = {
								alert_type: "INFO",
								alert_message: "On confirmation contract will be created to "+zkill_link
							}

							this.verified = true;
						}
						this.fetching = false;
						return;
					} catch (err) {
						console.log(err);
						AlertMsg.content = {
							alert_type: "ERROR",
							alert_message: "Could not fetch character ID"
						}
						return
					}
				} else {
					// Already verified: Send confirmation email
					// TODO: Implement mailing logic here
					const name = this.char_name;
					this.char_name = "";
					AlertMsg.content = {
						alert_type: "SUCCESS",
						alert_message: "Confirmed: Contract will be created to "+name+" shortly"
					};
				}
			}
		},
		watch: {
			'char_name': {
				handler(newval) {
					this.verified = false;
				}
			}
		}
	};
</script>

