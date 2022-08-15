<script setup>
	import AppraisalInput from './components/AppraisalInput.vue';
	import AppraisalFetch from './components/AppraisalFetch.vue';
	import AppraisalJanice from './components/AppraisalJanice.vue';
	import AppraisalCompute from './components/AppraisalCompute.vue';
	import AppraisalView from './components/AppraisalView.vue';
	import AppraisalSummarize from './components/AppraisalSummarize.vue';
	import AppraisalSummaryView from './components/AppraisalSummaryView.vue';
	import AlertView from './components/AlertView.vue';
</script>

<template>
	<AppraisalInput />
	<AppraisalFetch /> <!-- Empty component -->
	<AppraisalJanice /> <!-- Empty component -->
	<AppraisalCompute /> <!-- Empty component -->
	<AppraisalSummarize /> <!-- Empty component -->
	<AppraisalSummaryView />
	<AppraisalView class="col-span-2" />
	<AlertView />
</template>

<script>
  export default {
		data() {
			return {
				count: 0
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
		}
	}
</script>
