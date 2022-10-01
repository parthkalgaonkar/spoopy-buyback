<template></template>


<script>
	import {Assets} from '../stores/Assets.js';

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

					console.log("Asset summary");
					console.log(summary);
					Assets.summary = summary;
				}
			}
		}
	}
</script>
