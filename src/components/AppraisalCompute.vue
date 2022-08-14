<template></template>

<script>
	import {Appraisal} from '../stores/Appraisal.js';
	import {BuybackCalculator} from '../lib/BuybackCalculator.js';
	import {TaxDeduction, HaulingDeduction} from '../lib/deductions.js';

	export default {
		data() {
			return {
				Appraisal,
			}
		},
		watch: {
			'Appraisal.extract': {
				handler (newval) {
					console.log("Calculating buyback quote");

					// get basic data in
					var compute = {
						items: [],
						market: newval.market
					};

					// initialize calculator
					var calculator = new BuybackCalculator();
					calculator.add_deduction(new TaxDeduction());
					calculator.add_deduction(new HaulingDeduction());

					// Calculate fields for all items
					for (var item of newval.items) {
						var buyback_rate = calculator.buyback_rate(item);
						compute.items.push({
							market: item.base_price,
							market_total: item.base_price*item.qty,
							buyback: buyback_rate,
							buyback_total: buyback_rate*item.qty,
							buyback_percentage: (buyback_rate/item.base_price)*100,
							name: item.name,
							qty: item.qty,
							typeid: item.typeid,
						});
					}

					// Store in global DB
					console.log("Computed:");
					console.log(compute);
					Appraisal.compute = compute;
				}
			}
		}
	};
</script>
