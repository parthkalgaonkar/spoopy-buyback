// Function definition for directorAuth
const eve_tokens = require('./eve_tokens');
const db_access = require('./db_access');

exports.director_auth = async function (request, response) {
	const auth_code = request.query.auth_code;
	if (auth_code === undefined) {
		response.status(400).send("auth_code is required");
		return;
	}

	const auth_info			= await db_access.get('private_data/auth_info');
	const auth_resp			= await eve_tokens.get_token(auth_code, auth_info);
	const allowed_chars	= await db_access.get('private_data/allowed_chars');

	const char_id = auth_resp.payload.sub.split(':')[2];
	if (!allowed_chars.ids.includes(char_id)) {
		functions.logger.warning({
			message: "Forbidden director auth attempt",
			character: payload.name,
			char_id: char_id
		}, {structuredData: true});
		response.status(403).send("Forbidden access attempted");
		return;
	}

	await db_access.set('private_data/refresh_token', {token: auth_resp.access.refresh_token});

	response.send({
		name: auth_resp.payload.name,
		message: "Updated server tokens"
	});
}
