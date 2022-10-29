const functions 		= require("firebase-functions");
const cors 					= require('cors')({origin: true});
const director_auth = require('./director_auth');
const get_assets 		= require('./get_assets');
const send_mail 		= require('./send_mail');


exports.helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", {structuredData: true});
	response.send("Hello from Firebase!");
});


exports.directorAuth = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		try {
			await director_auth.director_auth(request, response);
		} catch (err) {
			functions.logger.error(err, {structuredData: true});
			response.status(500).send("Could not authenticate: Internal error");
		}
	});
});

exports.getAssets = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		try {
			await get_assets.get_assets(request, response);
		} catch (err) {
			functions.logger.error(err, {structuredData: true});
			response.status(500).send("Could not refresh asset data");
		}
	});
});

exports.sendMail = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		try {
			await send_mail.send_mail(request, response);
		} catch (err) {
			functions.logger.error(err, {structuredData: true});
			response.status(500).send("Could not send confirmation mail");
		}
	});
});
