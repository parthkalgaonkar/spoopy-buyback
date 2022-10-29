<template></template>


<script>
	import {Assets} from '../stores/Assets.js';

	function items_to_string(item_list) {
		const str_list = item_list.filter((item) => {
			return item.qty_avail !== 0;
		}).map((item) => {
			return item.name+"\t\t\t"+item.qty_avail;
		});
		return str_list.join('\n');
	}


	export default {
		data() {
			return {
				Assets,
			}
		},
		watch: {
			'Assets.compute': {
				handler(newval) {
					console.log("newval");
					console.log(newval);
					let summary = {
						market_total: 0,
						sellfore_total: 0,
					}

					for (const item of newval) {
						summary.market_total += item.market_total;
						summary.sellfore_total += item.sellfore_total;
					}

					summary.rate = (summary.sellfore_total/summary.market_total)*100;
					summary.body = items_to_string(newval);

					console.log("Asset summary");
					console.log(summary);
					Assets.summary = summary;
				}
			}
		}
	}
</script>
