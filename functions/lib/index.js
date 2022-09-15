"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directorAuth = exports.helloWorld = void 0;
const functions = require("firebase-functions");
const node_fetch_1 = require("node-fetch");
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});
exports.directorAuth = functions.https.onRequest(async (request, response) => {
    const auth_code = request.query.auth_code;
    if (auth_code === undefined) {
        functions.logger.info("auth_code empty");
        response
            .status(400)
            .send({ message: "GET request must have auth_code parameter" });
        return;
    }
    const clientID = "c1f7d24cac80406998fd9bb71224e4b5";
    const secretKey = "KoUAzVeYd7P3xtqp7BXwA4no2t6IYzSXWNBbMcWB";
    const auth_b64 = btoa(unescape(encodeURIComponent(clientID + ":" + secretKey)));
    const auth_header = {
        "Authorization": "Basic " + auth_b64,
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "login.eveonline.com"
    };
    const auth_form = "grant_type=authorization_code&code=" + auth_code;
    const auth_url = "https://login.eveonline.com/v2/oauth/token";
    const req = (0, node_fetch_1.default)(auth_url, {
        method: "POST",
        headers: auth_header,
        body: auth_form
    });
    const resp = await req;
    let data = await resp.json();
    data = data;
    response.send(data["access_token"]);
});
//# sourceMappingURL=index.js.map