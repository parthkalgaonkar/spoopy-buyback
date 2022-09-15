<script>
	import AppraisalInput from './components/AppraisalInput.vue';
	import AppraisalFetch from './components/AppraisalFetch.vue';
	import AppraisalJanice from './components/AppraisalJanice.vue';
	import AppraisalCompute from './components/AppraisalCompute.vue';
	import AppraisalView from './components/AppraisalView.vue';
	import AppraisalSummarize from './components/AppraisalSummarize.vue';
	import AppraisalSummaryView from './components/AppraisalSummaryView.vue';
	import AssetsFetch from './components/AssetsFetch.vue';
	import AssetsView from './components/AssetsView.vue';
	import AssetsSummaryView from './components/AssetsSummaryView.vue';
	import AlertView from './components/AlertView.vue';
	import AdminView from './components/AdminView.vue';

	import {Mode} from './stores/Mode.js';

  export default {
		data() {
			return {
				count: 0,
				admin: 0,
				Mode
			}
		},
		mounted () {
			const pathname = window.location.pathname.split("/").join("");
			if (pathname == "admin") {
				this.admin = 1;
			}
		},
		components: {
			AppraisalInput,
			AppraisalFetch,
			AppraisalJanice,
			AppraisalCompute,
			AppraisalView,
			AppraisalSummarize,
			AppraisalSummaryView,
			AlertView,
			AdminView,
			AssetsFetch,
			AssetsView,
			AssetsSummaryView,
		}
	}
</script>

<template>
	<AppraisalInput />
	<AppraisalFetch /> <!-- Empty component -->
	<AppraisalJanice /> <!-- Empty component -->
	<AppraisalCompute /> <!-- Empty component -->
	<AppraisalSummarize /> <!-- Empty component -->
	<AppraisalSummaryView v-if="!Mode.buy_mode"/>
	<AssetsFetch v-if="Mode.buy_mode"/> <!-- Empty component -->
	<AssetsSummaryView v-if="Mode.buy_mode"/>
	<AssetsView class="col-span-2" v-if="Mode.buy_mode"/>
	<AppraisalView class="col-span-2" />
	<AlertView />
	<AdminView v-if="admin"/>
</template>
