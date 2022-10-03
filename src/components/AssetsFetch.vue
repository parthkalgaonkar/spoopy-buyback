<template></template>

<script>
	import {initializeApp} from 'firebase/app'
	import {getFirestore, doc, getDoc} from 'firebase/firestore'
	import {Assets} from '../stores/Assets.js'
	import {Appraisal} from '../stores/Appraisal.js'
	import {Mode} from '../stores/Mode.js'

	const firebaseConfig = {
		apiKey: "AIzaSyCv5O7w1E_ICJRIzN-tcAAbnKfN-RHb810",
		authDomain: "spoopy-buyback.firebaseapp.com",
		projectId: "spoopy-buyback",
		storageBucket: "spoopy-buyback.appspot.com",
		messagingSenderId: "765350139936",
		appId: "1:765350139936:web:c4cc478fa83a7f7c0d8445"
	};

	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);

	let unmount_func = {};

	export default {
		data() {
			return {
				Assets,
				Appraisal,
				Mode,
			};
		},
		methods: {
			async update_db() {
				if (this.Assets.expiry !== undefined) {
					const expiry = new Date(this.Assets.expiry);
					const now = new Date();
					if (now < expiry) {return;}
				}

				const UPDATE_URL = "https://us-central1-spoopy-buyback.cloudfunctions.net/getAssets";

				try {
					const resp = await fetch(UPDATE_URL);
					const data = await resp.json();
					console.log(data);
					this.Assets.expiry = data.expires;
				} catch (err)  {
					console.log("Could not trigger database update");
					return;
				}

				// Get the newly updated DB from firestore
				const docRef = await getDoc(doc(db, "assets/combined"));
				this.Assets.asset_list = docRef.data().assets;
			}
		},
		mounted() {
			this.update_db();
		},
		watch: {
			'Assets.asset_list': {
				async handler() {
					const req_list = this.Assets.asset_list.map((item) => {
						const TYPE_ENDPOINT = "https://esi.evetech.net/latest/universe/types/";
						return fetch(TYPE_ENDPOINT+item.type_id);
					});

					const resp_list = await Promise.all(req_list);
					const type_list = await Promise.all(resp_list.map((item) => item.json()));

					const named_list = type_list.map((item, idx) => {
						return {
							typeid: item.type_id,
							groupid: item.group_id,
							qty: this.Assets.asset_list[idx].qty,
							name: item.name
						};
					});

					console.log("Available Assets");
					console.log(named_list);
					this.Assets.named_list = named_list;
				}
			}
		}
	}
</script>
