const authRoute = require("./auth.route");


module.exports = (app) => {
    app.use("/api/auth", authRoute);
}