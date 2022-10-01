const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const axios = require('axios').default;
const jose = require('jose');
const cors = require('cors')({origin: true});

async function get_access_token (auth_code, refresh_token) {
	let auth_info = {};
	try {
		auth_info = await admin.firestore().doc('private_data/auth_info').get();
	} catch (err) {
		functions.logger.error(err, {structuredData: true});
		return undefined;
	}

	functions.logger.info("refresh_token: "+refresh_token);
	const clientID = auth_info.data().client_id;
	const secretKey = auth_info.data().secret_key;
	const auth_b64 = btoa(unescape(encodeURIComponent(clientID+":"+secretKey)));
	const auth_header = {
		"Accept": "*/*",
		"Authorization": "Basic "+auth_b64,
		"Content-Type": "application/x-www-form-urlencoded",
		"Host": "login.eveonline.com"
	};

	let auth_form = "";
	if (auth_code !== null) {
		auth_form = "grant_type=authorization_code&code="+auth_code
	} else {
		auth_form = "grant_type=refresh_token&refresh_token="+encodeURIComponent(refresh_token)
	}
	const auth_url = "https://login.eveonline.com/v2/oauth/token"

	functions.logger.info("auth_form: "+auth_form);
	functions.logger.info(auth_header, {structuredData: true});
	const req = axios({
		url: auth_url,
		method: "post",
		headers: auth_header,
		data: auth_form
	});

	let  resp = {};
	try {
		resp = await req;
	} catch (err) {
		functions.logger.error(err, {structuredData: true});
		return undefined;
	}

	return resp.data;
}

async function eve_validata_jwt(token) {
	const SSO_META_DATA_URL = "https://login.eveonline.com/.well-known/oauth-authorization-server";
	const JWK_ALGORITHM = "RS256";
	const JWK_ISSUERS = ("login.eveonline.com", "https://login.eveonline.com");
	const JWK_AUDIENCE = "EVE Online";

	let jwks_uri = "https://login.eveonline.com/oauth/jwks"

	let jwks_sets = [];
	try {
		const jwks_resp = await axios.get(jwks_uri);
		jwks_data = jwks_resp.data;
	} catch (err) {
		functions.logger.error(err, {structuredData: true});
		return undefined;
	}

	const JWKS = jose.createLocalJWKSet(jwks_data);
	let jwt_decrypt = {};

	try {
		jwt_decrypt = await jose.jwtVerify(token, JWKS, {
			issuer: ["login.eveonline.com", "https://login.eveonline.com"],
			audience: "EVE Online"
		});
	}
	catch (err) {
		functions.logger.error(err, {structuredData: true});
		return undefined;
	}

	return jwt_decrypt.payload;
}

function parse_assets(esi_assets) {
	const allowed_location_ids = [1039610054097, 1039595018417];
	const allowed_location_flags = ["CorpSAG4"];

	// Filter list by location_id and location_flag
	const assets_filtered = esi_assets.filter((item) => {
		return allowed_location_ids.includes(item.location_id) &&
			allowed_location_flags.includes(item.location_flag);
	});

	// Sort list by type_ids
	assets_filtered.sort((a,b) => {
		if (a.type_id < b.type_id) return -1;
		if (a.type_id > b.type_id) return 1;
		return 0;
	});

	let assets_combined = [];
	let curr_asset = {};
	for (const item of assets_filtered) {
		if (curr_asset.type_id != item.type_id) {
			if (curr_asset.type_id !== undefined) {
				// Add the last type_id
				assets_combined.push(curr_asset);
			}
			curr_asset = {
				type_id: item.type_id
			};

			curr_asset.qty = 0;
		}

		curr_asset.qty += item.quantity;
	}
	// Add the last item to list as well. But only if there original list is not empty
	if (assets_filtered.length != 0) {
		assets_combined.push(curr_asset);
	}

	return {assets: assets_combined};
}

async function set_data_to_db(assets) {
	try {
		const docRef = admin.firestore().doc('assets/combined');
		await docRef.set(assets);
		return true;
	} catch (err) {
		functions.logger.error(err, {structuredData: true});
		return false;
	}
}


exports.helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", {structuredData: true});
	response.send("Hello from Firebase!");
});

exports.directorAuth = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		const auth_code = request.query.auth_code;
		if (auth_code === undefined) {
			functions.logger.error("auth_code empty");
			response
				.status(400)
				.send({message: "GET request must have auth_code parameter"});
			return;
		}

		const auth_resp = await get_access_token(auth_code, null);
		if (auth_resp === undefined) {
			functions.logger.error("Could not get new access token");
			response.status(500).send({message: "Server Error: Could not get access token"});
			return;
		}

		const refresh_token = auth_resp.refresh_token;
		const access_token = auth_resp.access_token;

		// Decode and validate JWT
		const payload = await eve_validata_jwt(access_token);
		if (payload === undefined) {
			functions.logger.error("JWT validation failed");
			response.status(500).send({message: "Could not validate access token"});
			return;
		}

		let allowed_chars = [];
		try {
			const docRef = await admin.firestore().doc('private_data/allowed_chars').get();
			allowed_chars = docRef.data().ids;
		} catch (err) {
			functions.logger.error(err, {structuredData: true});
			response.status(500).send({message: "Could not get list of allowed chars"});
			return;
		}

		const char_id = payload.sub.split(':')[2];
		if (!allowed_chars.includes(char_id)) {
			functions.logger.warning({
				message: "Forbidden director auth attempt",
				character: payload.name,
				char_id: char_id
			}, {structuredData: true});
			response.status(403).send("Forbidden access attempted");
			return;
		}

		try {
			await admin.firestore().doc('private_data/refresh_token').set ({
				token: refresh_token
			});
		} catch (err) {
			functions.logger.error(err, {structuredData: true});
			response.status(500).send({message: "Could not update firestore database"});
			return;
		}

		response.send({
			name: payload.name,
			message: "Updated server tokens"
		});
	});
});

exports.getAssets = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		let refetch_data = 0;
		let expires = "";
		try {
			const docRef = await admin.firestore().doc('private_data/cache_control').get();
			if (!docRef.exists) {
				refetch_data = 1;
			} else {
				expires = docRef.data().expires;
				const expiry = new Date(expires);
				const curr_t = new Date();
				if (curr_t > expiry) {
					refetch_data = 1;
				}
			}
		} catch (err) {
			functions.logger.error(err, {structuredData: true});
			response.status(500).send({message: "Could not get cache control info"});
			return;
		}

		if (refetch_data == 0) {
			// Nothing to be done
			response.send({
				expires: expires,
				message: "Using cached version of assets"
			});
			return;
		}

		let refresh_token = "";
		try {
			const db_data = await admin.firestore().collection('private_data').doc('refresh_token').get();
			refresh_token = db_data.data().token;
		} catch (err) {
			functions.logger.error(err, {structuredData: true});
			response.status(500).send({message: "Could not get refresh token from DB"});
			return;
		}

		// Get new access token
		const auth_resp = await get_access_token(null, refresh_token);
		if (auth_resp === undefined) {
			functions.logger.error("Could not refresh access token");
			response.status(500).send({message: "Could not refresh access token"});
			return;
		}

		// Validate the token
		const payload = await eve_validata_jwt(auth_resp.access_token);
		functions.logger.info(payload, {structuredData: true});
		if (payload === undefined) {
			functions.logger.error("Could not validate access token");
			response.status(500).send({message: "Could not validate access token"});
			return;
		}

		const char_id = payload.sub.split(':')[2];
		const corp_id = "98475239"
		const ESI_ENDPOINT = "https://esi.evetech.net/latest";
		const ROLES_ENDPOINT = ESI_ENDPOINT+"/characters/"+char_id+"/roles/";
		const ASSETS_ENDPOINT = ESI_ENDPOINT+"/corporations/"+corp_id+"/assets/?page=";


		// GET the actual assets from ESI (multiple pages, 1000 each)
		let assets_esi = [];
		let page_idx = 1;
		let num_entries = 0;
		do {
			try {
				functions.logger.info("Trying to fetch page "+page_idx);
				const asset_resp = await axios.get(ASSETS_ENDPOINT+page_idx, {
					headers: {
						Authorization: "Bearer "+auth_resp.access_token
					}
				});
				expires = asset_resp.headers.expires;
				num_entries = asset_resp.data.length;
				functions.logger.info("Fetched assets page "+page_idx+" with num_entries: "+num_entries);
				page_idx += 1;
				assets_esi.push(...asset_resp.data);
			} catch (err) {
				functions.logger.error(err, {structuredData: true});
				response.status(500).send({message:"Server Error: Could not fetch assets from ESI"});
				return;
			}
		} while (num_entries == 1000);

		const assets_parsed = parse_assets(assets_esi);
		functions.logger.info("Parsed assets to required format");

		// Send data up to DB
		const db_status = await set_data_to_db(assets_parsed);
		if (!db_status) {
			response.status(500).send({message: "Could not update upstream database"});
			return;
		}

		// Let the user continue once db is updated
		response.send({expires: expires});

		// Finally set the cache control expiry to the new time
		try {
			const docRef = await admin.firestore().doc('private_data/cache_control').set({
				expires: expires
			});
		} catch (err) {
			functions.logger.error(err, {structuredData: true});
		}
	});
});

exports.batchTest = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		const bulkWriter = admin.firestore().bulkWriter();
		const collection = admin.firestore().collection('test_col');
		const doc_list = await collection.listDocuments();

		let write_data = [];
		for (var i=0; i<12; i++) {
			write_data.push(200+i);
		}

		while (write_data.length > 0) {
			const data = write_data.shift();
			let docRef = {};

			if (doc_list.length > 0) docRef = doc_list.shift();
			else docRef = collection.doc();

			bulkWriter.set(docRef, {value: data});
		}

		await bulkWriter.close();
		response.send();
	});
});
