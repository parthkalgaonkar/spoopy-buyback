// Handles everything related to access tokens.
// exports.get_token: Get new access token and refresh token from auth_code
// exports.refresh_token: Refresh existing token for new access_token

const axios = require('axios').default;
const jose = require('jose');

const auth_url = "https://login.eveonline.com/v2/oauth/token";


function auth_header(auth_info) {
	const clientID = auth_info.client_id;
	const secretKey = auth_info.secret_key;
	const auth_b64 = btoa(unescape(encodeURIComponent(clientID+":"+secretKey)));
	return {
		"Accept": "*/*",
		"Authorization": "Basic "+auth_b64,
		"Content-Type": "application/x-www-form-urlencoded",
		"Host": "login.eveonline.com"
	};
}

async function eve_validate_jwt(token) {
	const SSO_META_DATA_URL = "https://login.eveonline.com/.well-known/oauth-authorization-server";
	const JWK_ALGORITHM = "RS256";
	const JWK_ISSUERS = ["login.eveonline.com", "https://login.eveonline.com"];
	const JWK_AUDIENCE = "EVE Online";
	const jwks_uri = "https://login.eveonline.com/oauth/jwks"

	let jwks_sets = [];
	let jwt_decrypt = {};

	const jwks_resp = await axios.get(jwks_uri);
	jwks_data = jwks_resp.data;
	const JWKS = jose.createLocalJWKSet(jwks_data);
	jwt_decrypt = await jose.jwtVerify(token, JWKS, {
		issuer: JWK_ISSUERS,
		audience: JWK_AUDIENCE
	});

	return jwt_decrypt.payload;
}

async function get_validate_token(auth_form, auth_info) {
	const req = axios({
		url: auth_url,
		method: "post",
		headers: auth_header(auth_info),
		data: auth_form
	});

	let  resp = {};
	resp = await req;
	const payload = await eve_validate_jwt(resp.data.access_token);

	return {
		access: resp.data,
		payload: payload
	};
}

exports.get_token = async function (auth_code, auth_info) {
	const auth_form = "grant_type=authorization_code&code="+auth_code;
	return await get_validate_token(auth_form, auth_info);
}

exports.refresh_token = async function (refresh_token, auth_info) {
	auth_form = "grant_type=refresh_token&refresh_token="+encodeURIComponent(refresh_token)
	return await get_validate_token(auth_form, auth_info);
}
