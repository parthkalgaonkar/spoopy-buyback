// Handles communication with firestore db
// set: sets document at given path with data
// get: returns data in document at given path if exists, else undefined

const admin = require('firebase-admin');
admin.initializeApp();

exports.set = async function (path, data) {
	const docRef = admin.firestore().doc(path);
	await docRef.set(data);
}

exports.get = async function (path) {
	const docRef = admin.firestore().doc(path);
	const doc = await docRef.get();
	return doc.data();
}

exports.newdoc = async function (path, data) {
	const docRef = admin.firestore().collection(path).doc();
	await docRef.set(data);
}

exports.col = function (path) {
	return admin.firestore().collection(path);
}
