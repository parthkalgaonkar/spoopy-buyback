<template>
	<table v-if="Assets.named_list" class="text-end">
		<tr>
			<th></th>
			<th class="text-start">Name</th>
			<th>Qty</th>
		</tr>
		<AssetView v-for="item in Assets.named_list" class="odd:bg-srcblack-light" :item="item"/>
	</table>
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
