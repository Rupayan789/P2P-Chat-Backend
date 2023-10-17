const admin = require("firebase-admin");
const config = require("./config");

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.firebase.project_id,
    clientEmail: config.firebase.client_email,
    privateKey: config.firebase.private_key.replace(/\\n/g, "\n"),
  }),
  databaseURL: config.firebase.databaseURL,
  // credential: admin.credential.cert(serviceAccount),
});
const db = admin.database(app);

module.exports = { admin, db };
