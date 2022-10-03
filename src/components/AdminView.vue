<template>
	<div class="col-span-full ring-2 ring-srccyan ring-inset p-2">
		ADMIN controls. <br/>
		Unless you are a Spoopy Buyback director you probably do not need to be here.
		Return to <a class="text-srcblue" href="spoopy-buyback.web.app">Main Website</a>.<br/>
		If you are a director and are here to update the token data, Login below. <br/>
		<button class="bg-[url(./assets/eve-login.png)] h-8 w-48 bg-contain" :href="login_url" @click="button_click"></button> <br/>
		{{message}}:{{character}}
	</div>
</template>

<script>
	export default {
		data() {
			return {
				character: '',
				login_url: ''
			}
		},
		methods: {
			button_click() {
				window.location.href = this.login_url;
			},

			async authenticate(auth_code) {
				const AUTH_URL = "https://us-central1-spoopy-buyback.cloudfunctions.net/directorAuth?auth_code="+auth_code;
				const resp = await fetch (AUTH_URL);
				const data = await resp.json();
				if (resp.ok) {
					this.character = data.name;
					this.message = data.message;
				} else if (resp.status == 403) {
					this.message = "Forbidden access attempted";
				}
			}
		},
		mounted() {
			const client_id = "c1f7d24cac80406998fd9bb71224e4b5";
			const callback = encodeURIComponent(window.location.href);
			const roles = encodeURIComponent("esi-assets.read_corporation_assets.v1 esi-mail.send_mail.v1");
			this.login_url = "https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri="+callback+"&client_id="+client_id+"&scope="+roles+"&state=unique";
			const params = new URLSearchParams(window.location.search);
			console.log(params);
			const auth_code = params.get("code");
			if (auth_code !== null) this.authenticate(auth_code);
		}
	}
</script>
