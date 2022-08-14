<template>
	<div v-if="Appraisal.summary">
		<p>Total Market Buy: {{Appraisal.summary.market_total}}</p>
		<p>Total Buyback Buy: {{Appraisal.summary.buyback_total}}</p>
		<p>Effective Buyback rate: {{Appraisal.summary.rate}}</p>
		<p>Trade Hub: {{Appraisal.summary.market}}</p>
	</div>
</template>


<script>
	import ItemView from './ItemView.vue';
	import {Appraisal} from '../stores/Appraisal.js';
	export default {
		data() {
			return {
				Appraisal,
			}
		},
	};
</script>
