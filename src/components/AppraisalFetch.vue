<template></template>


<script>
	import {Appraisal} from '../stores/Appraisal.js';
	import {AlertMsg} from '../stores/Alert.js';


	export default {
		data() {
			return {
				Appraisal
			}
		},
		methods: {
			json_error_handler(reason) {
				AlertMsg.content = {
					alert_type: "ERROR",
					alert_message: "Could not parse JSON: "+reason
				}
			},

			http_error_handler(reason) {
				AlertMsg.content = {
					alert_type: "ERROR",
					alert_message: "Network Error: "+reason
				}
			},

			http_response_handler(response, market) {
				console.log("Recieved: ");
				console.log(response);
				if (!response.ok) {
					AlertMsg.content = {
						alert_type: "ERROR",
						alert_message: "Janice Responded with error. Check the appraisal code or try again later"
					};
					return 1;
				}
				return 0;
			},

			async get_appraisals(rq_list) {
				var rsp_list = {};
				var json_list = {};

				for (const [key, value] of Object.entries(rq_list)){
					var resp = await value
						.catch ((err) => {
							this.http_error_handler(err);
							return;
						});

					if (this.http_response_handler(resp)) return;
					var json_parse_req = resp.json();
					json_list[key] = json_parse_req;
				}

				// The for loop above only ends when both responses have been recieved

				for (const [key, value] of Object.entries(json_list)) {
					var data = await value
						.catch((err) => {
							this.json_error_handler(err);
							return;
						});
					rsp_list[key] = data;
				}

				if (rsp_list[2].items.length != rsp_list[115].items.length) {
					AlertMsg.content = {
						alert_type: "ERROR",
						alert_message: "Got different lists for Jita and Amarr"
					}
					return;
				}

				// The for loop above only ends when both response JSON have been parsed
				Appraisal.app_data = rsp_list;
			}
		},
		watch: {
			'Appraisal.eve_input': {
				handler(newval) {
					// Ignore empty input
					if (!Boolean(newval)) return;

					const janice_url = 'https://janice.e-351.com/api/rest/v2/appraisal?persist=false&market=';
					const janice_key = 'G9KwKq3465588VPd6747t95Zh94q3W2E'

					const markets = [2,115];

					var req_list = {};

					console.log("Fetching JSON");

					for (var market of markets) {
						req_list[market] = fetch(janice_url+market, {
							method: 'POST',
							headers: {
								accept: 'application/json',
								'X-ApiKey': janice_key,
								'Content-Type': 'text/plain',
							},
							body: newval,
						});
					}

					this.get_appraisals(req_list);
				}
			}
		}
	}
</script>
