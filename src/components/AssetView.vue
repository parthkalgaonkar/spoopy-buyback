<template>
	<tr 
			:class="{
				'border-l-8 border-srcred': item.qty_avail == 0,
				'border-l-8 border-srcyellow': (item.qty_avail < item.qty) && (item.qty_avail > 0)
			}">
		<td><img :src="get_image_url(item.typeid)" :alt="item.name"></td>
		<td class="text-start">{{item.name}}</td>
		<td v-if="computed">{{item.qty}}<br>{{item.qty_avail}}</td>
		<td v-else>{{item.qty}}</td>
		<td v-if="computed">{{item.market.isk()}}<br>{{item.market_total.isk()}}</td>
		<td v-if="computed">{{item.sellfore.isk()}}<br>{{item.sellfore_total.isk()}}</td>
		<td v-if="computed">{{item.sellfore_percentage.percentage()}}</td>
	</tr>
</template>

<script>
export default {
	props: ['item','computed'],
	methods: {
		get_image_url(typeid) {
			return "https://image.eveonline.com/Type/"+typeid+"_64.png"
		}
	}
}
</script>
