<template>
	<div v-if="Assets.summary" class="grid grid-cols-3 gap-2">
		<table class="col-span-3 h-24">
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
		<input type="text" class="text-srcwhite bg-srcgray-dark col-span-2 h-7 px-2 focus:ring-2 ring-inset ring-srcblue outline-none" placeholder="Character Name here" v-model.trim="char_name">
		<button class="h-7 ring-2 ring-inset active:bg-srcblack"
			:class="{
				'ring-srcblue hover:bg-srcblack-light' : Boolean(char_name),
				'ring-srcgray cursor-not-allowed': !Boolean(char_name),
				'cursor-progress': fetching
			}"
			@click="confirmDebounce" v-if="verified">
			Confirm
		</button>
		<button class="h-7 ring-2 ring-inset active:bg-srcblack"
			:class="{
				'ring-srcblue hover:bg-srcblack-light' : Boolean(char_name),
				'ring-srcgray cursor-not-allowed': !Boolean(char_name),
				'cursor-progress': fetching
			}"
			@click="verifyDebounce" v-else>
			Verify
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
	import _ from 'lodash';

	function mail_builder(char_id, name, body, amount) {
		let retval = [];
		retval.push(`Contract To: <url=showinfo:1381//${char_id}>${name}</url>`);
		retval.push("");
		retval.push("Content:");
		retval.push(body);
		retval.push("");
		retval.push(`Amount: ${amount.isk()}`);
		return retval.join("\n");
	}


	export default {
		data() {
			return {
				char_name: '',
				char_id: 0,
				verified: false,
				fetching: false,
				Assets,
			}
		},
		methods: {
			async handleVerifyClick() {
				this.fetching = true;
				try {
					const resp = await fetch("https://esi.evetech.net/latest/universe/ids/", {method: "POST", body: JSON.stringify([this.char_name])});
					const data = await resp.json();
					const zkill_link = "<a class=\"text-srcblue\" href=\"https://zkillboard.com/character/"+data.characters[0].id+"\">"+this.char_name+"</a>";
					AlertMsg.content = {
						alert_type: "INFO",
						alert_message: "On confirmation contract will be created to "+zkill_link
					}

					this.verified = true;
					this.fetching = false;
					this.char_id = data.characters[0].id;
					return;
				} catch (err) {
					console.log(err);
					AlertMsg.content = {
						alert_type: "ERROR",
						alert_message: "Could not verify character"
					};
					return;
				}
			},
			async handleConfirmClick() {
				// Already verified: Send confirmation email
				const name = this.char_name;
				if (this.Assets.summary.body.length === 0) {
					AlertMsg.content = {
						alert_type: "WARN",
						alert_message: "None of the requested items are available"
					};
					return;
				}

				const mail_body = mail_builder(this.char_id, name, this.Assets.summary.body, this.Assets.summary.sellfore_total);
				const mail_resp = await fetch("https://us-central1-spoopy-buyback.cloudfunctions.net/sendMail", {
					method: "POST",
					body: mail_body
				});
				if (mail_resp.ok) {
					AlertMsg.content = {
						alert_type: "SUCCESS",
						alert_message: "Confirmed: Contract will be created to "+name+" shortly"
					};
				} else {
					AlertMsg.content = {
						alert_type: "ERROR",
						alert_message: "Could not send confirmation mail: "+mail_resp.statusText
					};
				}
			},
			verifyDebounce: 	_.debounce(async function () {
				await this.handleVerifyClick();
			}, 	2000, {leading: true, trailing: false}),
			confirmDebounce: 	_.debounce(async function () {
				await this.handleConfirmClick();
			}, 2000, {leading: true, trailing: false})
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

