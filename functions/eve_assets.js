// Handles functions related to client specific EVE asset handling
// parse_assets: Filters by location and combines split stacks of items
const functions = require("firebase-functions");

const allowed_location_ids = [1039610054097, 1039595018417];
const allowed_location_flags = ["CorpSAG4"];

function filter_item(item) {
	return allowed_location_ids.includes(item.location_id) &&
		allowed_location_flags.includes(item.location_flag);
};

function sort_item(a,b) {
	return a.type_id - b.type_id;
}

function combine_items(r_list, curr) {
	r_len = r_list.length;
	if ((r_len == 0) || (r_list[r_len-1].type_id != curr.type_id)) {
		r_list.push({
			type_id: curr.type_id,
			qty: curr.quantity
		});
	} else {
		r_list[r_len-1].qty += curr.quantity;
	}
	return r_list;
}

exports.parse_assets = function (esi_assets) {
	const assets_filtered = esi_assets.filter(filter_item);
	assets_filtered.sort(sort_item);
	const assets_combined = assets_filtered.reduce(combine_items, []);

	return assets_combined;
}
