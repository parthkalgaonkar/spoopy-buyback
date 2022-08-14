<template>
	<td>{{item.name}}</td>
	<td>{{item.qty}}</td>
	<td>{{item.market}}<br>{{item.market_total}}</td>
	<td>{{item.buyback}}<br>{{item.buyback_total}}</td>
	<td>{{item.buyback_percentage}}</td>
</template>

<script>
export default {
	props: ['item']
}
</script>
