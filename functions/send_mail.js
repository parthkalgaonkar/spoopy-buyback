const functions = require("firebase-functions");
const eve_tokens = require('./eve_tokens');
const db_access = require('./db_access');
const esi = require('./esi');

exports.send_mail = async function (request, response) {
	const refresh_token = await db_access.get('private_data/refresh_token');
	const auth_info			= await db_access.get('private_data/auth_info');
	const auth_resp			= await eve_tokens.refresh_token(refresh_token.token, auth_info);
	functions.logger.debug(auth_resp, {structuredData: true});

	const sender_id 		= auth_resp.payload.sub.split(':')[2];
	const mail_content	= request.body;
	functions.logger.log(request.body)
	await esi.send_mail(auth_resp.access.access_token, sender_id, mail_content);
	response.send("mail sent");
};
