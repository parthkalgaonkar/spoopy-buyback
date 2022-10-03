const functions = require("firebase-functions");
const eve_tokens = require('./eve_tokens');
const db_access = require('./db_access');
const eve_assets = require('./eve_assets');
const esi = require('./esi');

exports.get_assets = async function (request, response) {
	let expires = db_access.get('private_data/cache_control');
	if (expires !== undefined) {
		curr_time = new Date();
		expr_time = new Date(expires);
		if (expr_time < curr_time) {
			response.send({expires: expires, message: "Using cached version of assets"});
			return;
		}
	}

	const refresh_token = await db_access.get('private_data/refresh_token');
	const auth_info 		= await db_access.get('private_data/auth_info');
	const auth_resp			= await eve_tokens.refresh_token(refresh_token.token, auth_info);
	functions.logger.debug(auth_resp, {structuredData: true});
	const assets_esi		= await esi.get_assets(auth_resp.access.access_token);
	const assets_parsed = eve_assets.parse_assets(assets_esi.data);
	functions.logger.debug(assets_esi.headers, {structuredData:true});

	const cleanup_tasks = [
		db_access.set('assets/combined', {assets: assets_parsed}),
		db_access.set('private_data/refresh_token', {token: auth_resp.access.refresh_token}),
		db_access.set('private_data/cache_control', {expires: assets_esi.headers.expires})
	]
	await Promise.all(cleanup_tasks);

	response.send({expires: assets_esi.headers.expires});
}
