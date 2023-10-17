const dotenv = require("dotenv");
const Joi = require("joi");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "/../.env") });

const envVarsScheme = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(8080),
    FIREBASE_PROJECT_ID: Joi.string()
      .required()
      .description("Firebase project ID"),
    FIREBASE_CLIENT_EMAIL: Joi.string()
      .required()
      .description("Firebase client email"),
    FIREBASE_PRIVATE_KEY: Joi.string()
      .required()
      .description("Firebase private key"),
    FIREBASE_DATABASE_URL: Joi.string()
      .required()
      .description("Firebase database url"),
  })
  .unknown();

const { value: envVars, error } = envVarsScheme
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  firebase: {
    project_id: envVars.FIREBASE_PROJECT_ID,
    client_email: envVars.FIREBASE_CLIENT_EMAIL,
    private_key: envVars.FIREBASE_PRIVATE_KEY,
    databaseURL: envVars.FIREBASE_DATABASE_URL,
  },
};
