// Use the following script to get group ids
//async function get_esi(item_list) {
//	const ep = "https://esi.evetech.net/latest/universe/ids/";
//	const resp = await fetch(ep, {
//		method: "POST",
//		body: JSON.stringify(item_list)
//	});
//	console.log("Got ESI resp");
//	console.log(resp);
//	return await resp.json();
//}
//
//function get_group(typeid) {
//	ep = `https://esi.evetech.net/latest/universe/types/${typeid}/`;
//	return fetch(ep);
//}
//
//async function get_data() {
//	samples = {
//		"Fuel Blocks": ["Hydrogen Fuel Block"],
//		"Tools": ["R.A.M.- Ammunition Tech"],
//		"Salvaged Materials": ["Armor Plates"],
//		"Ancient Salvage": ["Ancient Radar Decorrelator"],
//		"Harvestable Cloud": ["Fullerite-C28"],
//		"PI products": [
//			"Heavy Metals",
//			"Noble Gas",
//			"Autotrophs",
//			"Biomass",
//			"Supertensile Plastics",
//			"Planetary Vehicles",
//			"Integrity Response Drones"
//		],
//		"Hybrid Tech Components": ["Electromechanical Interface Nexus"],
//		"Hybrid Polymers": ["C3-FTM Acid"],
//		"Datacores": ["Datacore - Advanced Starship Engineering"],
//		"Decryptors": [
//			"Occult Parity",
//			"Esoteric Parity",
//			"Incognito Parity",
//			"Cryptic Parity",
//			"Amarr Subsystems Data Interface",
//			"Parity Decryptor"
//		],
//		"Abyssal Materials": ["Zero-Point Condensate"],
//		"Commodities": ["Ancient Weapon"],
//		"Minerals": ["Tritanium"],
//		"Ice Products": ["Liquid Ozone"]
//	};
//
//
//
//	esi_fix = {
//		"Datacores": [20117],
//		"Abyssal Materials": [48112]
//	};
//
//	console.log(samples);
//	let groups = {};
//	for (const [key, value] of Object.entries(samples)) {
//		let types = [];
//		console.log(`Processing ${key}`);
//		if (!Object.keys(esi_fix).includes(key)) {
//			esi_data = await get_esi(value);
//			console.log("Got data");
//			console.log(esi_data);
//			types = esi_data.inventory_types.map((item) => item.id);
//		} else {
//			types = esi_fix[key];
//		}
//
//		group_reqs = types.map(get_group);
//		group_resp = await Promise.all(group_reqs);
//		group_data = await Promise.all(group_resp.map((item) => item.json()));
//		group_ids = group_data.map((item) => item.group_id);
//		groups[key] = group_ids;
//	}
//
//	return groups;
//}

export item_groups = {
	"Fuel Blocks": [
		1136
	],
	"Tools": [
		332
	],
	"Salvaged Materials": [
		754
	],
	"Ancient Salvage": [
		966
	],
	"Harvestable Cloud": [
		711
	],
	"PI products": [
		1032,
		1033,
		1035,
		1042,
		1034,
		1040,
		1041
	],
	"Hybrid Tech Components": [
		964
	],
	"Hybrid Polymers": [
		974
	],
	"Datacores": [
		333
	],
	"Decryptors": [
		728,
		731,
		730,
		729,
		979,
		1304
	],
	"Abyssal Materials": [
		1996
	],
	"Commodities": [
		526
	],
	"Minerals": [
		18
	],
	"Ice Products": [
		423
	]
}
