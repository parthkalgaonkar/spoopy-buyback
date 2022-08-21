<template>
	<div v-if="Appraisal.summary">
		<table class="w-full">
			<tr>
				<td class="text-start">Market Total:</td>
				<td class="text-end">{{Appraisal.summary.market_total.isk()}}</td>
			</tr>
			<tr>
				<td class="text-start">Buyback Total:</td>
				<td class="text-end cursor-pointer" id="buyback-total" @click="onClick">{{Appraisal.summary.buyback_total.isk()}}</td>
			</tr>
			<tr>
				<td class="text-start">Effective Rate:</td>
				<td class="text-end">{{Appraisal.summary.rate.percentage()}}</td>
			</tr>
		</table>
		<p>Create a contract to <span class="font-bold">SPOOPY BUYBACK</span></p>
		<p>Contact <span class="font-bold">Scarcrow Archer</span> in case of discrepencies</p>
	</div>
	<div class="ring-2 ring-inset ring-srcgray p-2 h-[116px]" v-else>
		<ol class="list-decimal list-inside">
			<li>Copy items from your inventory in the textbox</li>
			<li>Wait for appraisal to be calculated</li>
			<li>Create a contract to <span class="font-bold">SPOOPY BUYBACK</span></li>
			<li>Use the amount shown as "Buyback Total"</li>
		</ol>
	</div>
</template>


<script>
	import ItemView from './ItemView.vue';
	import {Appraisal} from '../stores/Appraisal.js';
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';

	export default {
		data() {
			return {
				Appraisal,
			}
		},
		methods: {
			onClick(ev) {
				var m_tippy = tippy('#'+ev.target.id, {
					content: 'Copied!',
					trigger: 'manual',
					placement: 'auto',
				});

				var content = new String(ev.target.textContent);

				navigator.clipboard.writeText(content.isk()).then(
					function() {
						m_tippy[0].show();
						setTimeout(function() {
							m_tippy[0].destroy();
						}, 1000);
					},
					function(err) {
						console.error('Async: Could not copy text: ', err);
					}
				);
			}
		}
	};
</script>
