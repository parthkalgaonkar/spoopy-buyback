<script setup>
	import {reactive} from 'vue'
</script>
<template></template>

<script>
	import {Appraisal} from '../stores/Appraisal.js'

	export default {
		data() {
			return {
				Appraisal
			}
		},
		watch: {
			'Appraisal.link': {
				handler(newval) {
					const janice_url = 'https://janice.e-351.com/api/rest/v2/appraisal/';
					const janice_key = 'G9KwKq3465588VPd6747t95Zh94q3W2E'
					console.log("refetching JSON");
					fetch(janice_url+newval, {method: 'GET', headers: {'X-ApiKey': janice_key}})
						.then((response) => response.json())
						.then((data) => {
							console.log("fetched:");
							console.log(data);
							Appraisal.app_data = data;
						});
				}
			}
		}
	}
</script>
