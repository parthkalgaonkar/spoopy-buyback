<template></template>


<script>
	import {Appraisal} from '../stores/Appraisal.js';
	import {Assets} from '../stores/Assets.js';

	export default {
		data() {
			return {
				Appraisal,
				Assets,
			};
		},
		methods: {
			filter_items (item) {
				const new_item = {...item};
				const asset = this.Assets.asset_list.find((avail) => {
					return avail.type_id == item.typeid;
				});
				if (asset === undefined) new_item.qty_avail = 0;
				else if (asset.qty < item.qty) new_item.qty_avail = asset.qty;
				else new_item.qty_avail = item.qty;
				return new_item;
			},

			re_filter() {
				if (this.Appraisal.compute === undefined) {return;}
				if (this.Assets.asset_list === undefined) {return;}

				const filtered_list = this.Appraisal.compute.items.map(this.filter_items);
				console.log("Filtered assets");
				console.log(filtered_list);

				this.Assets.filtered = filtered_list;
			}
		},
		watch: {
			'Appraisal.compute': {
				handler() {
					this.re_filter();
				}
			},
			'Assets.asset_list': {
				handler() {
					this.re_filter();
				}
			}
		}
	}
</script>
