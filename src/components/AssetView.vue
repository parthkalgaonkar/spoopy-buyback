<template>
	<tr 
			:class="{
				'border-l-8 border-srcred': item.qty == 0
			}">
		<td><img :src="get_image_url(item.typeid)" :alt="item.name"></td>
		<td class="text-start">{{item.name}}</td>
		<td>{{item.qty}}</td>
	</tr>
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
