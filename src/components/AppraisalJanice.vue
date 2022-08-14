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
			'Appraisal.app_data': {
				handler (newval) {
					console.log("Extracting info from Appraisal");
					var extract = {
						items: [],
						market: newval.market.name
					}
					for (const item of newval.items) {
						extract.items.push({
							base_price: item.effectivePrices.buyPrice,
							volume: item.itemType.volume,
							qty: item.amount,
							typeid: item.itemType.eid,
							name: item.itemType.name
						});
					}

					console.log("Janice Extract:");
					console.log(extract);
					Appraisal.extract = extract;
				}
			}
		}
	};
</script>
