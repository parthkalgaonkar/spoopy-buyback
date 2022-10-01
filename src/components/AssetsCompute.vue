<template></template>


<script>
	import {Assets} from '../stores/Assets.js'
	import {SellforeCalculator} from '../lib/SellforeCalculator.js'

	export default {
		data() {
			return {
				Assets,
			}
		},
		watch: {
			'Assets.filtered': {
				handler(newval) {
					const calculator = new SellforeCalculator();
					var compute = [];

					for (const item of newval) {
						const sellfore_rate = calculator.sellfore_rate(item);
						compute.push({
							market: item.market,
							market_total: item.market*item.qty_avail,
							sellfore: sellfore_rate,
							sellfore_total: sellfore_rate*item.qty_avail,
							sellfore_percentage: (sellfore_rate/item.market)*100,
							name: item.name,
							qty: item.qty,
							qty_avail: item.qty_avail,
							typeid: item.typeid,
						});
					}

					console.log("Assets computed:");
					console.log(compute);
					this.Assets.compute = compute;
				}
			}
		}
	}
</script>
