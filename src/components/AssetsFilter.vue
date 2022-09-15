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
		methods; {
			filter_items (item) {
				const asset = this.Assets.asset_list.find((avail) => {
					return avail.typeid == item.typeid;
				});
			}

			re_filter() {
				if (this.Appraisal.compute === undefined) {return;}
				if (this.Assets.asset_list === undefined) {return;}

				const filtered_list = this.Appraisal.compute.items.map(filter_items);
			}
		},
		watch: {
			'Appraisal.compute': {
				handler() {
					this.re_filter();
				}
			},
			'Assets.asset_list': {[
				handler() {
					this.re_filter();
				}
			}
		}
	}
</script>
