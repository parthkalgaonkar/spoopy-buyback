<template>
	<div v-if="Assets.summary">
		<table class="w-full">
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
		<p>Create a contract to <span class="font-bold">SPOOPY BUYBACK</span></p>
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
	import ItemView from './ItemView.vue';
	import {Assets} from '../stores/Assets.js';
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';

	export default {
		data() {
			return {
				Assets,
			}
		}
	};
</script>

