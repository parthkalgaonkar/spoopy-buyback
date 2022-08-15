<template>
	<table v-if="Appraisal.summary">
		<tr>
			<td class="text-start">Market Total:</td>
			<td class="text-end">{{Appraisal.summary.market_total.isk()}}</td>
		</tr>
		<tr>
			<td class="text-start">Buyback Total:</td>
			<td class="text-end cursor-pointer" id="buyback-total" @click="onClick">{{Appraisal.summary.buyback_total.isk()}}</td>
		</tr>
		<tr>
			<td class="text-start">Effective Buyback Rate:</td>
			<td class="text-end">{{Appraisal.summary.rate.percentage()}}</td>
		</tr>
		<tr>
			<td class="text-start">Trade Hub:</td>
			<td class="text-end">{{Appraisal.summary.market}}</td>
		</tr>
	</table>
	<div class="ring-2 ring-inset ring-srcgray p-2" v-else>
		<ol class="list-decimal list-inside">
			<li>Go to <a class="text-srcblue hover:underline" href="https://janice.e-351.com/" target="_blank">Janice</a></li>
			<li>Paste your items and create an appraisal</li>
			<li>Put the appraisal code (last part of URL) here</li>
			<li>Create a contract to Spoopy Buyback</li>
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
