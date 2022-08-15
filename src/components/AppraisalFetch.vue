<script setup>
	import {reactive} from 'vue'
</script>
<template></template>

<script>
	import {Appraisal} from '../stores/Appraisal.js'
	import {AlertMsg} from '../stores/Alert.js'

	export default {
		data() {
			return {
				Appraisal
			}
		},
		watch: {
			'Appraisal.code': {
				handler(newval) {
					if (!Boolean(newval)) return;

					const janice_url = 'https://janice.e-351.com/api/rest/v2/appraisal/';
					const janice_key = 'G9KwKq3465588VPd6747t95Zh94q3W2E'
					console.log("refetching JSON");
					var req = fetch(janice_url+newval, {method: 'GET', headers: {'X-ApiKey': janice_key}}).then(
						(response) => {
							// You got some response
							// 1. check if response is OK
							if (!response.ok) {
								AlertMsg.content = {
									alert_type: "ERROR",
									alert_message: "Janice Responded with error. Check the appraisal code or try again later"
								};
								return;
							}
							// 2. If okay, parse the JSON recieved
							response.json().then(
								(data) => {
									// Data was parsed from JSON
									console.log("Recieved:");
									console.log(data);
									Appraisal.app_data = data;
								},
								(reason) => {
									AlertMsg.content = {
										alert_type: "ERROR",
										alert_message: reason
									};
								}
							)
						},
						(reason) => {
							// You did not get any HTTP response at all.
							// Possible network issue
							AlertMsg.content = {
								alert_type: "ERROR",
								alert_message: reason
							}
						}
					);
				}
			}
		}
	}
</script>
