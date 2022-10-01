<script setup>
	import ItemView from './ItemView.vue';
</script>

<template>
	<table v-if="Appraisal.compute" class="text-end">
		<tr>
			<th></th>
			<th class="text-start">Name</th>
			<th>Qty</th>
			<th>Market Rate<br>Total</th>
			<th>Buyback Rate<br>Total</th>
			<th>Effective Rate</th>
		</tr>
		<ItemView v-for="item in Appraisal.compute.items" class="odd:bg-srcblack-light" :item="item"/>
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
