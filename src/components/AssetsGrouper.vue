<template></template>


<script>
	import {Assets} from '../stores/Assets.js';
	import {item_groups} from '../lib/groups.js';

	export default {
		data() {
			return {
				Assets,
			};
		},
		methods: {
			build_groups(newval) {
				let groups = [];
				const all_groups = Object.values(item_groups).flat();
				for (const [grp_name, grp_list] of Object.entries(item_groups)) {
					const group_items = newval.filter((item) => grp_list.includes(item.groupid));
					if (group_items.length) {
						groups.push({
							name: grp_name,
							items: group_items
						});
					}
				}

				const misc_items = newval.filter((item) => {return !all_groups.includes(item.groupid)});
				groups.push({
					name: "Miscellaneous",
					items: misc_items
				});

				Assets.grouped_list = groups;
			}
		},
		watch: {
			'Assets.named': {
				handler(newval) {
					this.build_groups(newval);
				}
			}
		}
	}
</script>
