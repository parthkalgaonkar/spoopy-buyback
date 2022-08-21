<template></template>

<script>
	import {Appraisal} from '../stores/Appraisal.js';
	import {jita_list, amarr_list, jita_sell_list} from '../lib/market_lists.js';

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
					}

					var il_jita = newval[2].items;
					var il_amarr = newval[115].items;

					for (let i=0; i<il_jita.length; i++) {
						var typeid = il_jita[i].itemType.eid;
						var jita_price = il_jita[i].effectivePrices.buyPrice;
						var amarr_price = il_amarr[i].effectivePrices.buyPrice;
						var jita_sell = il_jita[i].effectivePrices.sellPrice;

						var base_price = 0;
						if (jita_list.includes(typeid)) base_price = jita_price;
						if (amarr_list.includes(typeid)) base_price = amarr_price;
						if (jita_sell_list.includes(typeid)) base_price = jita_sell;

						var volume = il_jita[i].totalVolume;
						var quantity = il_jita[i].amount;
						var name = il_jita[i].itemType.name;

						extract.items.push({
							base_price: base_price,
							volume: volume,
							qty: quantity,
							typeid: typeid,
							name: name
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
