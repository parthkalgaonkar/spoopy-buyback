// Wrapper around ESI accesses

const axios = require('axios').default;
const jose = require('jose');

const ESI_COMMON = "https://esi.evetech.net/latest/";
const SPOOPY_CORP_ID = "98475239";

function asset_ep() {
	return "corporations/"+SPOOPY_CORP_ID+"/assets/";
}

function mail_ep(char_id) {
	return "characters/"+char_id+"/mail/";
}

async function esi_request(ep, mode, query=undefined, header={}) {
	// Requests data from 'ep' endpoint
	// Using method 'mode' (GET or POST)
	// With query string 'query' and 'header' as the req header
	return await axios({
		url: ESI_COMMON+ep,
		method: mode,
		headers: header,
		data: query
	});
}

async function auth_esi_request(ep, mode, token, query=undefined, header={}) {
	header.Authorization = "Bearer "+token;
	return await esi_request(ep, mode, query, header);
}

async function asset_headers(token) {
	const ep = asset_ep();
	const resp = await auth_esi_request(ep, "head", token);
	return {
		pages: resp.headers['x-pages'],
		expires: resp.headers['expires']
	};
}

async function asset_page(page_idx, token){
	const ep = asset_ep();
	const resp = await auth_esi_request(ep, "get", token, "page="+page_idx);
	return resp.data;
}

exports.get_assets = async function (token) {
	const headers = await asset_headers(token);
	const pages = [...Array(headers.pages).keys()];
	const promises = pages.map((idx) => asset_page(idx, token));
	const results = await Promise.all(promises);
	const assets = results.reduce((prev, curr) => prev.concat(curr), []);
	return {
		data: assets,
		headers: headers
	};
}

exports.send_mail = async function (token, sender_id, body) {
	const ep = mail_ep(sender_id);
	const mail_body = {
		body: 			body,
		recipients: [{recipient_id: Number(98475239), recipient_type: "corporation"}],
		subject: 		"[SPOOPY SELLFORE] New buy order created"
	}
	const resp = await auth_esi_request(ep, "post", token, JSON.stringify(mail_body));
}
