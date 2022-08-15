<template>
	<td><img :src="get_image_url(item.typeid)" :alt="item.name"></td>
	<td class="text-start">{{item.name}}</td>
	<td>{{item.qty}}</td>
	<td>{{item.market.isk()}}<br>{{item.market_total.isk()}}</td>
	<td>{{item.buyback.isk()}}<br>{{item.buyback_total.isk()}}</td>
	<td>{{item.buyback_percentage.percentage()}}</td>
</template>

<script>
export default {
	props: ['item'],
	methods: {
		get_image_url(typeid) {
			return "https://image.eveonline.com/Type/"+typeid+"_64.png"
		}
	}
}
</script>
