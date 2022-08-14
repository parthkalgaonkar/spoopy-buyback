<script setup>
	import ItemView from './ItemView.vue';
</script>

<template>
	<table v-if="Appraisal.compute">
		<tr>
			<th>Name</th>
			<th>Qty</th>
			<th>Jita Buy <br> Total</th>
			<th>Buyback Rate <br> Total</th>
			<th>Effective Rate</th>
		</tr>
		<tr v-for="item in Appraisal.compute.items">
			<ItemView :item="item"/>
		</tr>
	</table>
	<div v-else>Enter Janice code to get quote</div>
</template>


<script>
	import {Appraisal} from '../stores/Appraisal.js';
	export default {
		data() {
			return {
				Appraisal,
			}
		},
	};
</script>
