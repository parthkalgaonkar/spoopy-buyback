<template>
	<table v-if="Assets.named_list" class="text-end">
		<tr>
			<th></th>
			<th class="text-start">Name</th>
			<th v-if="Assets.compute">Qty Req<br>Satisfied</th>
			<th v-else>Qty</th>
			<th v-if="Assets.compute">Market rate<br>Total</th>
			<th v-if="Assets.compute">Sellfore rate<br>Total</th>
			<th v-if="Assets.compute">Effective Rate</th>
		</tr>
		<AssetView v-if="Assets.compute" v-for="item in Assets.compute" class="odd:bg-srcblack-light" :item="item" :computed="true"/>
		<AssetView v-else v-for="item in Assets.named_list" class="odd:bg-srcblack-light" :item="item" :computed="false"/>
	</table>
	<p v-else>Loading assets from ESI...</p>
</template>


<script>
	import {Assets} from '../stores/Assets.js';
	import AssetView from './AssetView.vue';

	export default {
		data() {
			return {
				Assets,
			}
		},
		components: {
			AssetView,
		}
	};
</script>
