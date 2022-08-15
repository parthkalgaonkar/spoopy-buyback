<script setup>
	import ItemView from './ItemView.vue';
</script>

<template>
	<table v-if="Appraisal.compute" class="text-end">
		<tr>
			<th></th>
			<th class="text-start">Name</th>
			<th>Qty</th>
			<th>{{Appraisal.compute.market}} Buy <br> Total</th>
			<th>Buyback Rate <br> Total</th>
			<th>Effective Rate</th>
		</tr>
		<tr v-for="item in Appraisal.compute.items" class="odd:bg-srcblack-light">
			<ItemView :item="item"/>
		</tr>
	</table>
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
