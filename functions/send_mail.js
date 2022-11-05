const functions = require("firebase-functions");
const eve_tokens = require('./eve_tokens');
const db_access = require('./db_access');
const esi = require('./esi');

exports.send_mail = async function () {
	const refresh_token = await db_access.get('private_data/refresh_token');
	const auth_info			= await db_access.get('private_data/auth_info');
	const auth_resp			= await eve_tokens.refresh_token(refresh_token.token, auth_info);
	const sender_id 		= auth_resp.payload.sub.split(':')[2];
	const requests			= db_access.col('asset_req');
	const query					= await requests.orderBy('timestamp').limit(4).get();
	if (query.empty){
		functions.logger.info("No documents to process");
		return;
	}

	const num_docs			= query.docs.length;
	const mail_contents	= query.docs.map((doc) => doc.data().mail_content);
	const mail_promise	= mail_contents.map((mail_content) => {
		esi.send_mail(auth_resp.access.access_token, sender_id, mail_content);
	});
	const del_promise = query.docs.map((doc) => doc.ref.delete());

	await Promise.all(mail_promise);
	await Promise.all(del_promise);
	functions.logger.info(`${num_docs} mails sent`);
};

exports.queue_mail = async function (request, response) {
	const mail_content = request.body;
	const timestamp = Date.now();
	await db_access.newdoc('asset_req', {
		timestamp: timestamp,
		mail_content: mail_content
	});
	response.send("mail sent");
}
