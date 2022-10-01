<template></template>

<script>
	import {Appraisal} from '../stores/Appraisal.js';

	export default {
		data() {
			return {
				Appraisal,
			}
		},
		watch: {
			'Appraisal.compute': {
				handler (newval) {
					console.log("Calculating buyback quote summary");

					// get basic data in
					var summary = {
						market_total: 0,
						buyback_total: 0,
					};

					// Calculate fields for all items
					for (var item of newval.items) {
						summary.market_total += item.market_total;
						summary.buyback_total += item.buyback_total;
					}

					summary.rate = (summary.buyback_total/summary.market_total)*100;

					// Store in global DB
					console.log("Computed:");
					console.log(summary);
					Appraisal.summary = summary;
				}
			}
		}
	};
</script>
